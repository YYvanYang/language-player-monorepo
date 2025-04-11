// apps/user-app/app/(main)/upload/page.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
    requestUploadAction,
    createTrackMetadataAction,
    requestBatchUploadAction,
    completeBatchUploadAction
} from '@/../_actions/uploadActions';
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner } from '@repo/ui'; // Adjust alias
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import type {
    AudioLevel,
    CompleteUploadRequestDTO,
    BatchCompleteUploadItemDTO,
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { cn } from '@repo/utils';

// --- Single File Upload State ---
type SingleUploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';

// --- Batch File Upload State ---
interface BatchFileStatus {
    file: File;
    status: 'pending' | 'requesting' | 'uploading' | 'error' | 'uploaded';
    progress: number;
    uploadUrl?: string;
    objectKey?: string;
    errorMsg?: string;
    metadata?: Partial<BatchCompleteUploadItemDTO>; // Store metadata entered by user
}
type BatchUploadStage = 'select' | 'uploading' | 'metadata' | 'completing' | 'results';

export default function UploadPage() {
    const router = useRouter();

    // --- Single Upload State & Logic ---
    const [singleFile, setSingleFile] = useState<File | null>(null);
    const [singleStage, setSingleStage] = useState<SingleUploadStage>('select');
    const [singleError, setSingleError] = useState<string | null>(null);
    const [singleProgress, setSingleProgress] = useState(0);
    const [singleUploadResult, setSingleUploadResult] = useState<{ uploadUrl: string; objectKey: string } | null>(null);
    const [singleIsProcessing, startSingleTransition] = useTransition();

    const { register: registerMeta, handleSubmit: handleMetaSubmit, formState: { errors: metaErrors }, reset: resetMetaForm, setValue: setMetaValue } = useForm<CompleteUploadRequestDTO>();

    const handleSingleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSingleFile(file);
            setSingleStage('select');
            setSingleError(null);
            setSingleProgress(0);
            setSingleUploadResult(null);
            resetMetaForm(); // Reset metadata form too
            // Attempt to get duration client-side
            getAudioDuration(file).then(duration => {
                if (duration) setMetaValue('durationMs', duration);
            });
        }
    };

    const handleSingleUpload = useCallback(async () => {
        if (!singleFile) {
            setSingleError("Please select a file.");
            return;
        }
        setSingleStage('requestingUrl');
        setSingleError(null);
        startSingleTransition(async () => {
            const urlResult = await requestUploadAction(singleFile.name, singleFile.type);
            if (!urlResult.success || !urlResult.uploadUrl || !urlResult.objectKey) {
                setSingleError(urlResult.message || "Failed to prepare upload.");
                setSingleStage('error');
                return;
            }
            setSingleUploadResult({ uploadUrl: urlResult.uploadUrl, objectKey: urlResult.objectKey });
            setSingleStage('uploading');

            // Perform direct upload
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', urlResult.uploadUrl, true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) setSingleProgress(Math.round((event.loaded / event.total) * 100));
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setSingleStage('metadata'); // Move to metadata entry
                    setMetaValue('objectKey', urlResult.objectKey); // Pre-fill objectKey
                } else {
                    setSingleError(`Upload failed: ${xhr.statusText || 'Network Error'}`);
                    setSingleStage('error');
                }
            };
            xhr.onerror = () => {
                setSingleError("Upload failed due to network error.");
                setSingleStage('error');
            };
            xhr.setRequestHeader('Content-Type', singleFile.type);
            xhr.send(singleFile);
        });
    }, [singleFile, setMetaValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
        if (!singleUploadResult?.objectKey) {
            setSingleError("Upload result missing. Please try again.");
            setSingleStage('error');
            return;
        }
        // Ensure objectKey is correct
        data.objectKey = singleUploadResult.objectKey;
        // Basic validation if needed before action
        if (data.durationMs <= 0) {
            // RHF should catch this, but double check
            setSingleError("Duration must be positive.");
            return;
        }

        setSingleStage('completing');
        setSingleError(null);
        startSingleTransition(async () => {
            // Pass data directly now
            const result = await createTrackMetadataAction(data.objectKey, data); // Use adjusted action if needed
            if (result.success && result.track) {
                setSingleStage('success');
                setSingleError(null);
                // Invalidate cache or redirect
                // revalidateTag('tracks'); // Actions do this
                router.push('/tracks');
            } else {
                setSingleError(result.message || "Failed to create track metadata.");
                setSingleStage('error');
            }
        });
    };

    // --- Batch Upload State & Logic ---
    const [batchFiles, setBatchFiles] = useState<BatchFileStatus[]>([]);
    const [batchStage, setBatchStage] = useState<BatchUploadStage>('select');
    const [batchError, setBatchError] = useState<string | null>(null);
    const [batchIsProcessing, startBatchTransition] = useTransition();
    const [batchResults, setBatchResults] = useState<BatchCompleteUploadResponseItemDTO[]>([]);

    const { control: batchControl, register: batchRegister, handleSubmit: handleBatchMetaSubmit, formState: { errors: batchMetaErrors }, reset: resetBatchMetaForm, getValues: getBatchMetaValues, setValue: setBatchMetaValue } = useForm<{ tracks: BatchCompleteUploadItemDTO[] }>({ defaultValues: { tracks: [] } });
    const { fields, append, remove } = useFieldArray({ control: batchControl, name: "tracks", keyName: "formId" }); // Use 'formId' as key

    const handleBatchFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setBatchStage('select');
        setBatchError(null);
        setBatchResults([]);

        const newFileStatuses: BatchFileStatus[] = [];
        for (const file of Array.from(files)) {
             const duration = await getAudioDuration(file); // Await duration detection
             newFileStatuses.push({
                file: file, status: 'pending', progress: 0,
                metadata: { // Pre-fill filename as title and detected duration
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                    durationMs: duration ?? 0, // Use detected duration or 0
                }
             });
        }
        setBatchFiles(newFileStatuses);
        // Reset field array for metadata form
         resetBatchMetaForm({ tracks: newFileStatuses.map(fs => ({ ...fs.metadata, objectKey: '' })) as BatchCompleteUploadItemDTO[] });
    };

    const handleBatchUpload = useCallback(() => {
        if (batchFiles.length === 0 || batchFiles.some(f => f.status !== 'pending')) return;

        setBatchStage('uploading');
        setBatchError(null);
        startBatchTransition(async () => {
            const requestItems = batchFiles.map(f => ({ filename: f.file.name, contentType: f.file.type }));
            const urlResult = await requestBatchUploadAction(requestItems);

            if (!urlResult.success || !urlResult.results) {
                setBatchError(urlResult.message || "Failed to get batch upload URLs.");
                setBatchStage('select'); // Revert stage?
                return;
            }

            const uploadPromises: Promise<void>[] = [];
            const updatedFileStatuses = [...batchFiles]; // Create copy to update status

            urlResult.results.forEach((resItem) => {
                const fileIndex = updatedFileStatuses.findIndex(f => f.file.name === resItem.originalFilename);
                if (fileIndex === -1) return; // Should not happen

                if (resItem.error || !resItem.uploadUrl || !resItem.objectKey) {
                    updatedFileStatuses[fileIndex].status = 'error';
                    updatedFileStatuses[fileIndex].errorMsg = resItem.error || 'Missing URL/Key';
                    return;
                }

                updatedFileStatuses[fileIndex].status = 'requesting'; // Mark as ready to upload
                updatedFileStatuses[fileIndex].uploadUrl = resItem.uploadUrl;
                updatedFileStatuses[fileIndex].objectKey = resItem.objectKey;
                 // Update the corresponding metadata form field with the objectKey
                 setBatchMetaValue(`tracks.${fileIndex}.objectKey`, resItem.objectKey);

                // Create upload promise
                const promise = new Promise<void>((resolve, reject) => {
                    const fileStatus = updatedFileStatuses[fileIndex];
                    setBatchFiles(prev => prev.map(f => f.file.name === fileStatus.file.name ? { ...f, status: 'uploading' } : f));

                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', resItem.uploadUrl, true);
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setBatchFiles(prev => prev.map(f => f.file.name === fileStatus.file.name ? { ...f, progress: progress } : f));
                        }
                    };
                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            setBatchFiles(prev => prev.map(f => f.file.name === fileStatus.file.name ? { ...f, status: 'uploaded', progress: 100 } : f));
                            resolve();
                        } else {
                            const errorMsg = `Upload failed: ${xhr.statusText || 'Network Error'}`;
                            setBatchFiles(prev => prev.map(f => f.file.name === fileStatus.file.name ? { ...f, status: 'error', errorMsg: errorMsg } : f));
                            reject(new Error(errorMsg));
                        }
                    };
                    xhr.onerror = () => {
                         const errorMsg = "Upload failed due to network error.";
                         setBatchFiles(prev => prev.map(f => f.file.name === fileStatus.file.name ? { ...f, status: 'error', errorMsg: errorMsg } : f));
                         reject(new Error(errorMsg));
                    };
                    xhr.setRequestHeader('Content-Type', fileStatus.file.type);
                    xhr.send(fileStatus.file);
                });
                uploadPromises.push(promise);
            });

            setBatchFiles(updatedFileStatuses); // Update UI with statuses/keys

            // Wait for all uploads to finish or error
            try {
                await Promise.all(uploadPromises);
                // Check if any upload failed after Promise.all finishes
                const finalStatuses = get().batchFiles; // Get latest state
                if (finalStatuses.some(f => f.status === 'error')) {
                    throw new Error("One or more file uploads failed.");
                }
                console.log("All batch uploads successful.");
                setBatchStage('metadata'); // Move to metadata entry stage if all uploads succeed
            } catch (uploadError) {
                console.error("Batch upload process encountered errors:", uploadError);
                setBatchError("Some uploads failed. Please review and try again.");
                // Keep stage as 'uploading' to show errors? Or move to 'error'?
                // Let's keep 'uploading' so user sees the individual errors
            }
        });
    }, [batchFiles, setBatchMetaValue]); // Include setBatchMetaValue

    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        // data.tracks should contain the metadata entered by the user AND the objectKey set previously
        // Filter out any items that had upload errors if necessary (though they shouldn't be submitted ideally)
        const validTracksToComplete = data.tracks.filter((item, index) => batchFiles[index]?.status === 'uploaded');

        if (validTracksToComplete.length === 0) {
             setBatchError("No successfully uploaded files to complete.");
             return;
        }

        setBatchStage('completing');
        setBatchError(null);
        startBatchTransition(async () => {
            const result = await completeBatchUploadAction(validTracksToComplete);
            setBatchResults(result.results ?? []); // Store detailed results
            setBatchStage('results'); // Go to results view
            if (!result.success) {
                setBatchError(result.message || "Batch completion failed.");
            }
            // Invalidate track list cache via action
        });
    };

    // --- Client-side duration helper ---
    const getAudioDuration = (audioFile: File): Promise<number | null> => {
         return new Promise((resolve) => {
             if (!audioFile || !window.AudioContext) { resolve(null); return; }
             const reader = new FileReader();
             reader.onload = (e) => {
                 const audioContext = new AudioContext();
                 audioContext.decodeAudioData(e.target?.result as ArrayBuffer)
                     .then(buffer => {
                         audioContext.close(); // Close context after use
                         resolve(Math.round(buffer.duration * 1000));
                     })
                     .catch(err => {
                         console.warn("Could not decode audio client-side:", err);
                         audioContext.close();
                         resolve(null);
                     });
             };
             reader.onerror = () => { console.warn("FileReader error."); resolve(null); };
             reader.readAsArrayBuffer(audioFile);
         });
     };

    return (
        <div className="space-y-8">
            {/* --- Single File Upload Section --- */}
            <section>
                <h2 className="text-xl font-semibold mb-3 border-b pb-2">Single Track Upload</h2>
                 {/* Error Display */}
                {singleError && (
                    <div className="mb-4 p-3 border border-red-400 bg-red-100 text-red-700 rounded-md flex items-center justify-between">
                        <span><AlertTriangle className="inline h-4 w-4 mr-2"/> {singleError}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setSingleError(null); setSingleStage('select'); setSingleFile(null); }}><X size={16}/></Button>
                    </div>
                )}

                 {/* Success Message */}
                 {singleStage === 'success' && (
                     <div className="mb-4 p-3 border border-green-400 bg-green-100 text-green-700 rounded-md flex items-center">
                         <CheckCircle className="inline h-4 w-4 mr-2"/> Track created successfully!
                     </div>
                 )}


                {/* Stages */}
                {['select', 'requestingUrl', 'uploading', 'error'].includes(singleStage) && (
                    <div className="space-y-3">
                         <Label htmlFor="singleAudioFile">Select Audio File</Label>
                         <Input
                            id="singleAudioFile"
                            type="file"
                            accept="audio/*"
                            onChange={handleSingleFileChange}
                            disabled={singleIsProcessing || singleStage === 'uploading'}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                         {singleFile && <p className="text-sm text-slate-600">Selected: {singleFile.name}</p>}
                         {singleStage === 'uploading' && (
                             <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 my-2">
                                 <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${singleProgress}%` }}></div>
                                 <p className="text-center text-xs mt-1">{singleProgress}% Uploaded</p>
                             </div>
                         )}
                        <Button
                            onClick={handleSingleUpload}
                            disabled={!singleFile || singleIsProcessing || singleStage === 'uploading'}
                        >
                            {(singleIsProcessing && singleStage === 'requestingUrl') && <Loader className="h-4 w-4 mr-2 animate-spin"/>}
                            {(singleStage === 'uploading') ? 'Uploading...' : 'Upload & Add Details'}
                        </Button>
                    </div>
                )}

                {singleStage === 'metadata' && singleUploadResult?.objectKey && (
                     <form onSubmit={handleMetaSubmit(onMetadataSubmit)} className="space-y-4 mt-4">
                         <h3 className="font-medium">Enter Track Details</h3>
                         <input type="hidden" {...registerMeta('objectKey')} />

                         {/* Metadata Fields */}
                        <div><Label htmlFor="meta-title">Title*</Label><Input id="meta-title" {...registerMeta('title', { required: true })} />{metaErrors.title && <p className='err'>Title required</p>}</div>
                        <div><Label htmlFor="meta-desc">Description</Label><Textarea id="meta-desc" {...registerMeta('description')} /></div>
                        <div><Label htmlFor="meta-lang">Language Code*</Label><Input id="meta-lang" {...registerMeta('languageCode', { required: true })} />{metaErrors.languageCode && <p className='err'>Lang required</p>}</div>
                         <div><Label htmlFor="meta-level">Level</Label>
                            <Select id="meta-level" {...registerMeta('level')}><option value="">Any Level</option><option value="A1">A1</option>...</Select></div>
                         <div><Label htmlFor="meta-duration">Duration (ms)*</Label><Input id="meta-duration" type="number" {...registerMeta('durationMs', { required: true, valueAsNumber: true, min: 1 })} />{metaErrors.durationMs && <p className='err'>Duration required</p>}</div>
                        <div className="flex items-center space-x-2"><Checkbox id="meta-public" {...registerMeta('isPublic')}/> <Label htmlFor="meta-public">Public</Label></div>
                        <div><Label htmlFor="meta-tags">Tags (comma-separated)</Label><Input id="meta-tags" {...registerMeta('tags', { setValueAs: (v) => v ? v.split(',').map((t:string)=>t.trim()).filter(Boolean) : [] })} /></div>
                        <div><Label htmlFor="meta-cover">Cover Image URL</Label><Input id="meta-cover" type="url" {...registerMeta('coverImageUrl')} /></div>

                        <Button type="submit" disabled={singleIsProcessing}>
                            {singleIsProcessing ? <Spinner size="sm" /> : 'Create Track'}
                        </Button>
                    </form>
                )}
            </section>

            {/* --- Batch File Upload Section --- */}
            <section>
                 <h2 className="text-xl font-semibold mb-3 border-b pb-2">Batch Track Upload</h2>
                 {/* Batch Error Display */}
                {batchError && (
                    <div className="mb-4 p-3 border border-red-400 bg-red-100 text-red-700 rounded-md flex items-center justify-between">
                        <span><AlertTriangle className="inline h-4 w-4 mr-2"/> {batchError}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setBatchError(null); setBatchStage('select'); setBatchFiles([]); }}><X size={16}/></Button>
                    </div>
                )}

                {batchStage === 'select' && (
                    <div className="space-y-3">
                         <Label htmlFor="batchAudioFiles">Select Multiple Audio Files</Label>
                         <Input
                            id="batchAudioFiles"
                            type="file"
                            accept="audio/*"
                            multiple
                            onChange={handleBatchFileChange}
                            disabled={batchIsProcessing}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {batchFiles.length > 0 && (
                            <Button onClick={handleBatchUpload} disabled={batchIsProcessing}>
                                {batchIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                Upload {batchFiles.length} File(s)
                            </Button>
                        )}
                    </div>
                )}

                {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing') && (
                    <div className="space-y-2">
                        <h3 className="font-medium">Upload Progress & Metadata:</h3>
                         {batchFiles.map((item, index) => (
                             <div key={item.file.name + index} className="p-2 border rounded flex flex-col md:flex-row md:items-center gap-2">
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate"><FileAudio size={14} className="inline mr-1"/> {item.file.name}</p>
                                    {item.status === 'uploading' && <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div></div>}
                                    {item.status === 'uploaded' && <p className="text-xs text-green-600"><CheckCircle size={12} className="inline mr-1"/> Ready for metadata</p>}
                                    {item.status === 'error' && <p className="text-xs text-red-600"><AlertTriangle size={12} className="inline mr-1"/> {item.errorMsg || 'Error'}</p>}
                                </div>
                                 {/* Inline Metadata Form for this item (only show if uploaded/ready) */}
                                 {batchStage === 'metadata' && item.status === 'uploaded' && (
                                     <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-xs border-l md:pl-3 mt-2 md:mt-0 pt-2 md:pt-0">
                                         {/* Hidden object key */}
                                         <input type="hidden" {...batchRegister(`tracks.${index}.objectKey`)} />
                                         {/* Simplified metadata inputs */}
                                         <div><Label className="text-xs">Title*</Label><Input size="sm" {...batchRegister(`tracks.${index}.title`, {required: true})} /></div>
                                         <div><Label className="text-xs">Language*</Label><Input size="sm" placeholder="en-US" {...batchRegister(`tracks.${index}.languageCode`, {required: true})} /></div>
                                         <div><Label className="text-xs">Level</Label><Select size="sm" {...batchRegister(`tracks.${index}.level`)}><option value="">Any</option><option value="A1">A1</option>...</Select></div>
                                         <div><Label className="text-xs">Duration(ms)*</Label><Input size="sm" type="number" {...batchRegister(`tracks.${index}.durationMs`, {required: true, valueAsNumber: true, min: 1})} /></div>
                                         <div className="col-span-1 md:col-span-2 lg:col-span-3"><Label className="text-xs">Description</Label><Input size="sm" {...batchRegister(`tracks.${index}.description`)} /></div>
                                         {/* Add Public, Tags, Cover as needed */}
                                    </div>
                                 )}
                            </div>
                         ))}
                        {batchStage === 'metadata' && batchFiles.some(f => f.status === 'uploaded') && (
                            <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)}>
                                <Button type="submit" disabled={batchIsProcessing} className="mt-4">
                                    {batchIsProcessing ? <Spinner size="sm"/> : <ListPlus size={16} className="mr-1"/>}
                                    Complete Batch & Create Tracks
                                </Button>
                            </form>
                         )}
                    </div>
                )}

                 {batchStage === 'results' && (
                     <div>
                        <h3 className="font-medium mb-3">Batch Processing Results:</h3>
                        {batchError && <p className="text-red-600 mb-3">{batchError}</p>}
                        <ul className="space-y-2">
                            {batchResults.map((res, index) => (
                                <li key={res.objectKey || index} className={`p-2 border rounded flex justify-between items-center ${res.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                                     <span className="text-sm truncate">{batchFiles.find(f => f.objectKey === res.objectKey)?.file.name ?? res.objectKey}</span>
                                    {res.success ?
                                        <span className="text-green-700 text-sm flex items-center"><CircleCheckBig size={16} className="mr-1"/> Created ({res.trackId?.substring(0,8)}...)</span> :
                                        <span className="text-red-700 text-sm flex items-center"><CircleX size={16} className="mr-1"/> Failed: {res.error || 'Unknown Error'}</span>
                                    }
                                </li>
                            ))}
                        </ul>
                         <Button onClick={() => { setBatchStage('select'); setBatchFiles([]); setBatchResults([]); setBatchError(null); resetBatchMetaForm(); }} className="mt-4">Upload More</Button>
                    </div>
                )}

            </section>
        </div>
    );
}