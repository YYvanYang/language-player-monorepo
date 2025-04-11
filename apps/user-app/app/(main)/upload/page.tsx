// apps/user-app/app/(main)/upload/page.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useTransition, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    requestUploadAction, // Use USER actions
    createTrackMetadataAction, // Use USER actions
    requestBatchUploadAction, // Use USER actions
    completeBatchUploadAction // Use USER actions
} from '@/_actions/uploadActions';
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft } from 'lucide-react';
import type {
    AudioLevel,
    CompleteUploadRequestDTO, // Type from @repo/types
    BatchCompleteUploadItemDTO, // Type from @repo/types
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { cn } from '@repo/utils';
import Link from 'next/link';

// --- State Types ---
type SingleUploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';
interface BatchFileStatus {
    id: string; // Unique ID for list key
    file: File;
    status: 'pending' | 'requesting' | 'uploading' | 'error' | 'uploaded';
    progress: number;
    uploadUrl?: string;
    objectKey?: string;
    errorMsg?: string;
    xhr?: XMLHttpRequest; // To allow cancellation
}
type BatchUploadStage = 'select' | 'uploading' | 'metadata' | 'completing' | 'results';

// --- Helper ---
// Client-side duration detection (remains the same)
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
        // Safari needs explicit check
        if (typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
             console.warn("AudioContext not supported, cannot detect duration client-side.");
             return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (!e.target?.result) return resolve(null);
            audioContext.decodeAudioData(e.target.result as ArrayBuffer)
                .then(buffer => resolve(Math.round(buffer.duration * 1000)))
                .catch(err => {
                    console.warn("Could not decode audio file client-side to get duration:", err);
                    resolve(null);
                });
        };
        reader.onerror = () => {
            console.warn("FileReader error trying to get duration.");
            resolve(null);
        };
        reader.readAsArrayBuffer(audioFile);
    });
};


