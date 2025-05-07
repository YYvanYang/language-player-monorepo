// apps/user-app/app/(main)/upload/page.tsx
'use client';

import React, { useState, useCallback, ChangeEvent, useTransition, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/_hooks/useAuth';
import {
    requestUploadAction,
    createTrackMetadataAction,
    requestBatchUploadAction,
    completeBatchUploadAction
} from '@/_actions/uploadActions';
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle, ErrorMessage } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft, Info } from 'lucide-react';
import type {
    AudioLevel,
    CompleteUploadRequestDTO,
    BatchCompleteUploadItemDTO,
    BatchRequestUploadInputResponseItemDTO,
    BatchCompleteUploadResponseItemDTO
 } from '@repo/types';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { cn } from '@repo/utils';
import logger from '@repo/logger';

const uploadLogger = logger.child({ component: 'UploadPage' });

// --- State Types ---
type SingleUploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';
interface BatchFileStatus {
    id: string;
    file: File;
    status: 'pending' | 'requesting' | 'uploading' | 'error' | 'uploaded';
    progress: number;
    uploadUrl?: string;
    objectKey?: string;
    errorMsg?: string;
    xhr?: XMLHttpRequest;
}
type BatchUploadStage = 'select' | 'processing_files' | 'uploading' | 'metadata' | 'completing' | 'results' | 'error';

// --- Helper ---
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
        if (typeof window.AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
             uploadLogger.warn("AudioContext not supported, cannot detect duration client-side.");
             return resolve(null);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (!e.target?.result) {
                uploadLogger.warn("FileReader e.target.result is null.", { filename: audioFile.name });
                return resolve(null);
            }
            audioContext.decodeAudioData(e.target.result as ArrayBuffer)
                .then(buffer => resolve(Math.round(buffer.duration * 1000)))
                .catch(err => {
                    uploadLogger.warn({ err, filename: audioFile.name }, `Could not decode audio file client-side to get duration.`);
                    resolve(null);
                });
        };
        reader.onerror = (ev) => {
            uploadLogger.warn({ errorEvent: ev, filename: audioFile.name }, `FileReader error trying to get duration.`);
            resolve(null);
        };
        reader.readAsArrayBuffer(audioFile);
    });
};


