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
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw } from 'lucide-react';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import type {
    AudioLevel,
    CompleteUploadRequestDTO,
    BatchCompleteUploadItemDTO,
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { cn } from '@repo/utils';

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
    metadata?: Partial<BatchCompleteUploadItemDTO>;
    xhr?: XMLHttpRequest; // To allow cancellation
}
type BatchUploadStage = 'select' | 'uploading' | 'metadata' | 'completing' | 'results';

// --- Helper ---
const getAudioDuration = (audioFile: File): Promise<number | null> => { /* ... same as before ... */ };

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

    const { register: registerMeta, handleSubmit: handleMetaSubmit, formState: { errors: metaErrors }, reset: resetMetaForm, setValue: setMetaValue } = useForm<CompleteUploadRequestDTO>();

    const resetSingleUpload = () => {
        if (singleXhrRef.current) {
            singleXhrRef.current.abort();
            singleXhrRef.current = null;
        }
        setSingleFile(null);
        setSingleStage('select');
        setSingleError(null);
        setSingleProgress(0);
        setSingleUploadResult(null);
        resetMetaForm();
        // Clear file input visually
        const fileInput = document.getElementById('singleAudioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    const handleSingleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        resetSingleUpload(); // Reset everything on new file selection
        const file = event.target.files?.[0];
        if (file) {
            setSingleFile(file);
            getAudioDuration(file).then(duration => {
                if (duration) setMetaValue('durationMs', duration);
            });
        }
    };

    const handleSingleUpload = useCallback(async () => {
        if (!singleFile || singleStage !== 'select') return;
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
            singleXhrRef.current = xhr; // Store XHR reference for cancellation
            xhr.open('PUT', urlResult.uploadUrl, true);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) setSingleProgress(Math.round((event.loaded / event.total) * 100));
            };
            xhr.onload = () => {
                singleXhrRef.current = null; // Clear ref on completion
                if (xhr.status >= 200 && xhr.status < 300) {
                    setSingleStage('metadata');
                    setMetaValue('objectKey', urlResult.objectKey);
                } else {
                    setSingleError(`Upload failed: ${xhr.statusText || 'Error'}`);
                    setSingleStage('error');
                }
            };
            xhr.onerror = () => {
                singleXhrRef.current = null;
                // Check if aborted by user
                if (xhr.status === 0 && !navigator.onLine) {
                     setSingleError("Upload failed: Network error.");
                } else if (xhr.status !== 0) { // Don't show error if aborted (status 0 usually)
                     setSingleError("Upload error occurred.");
                }
                if (singleStage !== 'select') setSingleStage('error'); // Avoid setting error if already reset
            };
            xhr.onabort = () => {
                 singleXhrRef.current = null;
                 console.log("Single upload aborted");
                 // State reset is handled by resetSingleUpload
            };
            xhr.setRequestHeader('Content-Type', singleFile.type);
            xhr.send(singleFile);
        });
    }, [singleFile, singleStage, setMetaValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!singleUploadResult?.objectKey || singleStage !== 'metadata') return;
         data.objectKey = singleUploadResult.objectKey; // Ensure key is correct
         // Convert tags string back to array if using simple input
         if (typeof data.tags === 'string') {
             data.tags = (data.tags as string).split(',').map(t => t.trim()).filter(Boolean);
         }

         setSingleStage('completing');
         setSingleError(null);
         startSingleTransition(async () => {
             // If createTrackMetadataAction expects FormData, construct it here.
             // If it expects JSON (like currently defined), pass 'data' directly.
             // Assuming action expects JSON based on previous refinement:
             const result = await createTrackMetadataAction(data.objectKey, data as any); // Action needs adjustment if expecting FormData
             if (result.success && result.track) {
                 setSingleStage('success');
                 // Optionally wait briefly before redirecting
                 setTimeout(() => router.push(`/tracks/${result.track?.id}`), 1500); // Redirect to track detail
             } else {
                 setSingleError(result.message || "Failed to create track.");
                 setSingleStage('metadata'); // Return to metadata stage on error
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
    const { fields, append, remove, replace } = useFieldArray({ control: batchControl, name: "tracks", keyName: "formId" });

    const resetBatchUpload = () => {
        batchFiles.forEach(bf => bf.xhr?.abort());
        setBatchFiles([]);
        setBatchStage('select');
        setBatchError(null);
        setBatchResults([]);
        replace([]); // Reset RHF field array
        const fileInput = document.getElementById('batchAudioFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    const handleBatchFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        resetBatchUpload();
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newFileStatuses: BatchFileStatus[] = [];
        const metadataDefaults: Partial<BatchCompleteUploadItemDTO>[] = [];

        for (const file of Array.from(files)) {
             const duration = await getAudioDuration(file);
             const fileId = crypto.randomUUID(); // Generate unique ID for list key
             newFileStatuses.push({
                id: fileId, file, status: 'pending', progress: 0,
                metadata: { title: file.name.replace(/\.[^/.]+$/, ""), durationMs: duration ?? 0, isPublic: true }
             });
             metadataDefaults.push({ // Default values for the form
                 objectKey: '', // Will be filled later
                 title: file.name.replace(/\.[^/.]+$/, ""),
                 durationMs: duration ?? 0,
                 isPublic: true,
                 languageCode: '', // User needs to fill these
                 level: '',
                 description: '',
                 tags: [],
                 coverImageUrl: ''
             });
        }
        setBatchFiles(newFileStatuses);
        replace(metadataDefaults as BatchCompleteUploadItemDTO[]); // Initialize RHF array
    };

    const handleBatchUpload = useCallback(() => {
        /* ... same logic as before to request URLs and upload ... */
        // Important: Inside the upload loop, use `setBatchMetaValue(tracks.${index}.objectKey, resItem.objectKey)`
        // Also update the status in batchFiles using setBatchFiles
         if (batchFiles.length === 0 || batchFiles.some(f => f.status !== 'pending')) return;
        setBatchStage('uploading');
        setBatchError(null);
         startBatchTransition(async () => { /* ... requestBatchUploadAction ... then loop through results ... */
            const requestItems = batchFiles.map(f => ({ filename: f.file.name, contentType: f.file.type }));
            const urlResult = await requestBatchUploadAction(requestItems);
             // ... handle urlResult errors ...

            const uploadPromises: Promise<void>[] = [];
            const currentFileStatuses = [...batchFiles]; // Work on a copy

            urlResult.results?.forEach((resItem) => {
                const fileIndex = currentFileStatuses.findIndex(f => f.file.name === resItem.originalFilename);
                if (fileIndex === -1) return;

                const fileStatus = currentFileStatuses[fileIndex];

                if (resItem.error || !resItem.uploadUrl || !resItem.objectKey) {
                    fileStatus.status = 'error';
                    fileStatus.errorMsg = resItem.error || 'Missing URL/Key';
                    return;
                }

                 fileStatus.status = 'requesting';
                 fileStatus.uploadUrl = resItem.uploadUrl;
                 fileStatus.objectKey = resItem.objectKey;
                 setBatchMetaValue(`tracks.${fileIndex}.objectKey`, resItem.objectKey); // Update RHF

                 // Create upload promise
                 const promise = new Promise<void>((resolve, reject) => {
                     setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading' } : f)); // Update specific item status

                     const xhr = new XMLHttpRequest();
                     fileStatus.xhr = xhr; // Store ref for cancellation
                     xhr.open('PUT', resItem.uploadUrl, true);
                     xhr.upload.onprogress = (event) => { /* update progress */ };
                     xhr.onload = () => { /* update status to uploaded, resolve */ };
                     xhr.onerror = () => { /* update status to error, reject */ };
                     xhr.onabort = () => { /* reject or resolve depending on if it was intentional */ reject(new Error('Upload aborted')); };
                     xhr.setRequestHeader('Content-Type', fileStatus.file.type);
                     xhr.send(fileStatus.file);
                 });
                 uploadPromises.push(promise);
             });

            setBatchFiles(currentFileStatuses); // Update UI with keys/statuses

             try {
                 await Promise.all(uploadPromises);
                 // Check final state
                 const finalState = get().batchFiles;
                 if (finalState.some(f => f.status === 'error')) { throw new Error("One or more uploads failed."); }
                 console.log("Batch uploads finished.");
                 setBatchStage('metadata');
             } catch (uploadError: any) {
                 console.error("Batch upload error:", uploadError);
                 setBatchError(uploadError.message || "Some uploads failed.");
                 // Don't change stage, let user see errors
             }
         });
    }, [batchFiles, setBatchMetaValue]); // Add dependencies

    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        const tracksToComplete = data.tracks.filter((item, index) => batchFiles[index]?.status === 'uploaded' && item.objectKey);
        if (tracksToComplete.length === 0) { setBatchError("No completed uploads with metadata to finalize."); return; }

        setBatchStage('completing');
        setBatchError(null);
        startBatchTransition(async () => {
            const result = await completeBatchUploadAction(tracksToComplete);
            setBatchResults(result.results ?? []);
            setBatchStage('results');
            if (!result.success) setBatchError(result.message || "Batch completion failed.");
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Upload Audio</h1>

            {/* --- Single File Upload Section --- */}
            <Card>
                <CardHeader>
                    <CardTitle>Single Track Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {/* Error Display */}
                    {singleStage === 'error' && singleError && ( /* ... error display ... */ )}
                    {singleStage === 'success' && ( /* ... success display ... */ )}

                    {/* File Input & Upload Button */}
                    {['select', 'requestingUrl', 'uploading', 'error'].includes(singleStage) && ( /* ... file input and upload button ... */ )}

                    {/* Upload Progress */}
                    {singleStage === 'uploading' && ( /* ... progress bar ... */ )}

                    {/* Metadata Form */}
                    {singleStage === 'metadata' && singleUploadResult?.objectKey && (
                         <form onSubmit={handleMetaSubmit(onMetadataSubmit)} className="space-y-4 mt-4 border-t pt-4">
                             {/* ... metadata fields using registerMeta ... */}
                              <Button type="submit" disabled={singleIsProcessing}>
                                  {singleIsProcessing ? <Spinner size="sm" /> : 'Create Track'}
                              </Button>
                         </form>
                     )}
                      {/* Reset Button */}
                      {singleStage !== 'select' && singleStage !== 'success' && (
                          <Button variant="outline" size="sm" onClick={resetSingleUpload} disabled={singleIsProcessing && singleStage !== 'uploading'} className="mt-2">
                             {(singleIsProcessing && singleStage === 'uploading') ? 'Cancel Upload' : 'Start Over'}
                          </Button>
                      )}
                </CardContent>
            </Card>

            {/* --- Batch File Upload Section --- */}
             <Card>
                <CardHeader>
                    <CardTitle>Batch Track Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      {/* Batch Error Display */}
                      {batchError && ( /* ... error display ... */ )}

                      {/* File Input & Upload Button */}
                      {batchStage === 'select' && ( /* ... file input and upload button ... */ )}

                      {/* File List & Metadata Form */}
                      {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing') && (
                            <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)} className="space-y-4">
                                {fields.map((field, index) => {
                                     const fileStatus = batchFiles[index];
                                     return (
                                         <div key={field.formId} className={`p-3 border rounded ${fileStatus?.status === 'error' ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                                             <h4 className="font-medium text-sm mb-2">{fileStatus?.file?.name ?? `Track ${index + 1}`}</h4>
                                              {/* Status Indicator */}
                                              {fileStatus && (
                                                  <div className="text-xs mb-2">
                                                     Status: {fileStatus.status}
                                                     {fileStatus.status === 'uploading' && ` (${fileStatus.progress}%)`}
                                                     {fileStatus.status === 'error' && `: ${fileStatus.errorMsg}`}
                                                     {fileStatus.status === 'uploaded' && <CheckCircle size={14} className="inline ml-1 text-green-600"/>}
                                                 </div>
                                              )}
                                             {/* Metadata Inputs - Only enable/show if uploaded */}
                                             {fileStatus?.status === 'uploaded' && batchStage === 'metadata' && (
                                                 <div className="grid grid-cols-2 gap-3 mt-2">
                                                     <input type="hidden" {...batchRegister(`tracks.${index}.objectKey`)} />
                                                     <div><Label className="text-xs">Title*</Label><Input size="sm" {...batchRegister(`tracks.${index}.title`, { required: true })} /></div>
                                                     <div><Label className="text-xs">Language*</Label><Input size="sm" placeholder="en-US" {...batchRegister(`tracks.${index}.languageCode`, { required: true })} /></div>
                                                     <div><Label className="text-xs">Level</Label><Select size="sm" {...batchRegister(`tracks.${index}.level`)}><option value="">Any</option>...</Select></div>
                                                     <div><Label className="text-xs">Duration(ms)*</Label><Input size="sm" type="number" {...batchRegister(`tracks.${index}.durationMs`, { required: true, valueAsNumber: true, min: 1 })} /></div>
                                                     <div className="col-span-2"><Label className="text-xs">Description</Label><Input size="sm" {...batchRegister(`tracks.${index}.description`)} /></div>
                                                     {/* Add Public, Tags, Cover */}
                                                 </div>
                                             )}
                                         </div>
                                     );
                                })}
                                 {batchStage === 'metadata' && batchFiles.some(f => f.status === 'uploaded') && (
                                     <Button type="submit" disabled={batchIsProcessing}>
                                         {batchIsProcessing ? <Spinner size="sm"/> : <ListPlus size={16} className="mr-1"/>}
                                         Complete Batch & Create Tracks
                                     </Button>
                                 )}
                            </form>
                       )}

                      {/* Results View */}
                      {batchStage === 'results' && ( /* ... results display ... */ )}

                      {/* Reset/Cancel Button */}
                       {(batchStage !== 'select' && batchStage !== 'results') && (
                          <Button variant="outline" size="sm" onClick={resetBatchUpload} disabled={batchIsProcessing && batchStage !== 'uploading'} className="mt-2">
                             {batchStage === 'uploading' ? 'Cancel All Uploads' : 'Start Over'}
                          </Button>
                       )}

                </CardContent>
             </Card>
        </div>
    );
}