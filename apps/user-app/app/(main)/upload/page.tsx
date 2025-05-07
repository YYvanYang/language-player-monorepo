// apps/user-app/app/(main)/upload/page.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useTransition, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    requestUploadAction,
    createTrackMetadataAction,
    requestBatchUploadAction,
    completeBatchUploadAction
} from '@/_actions/uploadActions';
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle, ErrorMessage } from '@repo/ui'; // Added ErrorMessage
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft } from 'lucide-react';
import type {
    AudioLevel,
    CompleteUploadRequestDTO,
    BatchCompleteUploadItemDTO,
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { cn } from '@repo/utils';
import Link from 'next/link';

// --- State Types ---
type SingleUploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';
interface BatchFileStatus {
    id: string; // Unique ID for list key, matches RHF field array ID
    file: File;
    status: 'pending' | 'requesting' | 'uploading' | 'error' | 'uploaded';
    progress: number;
    uploadUrl?: string;
    objectKey?: string;
    errorMsg?: string;
    xhr?: XMLHttpRequest;
}
type BatchUploadStage = 'select' | 'processing_files' | 'uploading' | 'metadata' | 'completing' | 'results' | 'error'; // Added error and processing_files stages

// --- Helper ---
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
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
                    console.warn(`Could not decode audio file "${audioFile.name}" client-side to get duration:`, err);
                    resolve(null);
                });
        };
        reader.onerror = () => {
            console.warn(`FileReader error trying to get duration for "${audioFile.name}".`);
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

    const {
        register: registerMeta,
        handleSubmit: handleMetaSubmit,
        formState: { errors: metaErrors, isSubmitting: isMetaSubmitting }, // Added isSubmitting
        reset: resetMetaForm,
        setValue: setMetaValue, // Correctly named setValue for this form
        watch: watchMeta
    } = useForm<CompleteUploadRequestDTO>({
        defaultValues: { isPublic: true, title: '', languageCode: '', durationMs: 0 }
    });
    const singleObjectKeyFromForm = watchMeta('objectKey'); // Watch objectKey for conditional rendering

    const resetSingleUpload = useCallback(() => {
        if (singleXhrRef.current) { singleXhrRef.current.abort(); singleXhrRef.current = null; }
        setSingleFile(null); setSingleStage('select'); setSingleError(null); setSingleProgress(0); setSingleUploadResult(null);
        resetMetaForm({ isPublic: true, title: '', languageCode: '', durationMs: 0, objectKey: undefined }); // Reset all fields
        const fileInput = document.getElementById('singleAudioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [resetMetaForm]);

    const handleSingleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetSingleUpload(); // Reset everything first
        const file = event.target.files?.[0];
        if (file) {
            setSingleFile(file);
            // Use the CORRECT setValue (setMetaValue) for the single upload form
            setMetaValue('title', file.name.replace(/\.[^/.]+$/, ""));
            try {
                const duration = await getAudioDuration(file);
                setMetaValue('durationMs', duration ?? 0);
            } catch (e) {
                console.error("Error getting audio duration for single file:", e);
                setMetaValue('durationMs', 0);
            }
        }
    }, [resetSingleUpload, setMetaValue]); // Add setMetaValue to dependencies

    const handleRequestSingleUpload = useCallback(async () => {
        if (!singleFile || singleStage !== 'select' || singleIsProcessing) return;
        setSingleError(null); setSingleProgress(0); setSingleStage('requestingUrl');
        startSingleTransition(async () => {
            try {
                const result = await requestUploadAction(singleFile.name, singleFile.type);
                if (!result.success || !result.uploadUrl || !result.objectKey) {
                    setSingleError(result.message || "Failed to prepare upload. Please try again."); setSingleStage('error'); return;
                }
                setSingleUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
                setMetaValue('objectKey', result.objectKey); // Set objectKey for the form
                setSingleStage('uploading');

                // Direct Upload Helper Call
                const xhr = new XMLHttpRequest();
                singleXhrRef.current = xhr;
                xhr.open('PUT', result.uploadUrl, true);
                xhr.upload.onprogress = (event) => { if (event.lengthComputable) setSingleProgress(Math.round((event.loaded / event.total) * 100)); };
                xhr.onload = () => {
                    singleXhrRef.current = null;
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setSingleStage('metadata');
                    } else {
                        setSingleError(`Upload failed: ${xhr.statusText || 'Server Error'} (${xhr.status}). Please try again.`);
                        setSingleStage('error');
                    }
                };
                xhr.onerror = () => {
                    singleXhrRef.current = null;
                    setSingleError(xhr.status === 0 ? "Upload failed: Network error or cancelled. Check connection." : "Upload error occurred. Please try again.");
                    setSingleStage('error');
                };
                xhr.onabort = () => { singleXhrRef.current = null; log("Single upload aborted for", result.objectKey); if (singleStage !== 'success') setSingleStage('select');}; // Go back to select if aborted and not success
                xhr.setRequestHeader('Content-Type', singleFile.type);
                xhr.send(singleFile);

            } catch (e: any) {
                setSingleError(e.message || "An unexpected error occurred during upload preparation.");
                setSingleStage('error');
            }
        });
    }, [singleFile, singleStage, singleIsProcessing, setMetaValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!singleUploadResult?.objectKey || singleStage !== 'metadata' || isMetaSubmitting) return;

         const payload: CompleteUploadRequestDTO = {
            ...data,
            objectKey: singleUploadResult.objectKey, // Ensure correct objectKey from upload result
            tags: (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
            level: data.level === "" ? undefined : data.level,
            coverImageUrl: data.coverImageUrl === "" ? undefined : data.coverImageUrl,
            isPublic: data.isPublic ?? false,
         };

         setSingleStage('completing'); setSingleError(null);
         startSingleTransition(async () => {
             try {
                 const result = await createTrackMetadataAction(payload);
                 if (result.success && result.track) {
                     setSingleStage('success');
                     // TODO: Use a toast notification library
                     alert("Track created successfully! Redirecting...");
                     setTimeout(() => router.push(`/tracks/${result.track?.id}`), 1500);
                 } else {
                     setSingleError(result.message || "Failed to create track metadata. Please review details and try again.");
                     setSingleStage('metadata'); // Stay on metadata stage for correction
                 }
             } catch (e: any) {
                 setSingleError(e.message || "An unexpected error occurred while creating the track.");
                 setSingleStage('metadata');
             }
         });
     };

    // --- Batch Upload State & Logic ---
    const [batchFiles, setBatchFiles] = useState<BatchFileStatus[]>([]);
    const [batchStage, setBatchStage] = useState<BatchUploadStage>('select');
    const [batchOverallError, setBatchOverallError] = useState<string | null>(null);
    const [batchIsGloballyProcessing, startBatchGlobalTransition] = useTransition(); // For whole batch operations
    const [batchResults, setBatchResults] = useState<BatchCompleteUploadResponseItemDTO[]>([]);

    const {
        control: batchControl,
        register: batchRegister,
        handleSubmit: handleBatchMetaSubmit,
        formState: { errors: batchMetaErrors, isSubmitting: isBatchMetaSubmitting },
        reset: resetBatchMetaForm,
        setValue: setBatchMetaValue,
        getValues: getBatchMetaValues,
        watch: watchBatchMeta // Not used yet, but available
    } = useForm<{ tracks: BatchCompleteUploadItemDTO[] }>({ defaultValues: { tracks: [] } });

    const { fields, append, remove, replace } = useFieldArray({ control: batchControl, name: "tracks", keyName: "rhfId" }); // Use "rhfId" for React Hook Form's internal key

    const resetBatchUpload = useCallback(() => {
        batchFiles.forEach(bf => bf.xhr?.abort());
        setBatchFiles([]); setBatchStage('select'); setBatchOverallError(null); setBatchResults([]);
        replace([]); // Resets the RHF field array
        const fileInput = document.getElementById('batchAudioFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [batchFiles, replace]);

    const handleBatchFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetBatchUpload();
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setBatchStage('processing_files'); // Indicate client-side processing
        startBatchGlobalTransition(async () => {
            const newFileStatuses: BatchFileStatus[] = [];
            const metadataDefaults: Partial<BatchCompleteUploadItemDTO>[] = [];

            for (const file of Array.from(files)) {
                let duration = null;
                try { duration = await getAudioDuration(file); } catch (e) { console.error("Error getting duration for batch file:", file.name, e); }
                const fileId = crypto.randomUUID(); // Unique ID for internal tracking and RHF key
                newFileStatuses.push({ id: fileId, file, status: 'pending', progress: 0 });
                metadataDefaults.push({
                    // objectKey will be set after URL request
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    durationMs: duration ?? 0,
                    isPublic: true,
                    languageCode: '', // User needs to fill this
                    tags: [],
                });
            }
            setBatchFiles(newFileStatuses);
            replace(metadataDefaults as BatchCompleteUploadItemDTO[]); // Populate RHF with defaults
            setBatchStage('select'); // Ready for user to initiate upload
        });
    }, [resetBatchUpload, replace]);

    const handleIndividualBatchUpload = useCallback(async (fileStatus: BatchFileStatus, index: number) => {
        if (!fileStatus.uploadUrl || !fileStatus.objectKey || fileStatus.status === 'uploading' || fileStatus.status === 'uploaded') return;

        setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading', progress: 0, errorMsg: undefined } : f));

        const xhr = new XMLHttpRequest();
        // Update the specific fileStatus object in the array with its XHR instance
        setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, xhr } : f));


        return new Promise<boolean>((resolve) => {
            xhr.open('PUT', fileStatus.uploadUrl!, true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, progress } : f));
                }
            };
            xhr.onload = () => {
                const success = xhr.status >= 200 && xhr.status < 300;
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: success ? 'uploaded' : 'error', errorMsg: success ? undefined : `Upload failed (${xhr.status})`, xhr: undefined } : f));
                resolve(success);
            };
            xhr.onerror = () => {
                const errorMsg = xhr.status === 0 ? "Network error or cancelled" : "Upload error";
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'error', errorMsg, xhr: undefined } : f));
                resolve(false);
            };
            xhr.onabort = () => {
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'pending', errorMsg: 'Upload cancelled by user.', progress: 0, xhr: undefined } : f));
                resolve(false);
            };
            xhr.setRequestHeader('Content-Type', fileStatus.file.type);
            xhr.send(fileStatus.file);
        });
    }, []);

    const handleStartAllBatchUploads = useCallback(async () => {
        const filesToRequestUrl = batchFiles.filter(f => f.status === 'pending' && !f.uploadUrl);
        if (filesToRequestUrl.length === 0) { // All URLs already fetched or no pending files
            // Proceed to upload files that have URLs but haven't been uploaded
            const filesToActuallyUpload = batchFiles.filter(f => f.uploadUrl && f.objectKey && (f.status === 'pending' || f.status === 'error')); // Allow re-uploading errored ones
             if (filesToActuallyUpload.length === 0) {
                 if (batchFiles.every(f => f.status === 'uploaded')) setBatchStage('metadata');
                 return;
             }
            setBatchStage('uploading');
            setBatchOverallError(null);
            startBatchGlobalTransition(async () => {
                const uploadPromises = filesToActuallyUpload.map((bf, idx) => {
                    const originalIndex = batchFiles.findIndex(origBf => origBf.id === bf.id); // Find original index for RHF
                    return handleIndividualBatchUpload(bf, originalIndex);
                });
                await Promise.all(uploadPromises);
                if (batchFiles.every(f => f.status === 'uploaded' || f.status === 'error' /* allow proceeding if some failed */)) {
                    if (batchFiles.some(f => f.status === 'uploaded')) {
                        setBatchStage('metadata');
                    } else if (batchFiles.every(f => f.status === 'error')) {
                        setBatchOverallError("All file uploads failed or were cancelled.");
                        setBatchStage('error'); // Global error state for batch
                    }
                }
            });
            return;
        }

        setBatchStage('uploading'); // Indicate URLs are being requested
        setBatchOverallError(null);
        startBatchGlobalTransition(async () => {
            try {
                const requestItems = filesToRequestUrl.map(f => ({ filename: f.file.name, contentType: f.file.type }));
                const urlResult = await requestBatchUploadAction(requestItems);

                if (!urlResult.success || !urlResult.results) {
                    setBatchOverallError(urlResult.message || "Failed to prepare batch upload URLs.");
                    setBatchStage('error'); return;
                }

                // Update batchFiles state with received URLs and objectKeys
                let someUrlsFailed = false;
                const updatedBatchFilesWithUrls = batchFiles.map(bf => {
                    if (bf.status === 'pending' && !bf.uploadUrl) {
                        const resultItem = urlResult.results?.find(res => res.originalFilename === bf.file.name);
                        if (resultItem && !resultItem.error && resultItem.uploadUrl && resultItem.objectKey) {
                            const rhfIndex = fields.findIndex(field => field.rhfId === bf.id); // Find RHF item by our internal ID
                            if (rhfIndex !== -1) {
                                setBatchMetaValue(`tracks.${rhfIndex}.objectKey`, resultItem.objectKey);
                            }
                            return { ...bf, uploadUrl: resultItem.uploadUrl, objectKey: resultItem.objectKey, status: 'pending' }; // Remains pending until user clicks upload again or auto-starts
                        } else {
                            someUrlsFailed = true;
                            return { ...bf, status: 'error', errorMsg: resultItem?.error || 'Failed to get upload URL' };
                        }
                    }
                    return bf;
                });
                setBatchFiles(updatedBatchFilesWithUrls);

                if (someUrlsFailed) {
                     setBatchOverallError("Failed to get upload URLs for some files. Please review and retry.");
                     // Stay in 'uploading' or go to 'select' to allow retries or individual uploads
                     setBatchStage('select'); // Go back to select so user can see errors and retry
                     return;
                }

                // Automatically start uploading files that now have URLs
                const filesReadyForActualUpload = updatedBatchFilesWithUrls.filter(f => f.uploadUrl && f.objectKey && f.status === 'pending');
                const uploadPromises = filesReadyForActualUpload.map((bf) => {
                     const originalIndex = updatedBatchFilesWithUrls.findIndex(origBf => origBf.id === bf.id);
                     return handleIndividualBatchUpload(bf, originalIndex);
                });
                await Promise.all(uploadPromises);

                // After all uploads attempted, check status
                const finalBatchFilesState = getBatchMetaValues().tracks.map((_, i) => batchFiles[i]); // Get the latest state via RHF or directly
                if (finalBatchFilesState.every(f => f.status === 'uploaded' || f.status === 'error')) {
                     if (finalBatchFilesState.some(f => f.status === 'uploaded')) {
                        setBatchStage('metadata');
                    } else {
                        setBatchOverallError("All file uploads failed or were cancelled.");
                        setBatchStage('error');
                    }
                }


            } catch (e: any) {
                setBatchOverallError(e.message || "An unexpected error occurred during batch URL preparation.");
                setBatchStage('error');
            }
        });
    }, [batchFiles, fields, handleIndividualBatchUpload, setBatchMetaValue, getBatchMetaValues]);


    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        if (isBatchMetaSubmitting) return;

        const tracksToComplete = data.tracks.filter((item, index) =>
            batchFiles[index]?.status === 'uploaded' && !!item.objectKey // Must be uploaded and have an objectKey
        ).map((item) => ({ // Ensure DTO structure
            ...item,
            tags: (item.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
            level: item.level === "" ? undefined : item.level,
            description: item.description === "" ? undefined : item.description,
            coverImageUrl: item.coverImageUrl === "" ? undefined : item.coverImageUrl,
            isPublic: item.isPublic ?? false,
        }));

        if (tracksToComplete.length === 0) {
            setBatchOverallError("No successfully uploaded tracks with metadata to finalize. Please complete metadata for uploaded files.");
            return;
        }

        setBatchStage('completing'); setBatchOverallError(null);
        startBatchGlobalTransition(async () => {
            try {
                const result = await completeBatchUploadAction(tracksToComplete);
                setBatchResults(result.results ?? []);
                setBatchStage('results');
                if (!result.success) {
                    setBatchOverallError(result.message || "Batch completion process reported errors. Check individual results.");
                } else {
                    alert("Batch processing complete! Check results below."); // TODO: Toast
                }
            } catch (e: any) {
                 setBatchOverallError(e.message || "An unexpected error occurred during batch finalization.");
                 setBatchStage('metadata'); // Revert to metadata for review
            }
        });
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Upload Audio</h1>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
                </Button>
            </div>

            {/* --- Single File Upload Section --- */}
            <Card>
                <CardHeader><CardTitle>Single Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <ErrorMessage message={singleError} showIcon />
                    {singleStage === 'success' && (
                         <div className="p-3 border border-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 inline mr-2"/> Track created! Redirecting...
                        </div>
                    )}

                    {['select', 'error'].includes(singleStage) && (
                        <div className="space-y-3">
                            <Label htmlFor="singleAudioFile">Select Audio File</Label>
                            <Input id="singleAudioFile" type="file" accept="audio/*,.m4a,.ogg" onChange={handleSingleFileChange} />
                            {singleFile && <p className="text-sm text-slate-600 dark:text-slate-400">Selected: {singleFile.name}</p>}
                            {watchMeta("durationMs") > 0 && <p className="text-sm text-slate-500">Detected duration: ~{Math.round(watchMeta("durationMs") / 1000)}s</p>}
                            <Button onClick={handleRequestSingleUpload} disabled={!singleFile || singleIsProcessing}>
                                {singleIsProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                {singleIsProcessing ? 'Preparing...' : 'Upload & Continue'}
                            </Button>
                        </div>
                    )}

                    {singleStage === 'uploading' && (
                         <div className="space-y-2">
                            <p className="text-sm font-medium">Uploading {singleFile?.name}...</p>
                            <Progress value={singleProgress} className="w-full" />
                            <p className="text-center text-xs">{singleProgress}%</p>
                             <Button variant="outline" size="sm" onClick={resetSingleUpload} disabled={!singleXhrRef.current && singleIsProcessing}>Cancel Upload</Button>
                         </div>
                    )}

                    {singleStage === 'metadata' && singleObjectKeyFromForm && (
                         <form onSubmit={handleMetaSubmit(onMetadataSubmit)} className="space-y-4 mt-4 border-t dark:border-slate-700 pt-4">
                             <h3 className="font-semibold">Enter Track Details</h3>
                             <input type="hidden" {...registerMeta('objectKey')} />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><Label htmlFor="title">Title*</Label><Input id="title" {...registerMeta('title', { required: "Title is required." })} className={cn(metaErrors.title && "border-red-500")}/> <ErrorMessage message={metaErrors.title?.message} /></div>
                                 <div><Label htmlFor="languageCode">Language Code*</Label><Input id="languageCode" {...registerMeta('languageCode', { required: "Language code (e.g., en-US) is required." })} className={cn(metaErrors.languageCode && "border-red-500")} placeholder="e.g., en-US"/> <ErrorMessage message={metaErrors.languageCode?.message} /></div>
                                 <div><Label htmlFor="durationMs">Duration (ms)*</Label><Input id="durationMs" type="number" {...registerMeta('durationMs', { required: "Duration is required.", min: {value: 1, message: "Duration must be positive."} , valueAsNumber: true })} className={cn(metaErrors.durationMs && "border-red-500")} readOnly={!!watchMeta("durationMs")} /> <ErrorMessage message={metaErrors.durationMs?.message} /></div>
                                 <div><Label htmlFor="level">Level</Label><Select id="level" {...registerMeta('level')}><option value="">-- Optional --</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option><option value="NATIVE">Native</option></Select></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" {...registerMeta('description')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...registerMeta('tags')} /></div>
                                 <div className="col-span-1 md:col-span-2"><Label htmlFor="coverImageUrl">Cover Image URL (Optional)</Label><Input id="coverImageUrl" type="url" {...registerMeta('coverImageUrl')} placeholder="https://..." /></div>
                                 <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id="isPublic" {...registerMeta('isPublic')} /><Label htmlFor="isPublic" className="font-normal">Publicly Visible</Label></div>
                             </div>
                             <div className="flex justify-between items-center pt-4">
                                <Button variant="outline" type="button" onClick={resetSingleUpload} disabled={isMetaSubmitting || singleIsProcessing}>Cancel</Button>
                                <Button type="submit" disabled={isMetaSubmitting || singleIsProcessing}>
                                     {(isMetaSubmitting || singleIsProcessing && singleStage === 'completing') ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
                                     {(isMetaSubmitting || singleIsProcessing && singleStage === 'completing') ? 'Saving...' : 'Create Track'}
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
                    <ErrorMessage message={batchOverallError} showIcon/>

                    {batchStage === 'select' && (
                         <div className="space-y-3">
                             <Label htmlFor="batchAudioFiles">Select Multiple Audio Files</Label>
                             <Input id="batchAudioFiles" type="file" accept="audio/*,.m4a,.ogg" multiple onChange={handleBatchFileChange} disabled={batchIsGloballyProcessing} />
                             {batchFiles.length > 0 && <p className="text-sm text-slate-600">{batchFiles.length} file(s) selected. Ready to prepare for upload.</p>}
                             <Button onClick={handleStartAllBatchUploads} disabled={batchFiles.length === 0 || batchIsGloballyProcessing}>
                                 {batchIsGloballyProcessing && batchStage === 'processing_files' ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                 {batchIsGloballyProcessing && batchStage === 'processing_files' ? 'Processing Files...' : `Prepare ${batchFiles.length > 0 ? batchFiles.length : ''} File(s) for Upload`}
                             </Button>
                         </div>
                    )}
                    {batchStage === 'processing_files' && (
                        <div className="text-center p-4"> <Loader className="h-6 w-6 animate-spin inline-block mr-2"/> Processing selected files...</div>
                    )}


                    {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing' || batchStage === 'error') && fields.length > 0 && (
                         <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)} className="space-y-4">
                             {batchStage === 'uploading' && !batchIsGloballyProcessing && batchFiles.some(f => f.status === 'pending' && f.uploadUrl) && (
                                 <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded text-sm">
                                     URLs received. <Button size="sm" type="button" onClick={handleStartAllBatchUploads} className="ml-2">Start Uploading Pending Files</Button>
                                 </div>
                             )}
                             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2"> {/* Added negative margin for scrollbar */}
                                  {fields.map((rhfField, index) => {
                                     const fileStatus = batchFiles.find(bf => bf.id === rhfField.rhfId); // Find by our internal ID stored in RHF field
                                     if (!fileStatus) return null; // Should not happen if data is synced

                                     const isUploaded = fileStatus.status === 'uploaded';
                                     const isUploading = fileStatus.status === 'uploading';
                                     const isError = fileStatus.status === 'error';
                                     const isPendingUrl = fileStatus.status === 'pending' && !fileStatus.uploadUrl;
                                     const canEditMetadata = isUploaded || (batchStage === 'metadata' && fileStatus.objectKey);

                                     return (
                                         <div key={rhfField.rhfId} className={cn("p-3 border rounded relative transition-all",
                                             isError ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700',
                                             isUploading && 'opacity-80'
                                         )}>
                                             <div className="flex justify-between items-start mb-2">
                                                 <h4 className="font-medium text-sm truncate pr-16">{fileStatus.file.name}</h4>
                                                 <span className={cn("text-xs px-1.5 py-0.5 rounded-full absolute top-2 right-2 capitalize",
                                                     isUploaded && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                                                     isError && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                                                     isUploading && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                                                     (fileStatus.status === 'pending' || fileStatus.status === 'requesting') && 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                                                 )}>
                                                     {isUploading ? `${fileStatus.progress}%` : fileStatus.status}
                                                 </span>
                                             </div>
                                             {isUploading && <Progress value={fileStatus.progress} size="sm" className="mb-1"/>}
                                             {isError && <p className="text-xs text-red-600 mb-2">{fileStatus.errorMsg}</p>}
                                             {isPendingUrl && <p className="text-xs text-slate-500 italic">Waiting for upload URL...</p>}

                                             {/* Buttons for individual file actions */}
                                             <div className="flex gap-2 mb-2">
                                                 {fileStatus.status === 'pending' && fileStatus.uploadUrl && !isUploading && (
                                                    <Button size="xs" type="button" variant="outline" onClick={() => handleIndividualBatchUpload(fileStatus, index)} disabled={batchIsGloballyProcessing}>Upload this file</Button>
                                                 )}
                                                 {isUploading && fileStatus.xhr && (
                                                     <Button size="xs" type="button" variant="destructive" onClick={() => fileStatus.xhr?.abort()}>Cancel</Button>
                                                 )}
                                                  {isError && (
                                                     <Button size="xs" type="button" variant="outline" onClick={() => {
                                                         // Logic to retry fetching URL or re-uploading
                                                         if (!fileStatus.uploadUrl) { // Retry getting URL
                                                             setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? {...f, status: 'pending', errorMsg: undefined} : f));
                                                             // User would then click "Prepare Files" or "Start All Uploads" again
                                                         } else { // Retry upload
                                                             handleIndividualBatchUpload(fileStatus, index);
                                                         }
                                                     }} disabled={batchIsGloballyProcessing}>Retry</Button>
                                                  )}
                                             </div>


                                             {canEditMetadata && (
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-2 border-t dark:border-slate-700/50">
                                                     <input type="hidden" {...batchRegister(`tracks.${index}.objectKey`)} />
                                                     <div><Label htmlFor={`tracks.${index}.title`} className="text-xs">Title*</Label><Input id={`tracks.${index}.title`} size="sm" {...batchRegister(`tracks.${index}.title`, { required: "Title is required." })} className={cn(batchMetaErrors.tracks?.[index]?.title && "border-red-500")}/> <ErrorMessage message={batchMetaErrors.tracks?.[index]?.title?.message} /></div>
                                                     <div><Label htmlFor={`tracks.${index}.languageCode`} className="text-xs">Language*</Label><Input id={`tracks.${index}.languageCode`} size="sm" placeholder="en-US" {...batchRegister(`tracks.${index}.languageCode`, { required: "Language is required." })} className={cn(batchMetaErrors.tracks?.[index]?.languageCode && "border-red-500")}/> <ErrorMessage message={batchMetaErrors.tracks?.[index]?.languageCode?.message} /></div>
                                                     <div><Label htmlFor={`tracks.${index}.level`} className="text-xs">Level</Label><Select id={`tracks.${index}.level`} size="sm" {...batchRegister(`tracks.${index}.level`)}><option value="">-- Optional --</option><option value="A1">A1</option><option value="A2">A2</option><option value="B1">B1</option><option value="B2">B2</option><option value="C1">C1</option><option value="C2">C2</option><option value="NATIVE">Native</option></Select></div>
                                                     <div><Label htmlFor={`tracks.${index}.durationMs`} className="text-xs">Duration(ms)*</Label><Input id={`tracks.${index}.durationMs`} size="sm" type="number" {...batchRegister(`tracks.${index}.durationMs`, { required: "Duration is required.", min: {value:1, message: "Must be > 0"}, valueAsNumber: true })} className={cn(batchMetaErrors.tracks?.[index]?.durationMs && "border-red-500")} readOnly={!!getBatchMetaValues().tracks[index]?.durationMs} /> <ErrorMessage message={batchMetaErrors.tracks?.[index]?.durationMs?.message} /></div>
                                                     <div className="md:col-span-2"><Label htmlFor={`tracks.${index}.description`} className="text-xs">Description</Label><Textarea id={`tracks.${index}.description`} rows={2} {...batchRegister(`tracks.${index}.description`)} /></div>
                                                     <div className="md:col-span-2"><Label htmlFor={`tracks.${index}.tags`} className="text-xs">Tags</Label><Input id={`tracks.${index}.tags`} size="sm" placeholder="Comma, separated" {...batchRegister(`tracks.${index}.tags`)} /></div>
                                                     <div className="flex items-center space-x-2 md:col-span-2"><Checkbox id={`isPublic-${rhfField.rhfId}`} {...batchRegister(`tracks.${index}.isPublic`)} /><Label htmlFor={`isPublic-${rhfField.rhfId}`} className="font-normal text-xs">Publicly Visible</Label></div>
                                                 </div>
                                             )}
                                         </div>
                                     );
                                  })}
                             </div>
                             {batchStage === 'metadata' && batchFiles.some(f => f.status === 'uploaded') && (
                                 <div className="flex justify-between items-center pt-4">
                                      <Button variant="outline" type="button" onClick={resetBatchUpload} disabled={isBatchMetaSubmitting || batchIsGloballyProcessing}>Clear Batch & Start Over</Button>
                                     <Button type="submit" disabled={isBatchMetaSubmitting || batchIsGloballyProcessing || batchFiles.filter(f=>f.status === 'uploaded').length === 0}>
                                         {(isBatchMetaSubmitting || (batchIsGloballyProcessing && batchStage === 'completing')) ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <ListPlus size={16} className="mr-1"/>}
                                         {(isBatchMetaSubmitting || (batchIsGloballyProcessing && batchStage === 'completing')) ? 'Finalizing...' : `Finalize ${batchFiles.filter(f=>f.status === 'uploaded').length} Uploaded Track(s)`}
                                     </Button>
                                 </div>
                             )}
                         </form>
                    )}

                     {batchStage === 'results' && (
                         <div className="space-y-3">
                             <h3 className="font-semibold">Batch Processing Results</h3>
                             <ErrorMessage message={batchOverallError} showIcon/>
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
                             ) : <p className="text-slate-500 italic">No results were processed in this batch attempt.</p>}
                              <Button variant="outline" size="sm" onClick={resetBatchUpload}>Upload More Files</Button>
                         </div>
                     )}
                     {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'error' && fields.length > 0) && (
                          <div className="pt-4">
                             <Button variant="outline" size="sm" onClick={resetBatchUpload} disabled={batchIsGloballyProcessing && batchStage === 'completing'}>
                                Cancel & Clear Batch
                             </Button>
                          </div>
                       )}
                </CardContent>
             </Card>
        </div>
    );
}