export default function UploadPage() {
    uploadLogger.info("UploadPage rendered");
    const router = useRouter();
    const { pathname } = router; // For redirect URL, though might need full router for other parts
    const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();

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
        formState: { errors: metaErrors, isSubmitting: isMetaSubmitting },
        reset: resetMetaForm,
        setValue: setMetaValue,
        watch: watchMeta
    } = useForm<CompleteUploadRequestDTO>({
        defaultValues: { isPublic: true, title: '', languageCode: '', durationMs: 0 }
    });
    const singleObjectKeyFromForm = watchMeta('objectKey');

    useEffect(() => {
        uploadLogger.debug("Single file state monitor:", { singleFile: singleFile?.name, singleIsProcessing, currentStage: singleStage });
    }, [singleFile, singleIsProcessing, singleStage]);


    const resetSingleUpload = useCallback(() => {
        uploadLogger.info("Resetting single upload state.");
        if (singleXhrRef.current) {
            uploadLogger.debug("Aborting existing single file XHR request.");
            singleXhrRef.current.abort();
            singleXhrRef.current = null;
        }
        setSingleFile(null);
        setSingleStage('select');
        setSingleError(null);
        setSingleProgress(0);
        setSingleUploadResult(null);
        resetMetaForm({ isPublic: true, title: '', languageCode: '', durationMs: 0, objectKey: undefined });
        const fileInput = document.getElementById('singleAudioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [resetMetaForm]);

    const handleSingleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        uploadLogger.info("handleSingleFileChange triggered.");
        let capturedFileObjects: File[] = [];
        if (event.target.files && event.target.files.length > 0) {
            capturedFileObjects = Array.from(event.target.files);
        }
        uploadLogger.debug("Captured file objects (before reset):", {
            count: capturedFileObjects.length,
            names: capturedFileObjects.map(f => f.name)
        });

        resetSingleUpload();
        uploadLogger.debug("After resetSingleUpload. Input value should be cleared.");

        const file = capturedFileObjects[0];
        uploadLogger.debug("Selected file object (from captured array):", { filename: file?.name });

        if (file) {
            setSingleFile(file);
            uploadLogger.info("Single file state set.", { filename: file.name, type: file.type, size: file.size });

            const title = file.name.replace(/\.[^/.]+$/, "");
            setMetaValue('title', title);
            uploadLogger.debug("Title pre-filled.", { title });
            try {
                const duration = await getAudioDuration(file);
                uploadLogger.debug("Duration received for single file.", { duration });
                setMetaValue('durationMs', duration ?? 0);
                uploadLogger.debug("durationMs pre-filled.", { durationMs: duration ?? 0 });
            } catch (e: any) {
                uploadLogger.error({ error: e, filename: file.name }, "Error in getAudioDuration or setting durationMs for single file.");
                setMetaValue('durationMs', 0);
            }
        } else {
            uploadLogger.warn("No file selected from initially captured event.target.files array.");
        }
        uploadLogger.info("handleSingleFileChange finished.");
    }, [resetSingleUpload, setMetaValue]);

    const handleRequestSingleUpload = useCallback(async () => {
        uploadLogger.info("handleRequestSingleUpload triggered.", { currentStage: singleStage, hasFile: !!singleFile, isProcessing: singleIsProcessing, isAuthenticated });
        if (!isAuthenticated) {
            setSingleError("Authentication required to upload files.");
            setSingleStage('error');
            uploadLogger.warn("Upload request aborted: User not authenticated.");
            return;
        }
        if (!singleFile || singleStage !== 'select' || singleIsProcessing) {
            uploadLogger.warn("Request single upload aborted due to invalid state/file.", { currentStage: singleStage, hasFile: !!singleFile, isProcessing: singleIsProcessing });
            return;
        }
        setSingleError(null); setSingleProgress(0); setSingleStage('requestingUrl');
        uploadLogger.info("Requesting upload URL for single file...", { filename: singleFile.name });

        startSingleTransition(async () => {
            try {
                const result = await requestUploadAction(singleFile.name, singleFile.type);
                uploadLogger.info("requestUploadAction result received.", { resultSuccess: result.success, message: result.message, filename: singleFile.name });
                if (!result.success || !result.uploadUrl || !result.objectKey) {
                    const errorMsg = result.message || "Failed to prepare upload. Please try again.";
                    setSingleError(errorMsg); setSingleStage('error');
                    uploadLogger.error({ errorMsg, result }, "Failed to get upload URL.");
                    return;
                }
                setSingleUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
                setMetaValue('objectKey', result.objectKey);
                setSingleStage('uploading');
                uploadLogger.info("Upload URL received, starting direct upload.", { objectKey: result.objectKey, filename: singleFile.name });

                const xhr = new XMLHttpRequest();
                singleXhrRef.current = xhr;
                xhr.open('PUT', result.uploadUrl, true);
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setSingleProgress(progress);
                    }
                };
                xhr.onload = () => {
                    singleXhrRef.current = null;
                    uploadLogger.info("Single file XHR onload.", { status: xhr.status, objectKey: result.objectKey, filename: singleFile.name });
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setSingleStage('metadata');
                        uploadLogger.info("Single file upload successful, proceeding to metadata.", { objectKey: result.objectKey });
                    } else {
                        const errorMsg = `Upload failed: ${xhr.statusText || 'Server Error'} (${xhr.status}). Please try again.`;
                        setSingleError(errorMsg); setSingleStage('error');
                        uploadLogger.error({ errorMsg, status: xhr.status, statusText: xhr.statusText }, "Single file upload XHR failed.");
                    }
                };
                xhr.onerror = () => {
                    singleXhrRef.current = null;
                    const errorMsg = xhr.status === 0 ? "Upload failed: Network error or cancelled. Check connection." : "Upload error occurred. Please try again.";
                    setSingleError(errorMsg); setSingleStage('error');
                    uploadLogger.error({ errorMsg, status: xhr.status }, "Single file upload XHR error.");
                };
                xhr.onabort = () => {
                    singleXhrRef.current = null;
                    uploadLogger.info("Single upload aborted by user.", { objectKey: result?.objectKey, currentStage: singleStage });
                    if (singleStage !== 'success' && singleStage !== 'completing') setSingleStage('select');
                };
                xhr.setRequestHeader('Content-Type', singleFile.type);
                xhr.send(singleFile);

            } catch (e: any) {
                const errorMsg = e.message || "An unexpected error occurred during upload preparation.";
                setSingleError(errorMsg); setSingleStage('error');
                uploadLogger.error({ error: e }, "Exception in handleRequestSingleUpload.");
            }
        });
    }, [singleFile, singleStage, singleIsProcessing, setMetaValue, isAuthenticated]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
        uploadLogger.info("onMetadataSubmit triggered for single upload.", { currentStage: singleStage, hasUploadResult: !!singleUploadResult, isMetaSubmitting, isAuthenticated });
        if (!isAuthenticated) {
            setSingleError("Authentication required to save metadata.");
            setSingleStage('metadata');
            uploadLogger.warn("Metadata submission aborted: User not authenticated.");
            return;
        }
        if (!singleUploadResult?.objectKey || singleStage !== 'metadata' || isMetaSubmitting) {
            uploadLogger.warn("Metadata submission for single upload aborted due to invalid state.", { currentStage: singleStage, hasObjectKey: !!singleUploadResult?.objectKey, isMetaSubmitting });
            return;
        }

        const payload: CompleteUploadRequestDTO = {
            ...data,
            objectKey: singleUploadResult.objectKey,
            tags: (data.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
            level: data.level === "" ? undefined : data.level as AudioLevel,
            coverImageUrl: data.coverImageUrl === "" ? undefined : data.coverImageUrl,
            isPublic: data.isPublic ?? false,
        };
        uploadLogger.debug("Single upload metadata payload:", { payload: Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined)) });

        setSingleStage('completing'); setSingleError(null);
        uploadLogger.info("Completing single track metadata creation...", { objectKey: payload.objectKey });
        startSingleTransition(async () => {
            try {
                const result = await createTrackMetadataAction(payload);
                uploadLogger.info("createTrackMetadataAction result received.", { resultSuccess: result.success, trackId: result.track?.id, message: result.message });
                if (result.success && result.track) {
                    setSingleStage('success');
                    uploadLogger.info("Track created successfully!", { trackId: result.track.id });
                    alert("Track created successfully! Redirecting..."); // TODO: Replace with toast
                    setTimeout(() => router.push(`/tracks/${result.track?.id}`), 1500);
                } else {
                    const errorMsg = result.message || "Failed to create track metadata. Please review details and try again.";
                    setSingleError(errorMsg); setSingleStage('metadata');
                    uploadLogger.error({ errorMsg, result }, "Failed to create track metadata.");
                }
            } catch (e: any) {
                const errorMsg = e.message || "An unexpected error occurred while creating the track.";
                setSingleError(errorMsg); setSingleStage('metadata');
                uploadLogger.error({ error: e }, "Exception in onMetadataSubmit for single upload.");
            }
        });
    };

    // --- Batch Upload State & Logic ---
    const [batchFiles, setBatchFiles] = useState<BatchFileStatus[]>([]);
    const [batchStage, setBatchStage] = useState<BatchUploadStage>('select');
    const [batchOverallError, setBatchOverallError] = useState<string | null>(null);
    const [batchIsGloballyProcessing, startBatchGlobalTransition] = useTransition();
    const [batchResults, setBatchResults] = useState<BatchCompleteUploadResponseItemDTO[]>([]);

    const {
        control: batchControl,
        register: batchRegister,
        handleSubmit: handleBatchMetaSubmit,
        formState: { errors: batchMetaErrors, isSubmitting: isBatchMetaSubmitting },
        reset: resetBatchMetaForm,
        setValue: setBatchMetaValue,
        getValues: getBatchMetaValues,
    } = useForm<{ tracks: BatchCompleteUploadItemDTO[] }>({ defaultValues: { tracks: [] } });

    const { fields, replace } = useFieldArray({ control: batchControl, name: "tracks", keyName: "rhfId" });

    const resetBatchUpload = useCallback(() => {
        uploadLogger.info("Resetting batch upload state.");
        batchFiles.forEach(bf => {
            if (bf.xhr) {
                uploadLogger.debug("Aborting XHR for batch file.", { filename: bf.file.name });
                bf.xhr.abort();
            }
        });
        setBatchFiles([]); setBatchStage('select'); setBatchOverallError(null); setBatchResults([]);
        replace([]);
        const fileInput = document.getElementById('batchAudioFiles') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [batchFiles, replace]);

    const handleBatchFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        uploadLogger.info("handleBatchFileChange triggered for batch upload.");
        let capturedEventFiles: File[] = [];
        if (event.target.files && event.target.files.length > 0) {
            capturedEventFiles = Array.from(event.target.files);
        }
        uploadLogger.debug("Initial captured event.target.files for batch:", {
            count: capturedEventFiles.length,
            names: capturedEventFiles.map(f => f.name)
        });

        resetBatchUpload();
        uploadLogger.debug("After resetBatchUpload for batch.");

        if (capturedEventFiles.length === 0) {
            uploadLogger.warn("No files selected for batch upload from captured event array.");
            return;
        }

        uploadLogger.info(`Processing ${capturedEventFiles.length} files for batch upload from captured array.`);
        setBatchStage('processing_files');
        startBatchGlobalTransition(async () => {
            const newFileStatuses: BatchFileStatus[] = [];
            const metadataDefaults: Partial<BatchCompleteUploadItemDTO>[] = [];

            for (const file of capturedEventFiles) {
                let duration = null;
                try {
                    duration = await getAudioDuration(file);
                } catch (e) {
                    uploadLogger.error({ error: e, filename: file.name }, "Error getting duration for batch file.");
                }
                const fileId = crypto.randomUUID();
                newFileStatuses.push({ id: fileId, file, status: 'pending', progress: 0 });
                metadataDefaults.push({
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    durationMs: duration ?? 0,
                    isPublic: true,
                    languageCode: '',
                    tags: [],
                });
                uploadLogger.debug("Processed file for batch list.", { filename: file.name, fileId, duration });
            }
            setBatchFiles(newFileStatuses);
            replace(metadataDefaults as BatchCompleteUploadItemDTO[]);
            setBatchStage('select');
            uploadLogger.info("Batch files processed and RHF form populated. Ready for upload initiation.");
        });
    }, [resetBatchUpload, replace]);

    const handleIndividualBatchUpload = useCallback(async (fileStatus: BatchFileStatus, index: number): Promise<boolean> => {
        uploadLogger.info("handleIndividualBatchUpload triggered.", { filename: fileStatus.file.name, currentStatus: fileStatus.status, id: fileStatus.id });
        if (!fileStatus.uploadUrl || !fileStatus.objectKey || fileStatus.status === 'uploading' || fileStatus.status === 'uploaded') {
            uploadLogger.warn("Individual batch upload aborted due to invalid state or missing URL/key.", { filename: fileStatus.file.name, status: fileStatus.status, hasUrl: !!fileStatus.uploadUrl });
            return false; // Return promise directly
        }

        const xhr = new XMLHttpRequest();
        setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'uploading', progress: 0, errorMsg: undefined, xhr } : f));
        uploadLogger.info("Starting individual batch file upload via XHR.", { filename: fileStatus.file.name, objectKey: fileStatus.objectKey });

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
                uploadLogger.info("Individual batch XHR onload.", { filename: fileStatus.file.name, status: xhr.status, success });
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: success ? 'uploaded' : 'error', errorMsg: success ? undefined : `Upload failed (${xhr.status})`, xhr: undefined } : f));
                resolve(success);
            };
            xhr.onerror = () => {
                const errorMsg = xhr.status === 0 ? "Network error or cancelled" : "Upload error";
                uploadLogger.error({ errorMsg, status: xhr.status, filename: fileStatus.file.name }, "Individual batch XHR error.");
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'error', errorMsg, xhr: undefined } : f));
                resolve(false);
            };
            xhr.onabort = () => {
                uploadLogger.info("Individual batch upload aborted.", { filename: fileStatus.file.name });
                setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? { ...f, status: 'pending', errorMsg: 'Upload cancelled.', progress: 0, xhr: undefined } : f));
                resolve(false);
            };
            xhr.setRequestHeader('Content-Type', fileStatus.file.type);
            xhr.send(fileStatus.file);
        });
    }, []);

    const handleStartAllBatchUploads = useCallback(async () => {
        uploadLogger.info("handleStartAllBatchUploads triggered.", { isAuthenticated });
        if (!isAuthenticated) {
            setBatchOverallError("Authentication required to upload files.");
            setBatchStage('error');
            uploadLogger.warn("Batch upload request aborted: User not authenticated.");
            return;
        }

        const filesToRequestUrl = batchFiles.filter(f => f.status === 'pending' && !f.uploadUrl);
        uploadLogger.debug("Files needing upload URL request.", { count: filesToRequestUrl.length });

        if (filesToRequestUrl.length === 0) {
            const filesToActuallyUpload = batchFiles.filter(f => f.uploadUrl && f.objectKey && (f.status === 'pending' || f.status === 'error'));
            uploadLogger.debug("Files ready for direct upload or retry.", { count: filesToActuallyUpload.length });
            if (filesToActuallyUpload.length === 0) {
                if (batchFiles.every(f => f.status === 'uploaded')) {
                    uploadLogger.info("All batch files already uploaded, moving to metadata stage.");
                    setBatchStage('metadata');
                } else {
                    uploadLogger.warn("No files pending URL request and no files pending actual upload/retry.");
                }
                return;
            }
            setBatchStage('uploading'); setBatchOverallError(null);
            startBatchGlobalTransition(async () => {
                uploadLogger.info(`Starting actual upload for ${filesToActuallyUpload.length} files.`);
                const uploadPromises = filesToActuallyUpload.map((bf) => handleIndividualBatchUpload(bf, batchFiles.findIndex(origBf => origBf.id === bf.id)));
                await Promise.all(uploadPromises);
                setBatchFiles(currentBatchFileStates => {
                    if (currentBatchFileStates.every(f => f.status === 'uploaded' || f.status === 'error')) {
                        if (currentBatchFileStates.some(f => f.status === 'uploaded')) {
                            uploadLogger.info("Some/all batch files uploaded, moving to metadata stage.");
                            setBatchStage('metadata');
                        } else {
                            const errorMsg = "All file uploads failed or were cancelled in the batch.";
                            setBatchOverallError(errorMsg); setBatchStage('error');
                            uploadLogger.error(errorMsg);
                        }
                    }
                    return currentBatchFileStates;
                });
            });
            return;
        }

        setBatchStage('uploading'); setBatchOverallError(null);
        uploadLogger.info(`Requesting upload URLs for ${filesToRequestUrl.length} batch files.`);
        startBatchGlobalTransition(async () => {
            try {
                const requestItems = filesToRequestUrl.map(f => ({ filename: f.file.name, contentType: f.file.type }));
                const urlResult = await requestBatchUploadAction(requestItems);
                uploadLogger.info("requestBatchUploadAction result received.", { success: urlResult.success });

                if (!urlResult.success || !urlResult.results) {
                    const errorMsg = urlResult.message || "Failed to prepare batch upload URLs.";
                    setBatchOverallError(errorMsg); setBatchStage('error');
                    uploadLogger.error({ errorMsg, result: urlResult }, "Failed to get batch upload URLs.");
                    return;
                }

                let someUrlsFailed = false;
                setBatchFiles(prevBatchFiles => {
                    const updatedFiles = prevBatchFiles.map(bf => {
                        if (bf.status === 'pending' && !bf.uploadUrl) {
                            const resultItem = urlResult.results?.find(res => res.originalFilename === bf.file.name);
                            if (resultItem && !resultItem.error && resultItem.uploadUrl && resultItem.objectKey) {
                                const rhfIndex = fields.findIndex(field => field.rhfId === bf.id);
                                if (rhfIndex !== -1) {
                                    setBatchMetaValue(`tracks.${rhfIndex}.objectKey`, resultItem.objectKey);
                                }
                                return { ...bf, uploadUrl: resultItem.uploadUrl, objectKey: resultItem.objectKey, status: 'pending' };
                            } else {
                                someUrlsFailed = true;
                                return { ...bf, status: 'error', errorMsg: resultItem?.error || 'Failed to get upload URL' };
                            }
                        }
                        return bf;
                    });

                    if (someUrlsFailed) {
                        const errorMsg = "Failed to get upload URLs for some files. Please review and retry.";
                        setBatchOverallError(errorMsg); setBatchStage('select');
                        uploadLogger.error(errorMsg);
                    } else {
                        Promise.all(
                            updatedFiles
                                .filter(f => f.uploadUrl && f.objectKey && f.status === 'pending')
                                .map(bf => handleIndividualBatchUpload(bf, updatedFiles.findIndex(origBf => origBf.id === bf.id)))
                        ).then(() => {
                            setBatchFiles(finalStates => {
                                if (finalStates.every(f => f.status === 'uploaded' || f.status === 'error')) {
                                    if (finalStates.some(f => f.status === 'uploaded')) {
                                        setBatchStage('metadata');
                                    } else {
                                        setBatchOverallError("All file uploads failed or were cancelled."); setBatchStage('error');
                                    }
                                }
                                return finalStates;
                            });
                        });
                    }
                    return updatedFiles;
                });
            } catch (e: any) {
                const errorMsg = e.message || "An unexpected error occurred during batch URL preparation or initial uploads.";
                setBatchOverallError(errorMsg); setBatchStage('error');
                uploadLogger.error({ error: e }, "Exception in handleStartAllBatchUploads.");
            }
        });
    }, [batchFiles, fields, handleIndividualBatchUpload, setBatchMetaValue, isAuthenticated]);

    const onBatchMetadataSubmit: SubmitHandler<{ tracks: BatchCompleteUploadItemDTO[] }> = (data) => {
        uploadLogger.info("onBatchMetadataSubmit triggered.", { isSubmitting: isBatchMetaSubmitting, isAuthenticated });
         if (!isAuthenticated) {
            setBatchOverallError("Authentication required to save batch metadata.");
            setBatchStage('metadata');
            uploadLogger.warn("Batch metadata submission aborted: User not authenticated.");
            return;
        }
        if (isBatchMetaSubmitting) return;

        const tracksToComplete = data.tracks.filter((item, index) => {
            const correspondingFileStatus = batchFiles.find(bf => bf.id === fields[index]?.rhfId);
            return correspondingFileStatus?.status === 'uploaded' && !!item.objectKey;
        }).map((item) => ({
            ...item,
            tags: (item.tags as unknown as string)?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
            level: item.level === "" ? undefined : item.level as AudioLevel,
            description: item.description === "" ? undefined : item.description,
            coverImageUrl: item.coverImageUrl === "" ? undefined : item.coverImageUrl,
            isPublic: item.isPublic ?? false,
        }));
        uploadLogger.debug("Tracks to complete in batch:", { count: tracksToComplete.length, tracks: tracksToComplete.map(t=> ({key:t.objectKey, title:t.title})) });

        if (tracksToComplete.length === 0) {
            const errorMsg = "No successfully uploaded tracks with metadata to finalize. Please complete metadata for uploaded files.";
            setBatchOverallError(errorMsg);
            uploadLogger.warn(errorMsg);
            return;
        }

        setBatchStage('completing'); setBatchOverallError(null);
        uploadLogger.info(`Finalizing ${tracksToComplete.length} tracks in batch...`);
        startBatchGlobalTransition(async () => {
            try {
                const result = await completeBatchUploadAction(tracksToComplete);
                uploadLogger.info("completeBatchUploadAction result received.", { success: result.success });
                setBatchResults(result.results ?? []);
                setBatchStage('results');
                if (!result.success) {
                    const errorMsg = result.message || "Batch completion process reported errors. Check individual results.";
                    setBatchOverallError(errorMsg);
                    uploadLogger.error({ errorMsg, results: result.results }, "Batch completion had errors.");
                } else {
                    uploadLogger.info("Batch processing complete! Check results below.", { resultsCount: result.results?.length });
                    alert("Batch processing complete! Check results below."); // TODO: Toast
                }
            } catch (e: any) {
                const errorMsg = e.message || "An unexpected error occurred during batch finalization.";
                setBatchOverallError(errorMsg); setBatchStage('metadata');
                uploadLogger.error({ error: e }, "Exception in onBatchMetadataSubmit.");
            }
        });
    };


    // --- Conditional Rendering based on Auth ---
    if (isLoadingAuth) {
        return (
            <div className="container mx-auto py-6 flex justify-center items-center min-h-[300px]">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2 text-slate-500">Loading authentication state...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto py-10 text-center">
                 <Card className="max-w-md mx-auto p-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center text-xl">
                            <Info size={24} className="mr-2 text-blue-500" />
                            Authentication Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            Please log in to upload your audio tracks.
                        </p>
                        <Button asChild>
                            <Link href={`/login?next=${encodeURIComponent(pathname || '/upload')}`}>Login</Link>
                        </Button>
                        <p className="mt-4 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // --- Authenticated User: Render Upload UI ---
    return (
        <div className="container mx-auto py-6 space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Upload Audio</h1>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
                </Button>
            </div>

            {/* Single File Upload Section */}
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
                                 <div className="flex items-center space-x-2 col-span-1 md:col-span-2"><Checkbox id="isPublic" {...registerMeta('isPublic')} defaultChecked={true} /><Label htmlFor="isPublic" className="font-normal">Publicly Visible</Label></div>
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

            {/* Batch File Upload Section */}
             <Card>
                <CardHeader><CardTitle>Batch Track Upload</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <ErrorMessage message={batchOverallError} showIcon/>
                    {batchStage === 'select' && (
                         <div className="space-y-3">
                             <Label htmlFor="batchAudioFiles">Select Multiple Audio Files</Label>
                             <Input id="batchAudioFiles" type="file" accept="audio/*,.m4a,.ogg" multiple onChange={handleBatchFileChange} disabled={batchIsGloballyProcessing && batchStage === 'processing_files'} />
                             {batchFiles.length > 0 && <p className="text-sm text-slate-600">{batchFiles.length} file(s) selected. Ready to prepare for upload.</p>}
                             <Button onClick={handleStartAllBatchUploads} disabled={batchFiles.length === 0 || batchIsGloballyProcessing}>
                                 {batchIsGloballyProcessing && batchStage === 'processing_files' ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                                 {batchIsGloballyProcessing && batchStage === 'processing_files' ? 'Processing Files...' : `Prepare ${batchFiles.length > 0 ? batchFiles.length : ''} File(s) for Upload`}
                             </Button>
                         </div>
                    )}
                    {batchStage === 'processing_files' && ( <div className="text-center p-4"> <Loader className="h-6 w-6 animate-spin inline-block mr-2"/> Processing selected files...</div> )}
                    {(batchStage === 'uploading' || batchStage === 'metadata' || batchStage === 'completing' || batchStage === 'error') && fields.length > 0 && (
                         <form onSubmit={handleBatchMetaSubmit(onBatchMetadataSubmit)} className="space-y-4">
                             {batchStage === 'uploading' && !batchIsGloballyProcessing && batchFiles.some(f => f.status === 'pending' && f.uploadUrl) && (
                                 <div className="p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded text-sm">
                                     URLs received. <Button size="sm" type="button" onClick={handleStartAllBatchUploads} className="ml-2">Start Uploading Pending Files</Button>
                                 </div>
                             )}
                             <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
                                  {fields.map((rhfField, index) => {
                                     const fileStatus = batchFiles.find(bf => bf.id === rhfField.rhfId);
                                     if (!fileStatus) {
                                         uploadLogger.warn("Batch form field found with no matching fileStatus.", { rhfId: rhfField.rhfId, index });
                                         return null;
                                     }

                                     const isUploaded = fileStatus.status === 'uploaded';
                                     const isUploading = fileStatus.status === 'uploading';
                                     const isError = fileStatus.status === 'error';
                                     const isPendingUrl = fileStatus.status === 'pending' && !fileStatus.uploadUrl;
                                     const canEditMetadata = isUploaded || (batchStage === 'metadata' && !!getBatchMetaValues().tracks[index]?.objectKey);

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

                                             <div className="flex gap-2 mb-2">
                                                 {fileStatus.status === 'pending' && fileStatus.uploadUrl && !isUploading && (
                                                    <Button size="xs" type="button" variant="outline" onClick={() => handleIndividualBatchUpload(fileStatus, index)} disabled={batchIsGloballyProcessing}>Upload this file</Button>
                                                 )}
                                                 {isUploading && fileStatus.xhr && (
                                                     <Button size="xs" type="button" variant="destructive" onClick={() => fileStatus.xhr?.abort()}>Cancel</Button>
                                                 )}
                                                  {isError && (
                                                     <Button size="xs" type="button" variant="outline" onClick={() => {
                                                         uploadLogger.info("Retrying batch item.", { filename: fileStatus.file.name, hasUrl: !!fileStatus.uploadUrl });
                                                         if (!fileStatus.uploadUrl) {
                                                             setBatchFiles(prev => prev.map(f => f.id === fileStatus.id ? {...f, status: 'pending', errorMsg: undefined} : f));
                                                         } else {
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
                                                     <div className="flex items-center space-x-2 md:col-span-2"><Checkbox id={`isPublic-${rhfField.rhfId}`} {...batchRegister(`tracks.${index}.isPublic`)} defaultChecked={true} /><Label htmlFor={`isPublic-${rhfField.rhfId}`} className="font-normal text-xs">Publicly Visible</Label></div>
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