export default function UploadPage() {
    const router = useRouter();

    // --- Single Upload State & Logic ---
    const [singleFile, setSingleFile] = useState<File | null>(null);
    const [singleStage, setSingleStage] = useState<SingleUploadStage>('select');
    const [singleError, setSingleError] = useState<string | null>(null);
    const [singleProgress, setSingleProgress] = useState(0);
    const [singleUploadResult, setSingleUploadResult] = useState<{ uploadUrl: string; objectKey: string } | null>(null);
    const [singleIsProcessing, startSingleTransition] = useTransition();
    const singleXhrRef = useRef<XMLHttpRequest | null>(null);

    // RHF for single upload metadata form
    const { register: registerMeta, handleSubmit: handleMetaSubmit, formState: { errors: metaErrors }, reset: resetMetaForm, setValue: setMetaValue, watch: watchMeta } = useForm<CompleteUploadRequestDTO>({
        defaultValues: { isPublic: true } // Default public for user uploads?
    });

    // --- Single Upload Functions ---
    const resetSingleUpload = useCallback(() => {
        if (singleXhrRef.current) { singleXhrRef.current.abort(); singleXhrRef.current = null; }
        setSingleFile(null); setSingleStage('select'); setSingleError(null); setSingleProgress(0); setSingleUploadResult(null); resetMetaForm({ isPublic: true });
        const fileInput = document.getElementById('singleAudioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [resetMetaForm]);

    const handleSingleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetSingleUpload();
        const file = event.target.files?.[0];
        if (file) {
            setSingleFile(file);
            setValue('title', file.name.replace(/\.[^/.]+$/, ""));
            const duration = await getAudioDuration(file);
            setValue('durationMs', duration ?? 0); // Set duration or 0
        }
    }, [resetSingleUpload, setValue]);

    const handleRequestSingleUpload = useCallback(async () => {
        if (!singleFile || singleStage !== 'select') return;
        setErrorMsg(null); setSingleProgress(0); setSingleStage('requestingUrl');
        startSingleTransition(async () => {
            const result = await requestUploadAction(singleFile.name, singleFile.type);
            if (!result.success || !result.uploadUrl || !result.objectKey) {
                setSingleError(result.message || "Failed to prepare upload."); setSingleStage('error'); return;
            }
            setSingleUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
            setSingleStage('uploading');
            handleDirectUpload(result.uploadUrl, result.objectKey, setSingleProgress, () => { singleXhrRef.current = null; setSingleStage('metadata'); setValue('objectKey', result.objectKey); }, (errMsg) => { singleXhrRef.current = null; setSingleError(errMsg); setSingleStage('error'); }, singleXhrRef);
        });
    }, [singleFile, singleStage, setValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!singleUploadResult?.objectKey || singleStage !== 'metadata') return;
         // RHF data should be correct types, but ensure tags/optional handled
         data.tags = (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [];
         data.level = data.level === "" ? undefined : data.level;
         data.coverImageUrl = data.coverImageUrl === "" ? undefined : data.coverImageUrl;

         setSingleStage('completing'); setSingleError(null);
         startSingleTransition(async () => {
             const result = await createTrackMetadataAction(data); // Pass DTO directly
             if (result.success && result.track) {
                 setSingleStage('success');
                 setTimeout(() => router.push(`/tracks/${result.track?.id}`), 1500);
             } else {
                 setSingleError(result.message || "Failed to create track.");
                 setSingleStage('metadata');
             }
         });
     };

    // --- Batch Upload State & Logic ---
    const [batchFiles, setBatchFiles] = useState<BatchFileStatus[]>([]);
    const [batchStage, setBatchStage] = useState<BatchUploadStage>('select');
    const [batchError, setBatchError] = useState<string | null>(null);
    const [batchIsProcessing, startBatchTransition] = useTransition();
    const [batchResults, setBatchResults] = useState<BatchCompleteUploadResponseItemDTO[]>([]);

    // RHF for batch metadata form
    const { control: batchControl, register: batchRegister, handleSubmit: handleBatchMetaSubmit, formState: { errors: batchMetaErrors }, reset: resetBatchMetaForm, getValues: getBatchMetaValues, setValue: setBatchMetaValue, watch: watchBatch } = useForm<{ tracks: BatchCompleteUploadItemDTO[] }>({ defaultValues: { tracks: [] } });
    const { fields, append, remove, replace } = useFieldArray({ control: batchControl, name: "tracks", keyName: "formId" }); // Use "formId" for unique key

    // --- Batch Upload Functions ---
    const resetBatchUpload = useCallback(() => {
        batchFiles.forEach(bf => bf.xhr?.abort());
        setBatchFiles([]); setBatchStage('select'); setBatchError(null); setBatchResults([]); replace([]);
        const fileInput = document.getElementById('batchAudioFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [batchFiles, replace]);

     const handleBatchFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetBatchUpload();
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newFileStatuses: BatchFileStatus[] = [];
        const metadataDefaults: Partial<BatchCompleteUploadItemDTO>[] = [];

        // Show loading state while processing files client-side
        setBatchStage('uploading'); // Use 'uploading' state to show processing indicator
        startBatchTransition(async () => {
             for (const file of Array.from(files)) {
                 const duration = await getAudioDuration(file);
                 const fileId = crypto.randomUUID();
                 newFileStatuses.push({ id: fileId, file, status: 'pending', progress: 0 });
                 metadataDefaults.push({
                     title: file.name.replace(/\.[^/.]+$/, ""), durationMs: duration ?? 0, isPublic: true, languageCode: '', level: undefined, description: '', tags: [], coverImageUrl: ''
                 });
             }
             setBatchFiles(newFileStatuses);
             replace(metadataDefaults as BatchCompleteUploadItemDTO[]);
             setBatchStage('select'); // Go back to select stage after processing
        });

    }, [resetBatchUpload, replace]);

    const handleBatchUpload = useCallback(async () => {
        const pendingFiles = batchFiles.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0 || batchStage !== 'select') return;

        setBatchStage('uploading'); setBatchError(null);
        startBatchTransition(async () => {
            const requestItems = pendingFiles.map(f => ({ filename: f.file.name, contentType: f.file.type }));
            const urlResult = await requestBatchUploadAction(requestItems);

            if (!urlResult.success || !urlResult.results) {
                setBatchError(urlResult.message || "Failed to prepare batch upload URLs.");
                setBatchStage('error'); // Or back to 'select' with error?
                return;
            }

            // Match results back to files and prepare for uploads
            const uploadPromises: Promise<boolean>[] = []; // Promise resolves to true on success, false on error
            let filesToUpload: BatchFileStatus[] = [];

            setBatchFiles(currentFiles => {
                filesToUpload = currentFiles.map(bf => {
                    if (bf.status !== 'pending') return bf; // Skip already processed/error files

                    const resultItem = urlResult.results?.find(res => res.originalFilename === bf.file.name);
                    if (!resultItem || resultItem.error || !resultItem.uploadUrl || !resultItem.objectKey) {
                        return { ...bf, status: 'error', errorMsg: resultItem?.error || 'Missing URL/Key' };
                    }
                    // Find corresponding RHF field index
                    const rhfIndex = currentFiles.findIndex(f => f.id === bf.id);
                    if (rhfIndex !== -1) {
                        setBatchMetaValue(`tracks.${rhfIndex}.objectKey`, resultItem.objectKey);
                    }
                    return { ...bf, status: 'requesting', uploadUrl: resultItem.uploadUrl, objectKey: resultItem.objectKey };
                });
                return filesToUpload; // Update state with keys/statuses
            });


            // Start individual uploads
            filesToUpload.filter(f => f.status === 'requesting').forEach(fileStatus => {
                 const rhfIndex = fields.findIndex(field => field.id === fileStatus.id); // Find index using RHF keyName if id matches

                 const promise = new Promise<boolean>((resolve) => {
                     setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading', progress: 0 } : f));

                     const xhr = new XMLHttpRequest();
                     fileStatus.xhr = xhr; // Store ref

                     xhr.open('PUT', fileStatus.uploadUrl!, true);
                     xhr.upload.onprogress = (event) => {
                          if (event.lengthComputable) {
                             const progress = Math.round((event.loaded / event.total) * 100);
                             setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, progress: progress } : f));
                          }
                     };
                     xhr.onload = () => {
                         fileStatus.xhr = null;
                         const success = xhr.status >= 200 && xhr.status < 300;
                         setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: success ? 'uploaded' : 'error', errorMsg: success ? undefined : `Upload failed (${xhr.status})` } : f));
                         resolve(success);
                     };
                     xhr.onerror = () => {
                         fileStatus.xhr = null;
                         const errorMsg = xhr.status === 0 ? "Network error or cancelled" : "Upload error";
                         setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'error', errorMsg: errorMsg } : f));
                         resolve(false);
                     };
                     xhr.onabort = () => { fileStatus.xhr = null; resolve(false); }; // Treat abort as failure for promise
                     xhr.setRequestHeader('Content-Type', fileStatus.file.type);
                     xhr.send(fileStatus.file);
                 });
                 uploadPromises.push(promise);
            });

             try {
                 const uploadOutcomes = await Promise.all(uploadPromises);
                 const allSucceeded = uploadOutcomes.every(success => success);
                 if (allSucceeded) {
                     setBatchStage('metadata');
                     console.log("All batch uploads successful.");
                 } else {
                      setBatchError("One or more files failed to upload. Please review statuses.");
                      setBatchStage('uploading'); // Stay on uploading stage to show errors
                     console.warn("Some batch uploads failed.");
                 }
             } catch (uploadError: any) {
                 console.error("Batch upload general error:", uploadError);
                 setBatchError(uploadError.message || "Some uploads failed unexpectedly.");
                 setBatchStage('uploading'); // Stay on uploading stage
             }
        });
    }, [batchFiles, batchStage, setBatchMetaValue, fields]);


    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        // Filter data to include only those successfully uploaded and having an objectKey
        const tracksToComplete = data.tracks.filter((item, index) =>
            batchFiles[index]?.status === 'uploaded' && !!item.objectKey
        ).map((item) => { // Clean up optional fields for the API call
            return {
                ...item,
                level: item.level === "" ? undefined : item.level,
                description: item.description === "" ? undefined : item.description,
                coverImageUrl: item.coverImageUrl === "" ? undefined : item.coverImageUrl,
                tags: (item.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
                isPublic: item.isPublic ?? false,
            };
        });


        if (tracksToComplete.length === 0) {
            setBatchError("No completed uploads with metadata to finalize.");
            return;
        }

        setBatchStage('completing'); setBatchError(null);
        startBatchTransition(async () => {
            const result = await completeBatchUploadAction(tracksToComplete);
            setBatchResults(result.results ?? []); // Store detailed results
            setBatchStage('results'); // Move to results stage regardless of partial failures
            if (!result.success) {
                setBatchError(result.message || "Batch completion reported errors.");
            }
        });
    };

    // --- Generic Direct Upload Helper ---
    const handleDirectUpload = useCallback((
        url: string,
        objKey: string,
        setProgress: (p: number) => void,
        onSuccess: () => void,
        onError: (msg: string) => void,
        xhrRef: React.MutableRefObject<XMLHttpRequest | null>
    ) => {
        const fileToUpload = singleFile; // Use singleFile state for this instance
        if (!fileToUpload || !url) return;

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('PUT', url, true);
        xhr.upload.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100)); };
        xhr.onload = () => { xhrRef.current = null; if (xhr.status >= 200 && xhr.status < 300) onSuccess(); else onError(`Upload failed: ${xhr.statusText || 'Error'} (${xhr.status})`); };
        xhr.onerror = () => { xhrRef.current = null; onError(xhr.status === 0 ? "Upload failed: Network error or cancelled." : "Upload error occurred."); };
        xhr.onabort = () => { xhrRef.current = null; console.log("Upload aborted for", objKey); };
        xhr.setRequestHeader('Content-Type', fileToUpload.type);
        xhr.send(fileToUpload);
    }, [singleFile]); // Depends on singleFile state


    return (
        <div className="container mx-auto py-6 space-y-8">
            <h1 className="text-2xl md:text-3xl font-bold">Upload Audio</h1>

            {/* --- Single File Upload Section --- */}
            <Card>
                <CardHeader><CardTitle>Single Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {/* Error Display */}
                    {singleStage === 'error' && singleError && (
                         <div className="p-3 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 flex items-center justify-between">
                            <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {singleError}</span>
                             <Button variant="ghost" size="sm" onClick={resetSingleUpload} className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50"><RotateCcw size={16}/> Try Again</Button>
                        </div>
                    )}
                    {singleStage === 'success' && (
                         <div className="p-3 border border-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 inline mr-2"/> Track created! Redirecting...
                        </div>
                    )}

                    {/* File Input & Upload Button */}
                    {['select', 'error'].includes(singleStage) && (
                        <div className="space-y-3">
                            <Label htmlFor="singleAudioFile">Select Audio File</Label>
                            <Input id="singleAudioFile" type="file" accept="audio/*" onChange={handleSingleFileChange} />
                            {singleFile && <p className="text-sm text-slate-600 dark:text-slate-400">Selected: {singleFile.name}</p>}
                            {watchMeta("durationMs") > 0 && <p className="text-sm text-slate-500">Detected duration: ~{Math.round(watchMeta("durationMs") / 1000)}s</p>}
                            <Button onClick={handleRequestSingleUpload} disabled={!singleFile || singleIsProcessing}>
                                {singleIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                {singleIsProcessing ? 'Preparing...' : 'Upload & Continue'}
                            </Button>
                        </div>
                    )}

                    {/* Upload Progress */}
                    {singleStage === 'uploading' && (
                         <div className="space-y-2">
                            <p className="text-sm font-medium">Uploading {singleFile?.name}...</p>
                            <Progress value={singleProgress} className="w-full" />
                            <p className="text-center text-xs">{singleProgress}%</p>
                             <Button variant="outline" size="sm" onClick={resetSingleUpload} disabled={!xhrRef.current}>Cancel Upload</Button>
                         </div>
                    )}

                    {/* Metadata Form */}
                    {singleStage === 'metadata' && singleUploadResult?.objectKey && (
                         <form onSubmit={handleMetaSubmit(onMetadataSubmit)} className="space-y-4 mt-4 border-t dark:border-slate-700 pt-4">
                             <h3 className="font-semibold">Enter Track Details</h3>
                              {/* Hidden field for objectKey */}
                             <input type="hidden" {...registerMeta('objectKey')} />

                             {/* Metadata Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><Label htmlFor="title">Title*</Label><Input id="title" {...registerMeta('title', { required: true })} className={cn(metaErrors.title && "border-red-500")}/>{metaErrors.title && <p className='text-xs text-red-500 mt-1'>Title is required.</p>}</div>
                                 <div><Label htmlFor="languageCode">Language Code*</Label><Input id="languageCode" {...registerMeta('languageCode', { required: true })} className={cn(metaErrors.languageCode && "border-red-500")} placeholder="e.g., en-US"/>{metaErrors.languageCode && <p className='text-xs text-red-500 mt-1'>Language code is required.</p>}</div>
                                 <div><Label htmlFor="durationMs">Duration (ms)*</Label><Input id="durationMs" type="number" {...registerMeta('durationMs', { required: true, min: 1, valueAsNumber: true })} className={cn(metaErrors.durationMs && "border-red-500")} />{metaErrors.durationMs && <p className='text-xs text-red-500 mt-1'>Valid duration (ms) is required.</p>}</div>
                                 <div><Label htmlFor="level">Level</Label><Select id="level" {...registerMeta('level')}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...registerMeta('description')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...registerMeta('tags')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="coverImageUrl">Cover Image URL</Label><Input id="coverImageUrl" type="url" {...registerMeta('coverImageUrl')} placeholder="https://..." /></div>
                                 <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id="isPublic" {...registerMeta('isPublic')} /><Label htmlFor="isPublic">Publicly Visible</Label></div>
                             </div>

                             <div className="flex justify-end pt-4">
                                 <Button type="submit" disabled={singleIsProcessing}>
                                     {singleIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
                                     {singleIsProcessing ? 'Saving...' : 'Create Track'}
                                 </Button>
                             </div>
                         </form>
                     )}
                </CardContent>
            </Card>

            {/* --- Batch File Upload Section --- */}
             <Card>
                <CardHeader><CardTitle>Batch Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     {/* Batch Error Display */}
                     {batchError && (
                         <div className="p-3 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 flex items-center justify-between">
                            <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {batchError}</span>
                            <Button variant="ghost" size="sm" onClick={resetBatchUpload} className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50"><RotateCcw size={16}/> Start Over</Button>
                         </div>
                     )}

                    {/* File Input & Upload Button */}
                    {batchStage === 'select' && (
                         <div className="space-y-3">
                             <Label htmlFor="batchAudioFiles">Select Multiple Audio Files</Label>
                             <Input id="batchAudioFiles" type="file" accept="audio/*" multiple onChange={handleBatchFileChange} />
                             {batchFiles.length > 0 && <p className="text-sm text-slate-600">{batchFiles.length} file(s) selected.</p>}
                             <Button onClick={handleBatchUpload} disabled={batchFiles.length === 0 || batchIsProcessing} >
                                 {batchIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                 {batchIsProcessing ? 'Preparing...' : `Upload ${batchFiles.length} File(s)`}
                             </Button>
                         </div>
                    )}

                    {/* File List & Metadata Form during Upload/Metadata stages */}
                     {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing') && (
                         <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)} className="space-y-4">
                             {fields.length > 0 ? (
                                 <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                      {fields.map((field, index) => {
                                         const fileStatus = batchFiles[index]; // Get corresponding file status
                                         return (
                                             <div key={field.formId} className={`p-3 border rounded relative ${fileStatus?.status === 'error' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                                 <div className="flex justify-between items-start mb-2">
                                                     <h4 className="font-medium text-sm truncate pr-10">{fileStatus?.file?.name ?? `Track ${index + 1}`}</h4>
                                                      {/* Status Indicator */}
                                                     {fileStatus && (
                                                        <span className={`text-xs px-1.5 py-0.5 rounded-full absolute top-2 right-2 ${
                                                            fileStatus.status === 'uploaded' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                            fileStatus.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                            fileStatus.status === 'uploading' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                            'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                             {fileStatus.status === 'uploading' ? `${fileStatus.progress}%` : fileStatus.status}
                                                         </span>
                                                     )}
                                                 </div>

                                                  {fileStatus?.status === 'error' && <p className="text-xs text-red-600 mb-2">{fileStatus.errorMsg}</p>}

                                                 {/* Metadata Inputs - Only show fully if uploaded */}
                                                 {(fileStatus?.status === 'uploaded' || batchStage === 'metadata') && (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-2 border-t dark:border-slate-700/50">
                                                         <input type="hidden" {...batchRegister(`tracks.${index}.objectKey`)} />
                                                         <div><Label className="text-xs">Title*</Label><Input size="sm" {...batchRegister(`tracks.${index}.title`, { required: true })} className={cn(batchMetaErrors.tracks?.[index]?.title && "border-red-500")}/></div>
                                                         <div><Label className="text-xs">Language*</Label><Input size="sm" placeholder="en-US" {...batchRegister(`tracks.${index}.languageCode`, { required: true })} className={cn(batchMetaErrors.tracks?.[index]?.languageCode && "border-red-500")}/></div>
                                                         <div><Label className="text-xs">Level</Label><Select size="sm" {...batchRegister(`tracks.${index}.level`)}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                                                         <div><Label className="text-xs">Duration(ms)*</Label><Input size="sm" type="number" {...batchRegister(`tracks.${index}.durationMs`, { required: true, min: 1, valueAsNumber: true })} className={cn(batchMetaErrors.tracks?.[index]?.durationMs && "border-red-500")} /></div>
                                                         <div className="col-span-1 md:col-span-2"><Label className="text-xs">Description</Label><Input size="sm" {...batchRegister(`tracks.${index}.description`)} /></div>
                                                         <div className="col-span-1 md:col-span-2"><Label className="text-xs">Tags</Label><Input size="sm" placeholder="Comma, separated" {...batchRegister(`tracks.${index}.tags`)} /></div>
                                                         {/* Add Public Checkbox, CoverURL input */}
                                                         <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id={`isPublic-${field.formId}`} {...batchRegister(`tracks.${index}.isPublic`)} /><Label htmlFor={`isPublic-${field.formId}`}>Publicly Visible</Label></div>
                                                     </div>
                                                 )}
                                             </div>
                                         );
                                     })}
                                 </div>
                             ) : (
                                 <p className="text-slate-500 text-sm italic">No files selected for batch upload.</p>
                             )}
                             {/* Submit Button for Metadata */}
                             {batchStage === 'metadata' && batchFiles.some(f => f.status === 'uploaded') && (
                                 <div className="flex justify-end pt-4">
                                     <Button type="submit" disabled={batchIsProcessing}>
                                         {batchIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <ListPlus size={16} className="mr-1"/>}
                                         {batchIsProcessing ? 'Saving...' : 'Complete Batch & Create Tracks'}
                                     </Button>
                                 </div>
                             )}
                         </form>
                    )}

                     {/* Results View */}
                     {batchStage === 'results' && (
                         <div className="space-y-3">
                             <h3 className="font-semibold">Batch Results</h3>
                             {batchResults.length > 0 ? (
                                 <ul className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                                     {batchResults.map((res, index) => (
                                         <li key={res.objectKey || index} className={`flex justify-between items-center p-1.5 text-sm rounded ${res.success ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
                                             <span className="truncate mr-2" title={res.objectKey}>{res.objectKey?.split('/').pop() ?? `Item ${index+1}`}</span>
                                             {res.success ? (
                                                 <span className="text-green-700 dark:text-green-300 text-xs font-medium flex items-center"><CircleCheckBig size={14} className="mr-1"/> Created ({res.trackId?.substring(0,8)}...)</span>
                                             ) : (
                                                  <span className="text-red-700 dark:text-red-300 text-xs font-medium flex items-center" title={res.error}><CircleX size={14} className="mr-1"/> {res.error || 'Failed'}</span>
                                             )}
                                         </li>
                                     ))}
                                 </ul>
                             ) : <p className="text-slate-500 italic">No results processed.</p>}
                              <Button variant="outline" size="sm" onClick={resetBatchUpload}>Upload More</Button>
                         </div>
                     )}

                      {/* Reset/Cancel Button */}
                       {(batchStage === 'uploading' || batchStage === 'metadata') && (
                          <div className="pt-4">
                             <Button variant="outline" size="sm" onClick={resetBatchUpload} disabled={batchIsProcessing && batchStage !== 'uploading'}>
                                {batchStage === 'uploading' ? 'Cancel All Uploads' : 'Clear Batch'}
                             </Button>
                          </div>
                       )}

                </CardContent>
             </Card>
        </div>
    );
}