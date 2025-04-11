// apps/admin-panel/app/(admin)/tracks/new/page.tsx
'use client';

import React, { useState, useTransition, useCallback, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { requestAdminUploadAction, createTrackMetadataAction } from '@/_actions/adminTrackActions'; // Use ADMIN actions
import { Button, Input, Label, Textarea, Select, Checkbox, Spinner, Progress, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { UploadCloud, FileAudio, CheckCircle, AlertTriangle, Loader, ListPlus, CircleCheckBig, CircleX, X as IconX, RotateCcw, ArrowLeft } from 'lucide-react';
import type { CompleteUploadRequestDTO } from '@repo/types';
import { useForm } from 'react-hook-form';
import { cn } from '@repo/utils';
import Link from 'next/link';

// Define state types
type UploadStage = 'select' | 'requestingUrl' | 'uploading' | 'metadata' | 'completing' | 'success' | 'error';

// Helper to get audio duration client-side
const getAudioDuration = (audioFile: File): Promise<number | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContext.decodeAudioData(e.target?.result as ArrayBuffer)
                .then(buffer => resolve(Math.round(buffer.duration * 1000)))
                .catch(err => {
                    console.warn("Could not decode audio file client-side to get duration:", err);
                    resolve(null); // Resolve with null on error
                });
        };
        reader.onerror = () => {
            console.warn("FileReader error trying to get duration.");
            resolve(null);
        };
        reader.readAsArrayBuffer(audioFile);
    });
};

export default function NewTrackPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [stage, setStage] = useState<UploadStage>('select');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadResult, setUploadResult] = useState<{ uploadUrl: string; objectKey: string } | null>(null);
    const [isProcessing, startTransition] = useTransition(); // Generic processing state
    const xhrRef = useRef<XMLHttpRequest | null>(null); // For cancelling upload

    // React Hook Form for metadata
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CompleteUploadRequestDTO>({
         defaultValues: { isPublic: true } // Default to public?
    });
    const durationValue = watch("durationMs"); // Watch duration to display

    const resetFlow = useCallback(() => {
        if (xhrRef.current) {
            xhrRef.current.abort();
            xhrRef.current = null;
        }
        setFile(null);
        setStage('select');
        setErrorMsg(null);
        setUploadProgress(0);
        setUploadResult(null);
        reset({ isPublic: true }); // Reset form to defaults
        const fileInput = document.getElementById('audioFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }, [reset]);

    const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        resetFlow();
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Pre-fill title and attempt duration detection
             setValue('title', selectedFile.name.replace(/\.[^/.]+$/, ""));
            const duration = await getAudioDuration(selectedFile);
            if (duration) {
                setValue('durationMs', duration);
            } else {
                 setValue('durationMs', 0); // Reset or set to 0 if detection fails
            }
        }
    }, [resetFlow, setValue]);

    const handleRequestUpload = useCallback(() => {
        if (!file || stage !== 'select') return;
        setErrorMsg(null);
        setUploadProgress(0);
        setStage('requestingUrl');
        startTransition(async () => {
            const result = await requestAdminUploadAction(file.name, file.type); // Use ADMIN action
            if (!result.success || !result.uploadUrl || !result.objectKey) {
                setErrorMsg(result.message || "Failed to prepare upload.");
                setStage('error');
                return;
            }
            setUploadResult({ uploadUrl: result.uploadUrl, objectKey: result.objectKey });
            setStage('uploading');
            handleDirectUpload(result.uploadUrl, result.objectKey); // Pass key for metadata
        });
    }, [file, stage]);

    const handleDirectUpload = useCallback((url: string, objKey: string) => {
        if (!file || !url) return;

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open('PUT', url, true);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () => {
            xhrRef.current = null;
            if (xhr.status >= 200 && xhr.status < 300) {
                setStage('metadata');
                setValue('objectKey', objKey); // Set the object key in the form
            } else {
                setErrorMsg(`Upload failed: ${xhr.statusText || 'Error'} (${xhr.status})`);
                setStage('error');
            }
        };
        xhr.onerror = () => {
            xhrRef.current = null;
            if (stage !== 'select') { // Only set error if not already reset
                setErrorMsg(xhr.status === 0 ? "Upload failed: Network error or cancelled." : "Upload error occurred.");
                setStage('error');
            }
        };
         xhr.onabort = () => { xhrRef.current = null; console.log("Upload aborted."); };
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    }, [file, stage, setValue]);

    const onMetadataSubmit: SubmitHandler<CompleteUploadRequestDTO> = (data) => {
         if (!uploadResult?.objectKey || stage !== 'metadata') return;
         data.objectKey = uploadResult.objectKey; // Ensure key is set
         // Convert tags string back to array
         if (typeof data.tags === 'string') {
             data.tags = (data.tags as string).split(',').map(t => t.trim()).filter(Boolean);
         }
         if (data.coverImageUrl === '') data.coverImageUrl = undefined; // Handle empty optional URL
         if (data.level === '') data.level = undefined; // Handle empty optional level


         setStage('completing');
         setErrorMsg(null);
         startTransition(async () => {
             const result = await createTrackMetadataAction(data); // Use ADMIN action
             if (result.success && result.track) {
                 setStage('success');
                 setTimeout(() => router.push(`/tracks/${result.track?.id}/edit`), 1500); // Redirect to edit page
             } else {
                 setErrorMsg(result.message || "Failed to create track metadata.");
                 setStage('metadata'); // Return to metadata stage on error
             }
         });
     };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-2xl font-bold">Upload New Track</h1>
                 <Button variant="outline" size="sm" asChild>
                    <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
                 </Button>
            </div>

            {/* Stage Display */}
            <div className="flex justify-center space-x-2 text-sm text-slate-500">
                <span className={cn(stage === 'select' && 'font-semibold text-blue-600')}>1. Select File</span>
                <span>&rarr;</span>
                <span className={cn(stage === 'uploading' && 'font-semibold text-blue-600')}>2. Upload</span>
                 <span>&rarr;</span>
                <span className={cn(stage === 'metadata' && 'font-semibold text-blue-600')}>3. Add Details</span>
                <span>&rarr;</span>
                 <span className={cn(stage === 'success' && 'font-semibold text-green-600')}>4. Complete</span>
            </div>

            {/* Error Display */}
            {stage === 'error' && errorMsg && (
                 <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700 flex items-center justify-between">
                     <span><AlertTriangle className="h-5 w-5 inline mr-2"/> {errorMsg}</span>
                     <Button variant="ghost" size="sm" onClick={resetFlow}><RotateCcw size={16}/> Try Again</Button>
                 </div>
            )}
             {stage === 'success' && (
                  <div className="p-4 border border-green-400 bg-green-50 rounded-lg text-green-700 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 inline mr-2"/> Track created successfully! Redirecting...
                  </div>
             )}

             {/* Step 1: Select File */}
             <Card className={cn(stage !== 'select' && 'hidden')}>
                 <CardHeader><CardTitle>Select Audio File</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                      <Label htmlFor="audioFile">Audio File (MP3, WAV, etc.)</Label>
                      <Input
                          id="audioFile"
                          name="audioFile"
                          type="file"
                          accept="audio/*"
                          onChange={handleSingleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600"
                      />
                      {file && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Selected: {file.name} ({file.type})</p>}
                      {watch("durationMs") > 0 && <p className="text-sm text-gray-500">Detected duration: ~{Math.round(watch("durationMs") / 1000)}s</p>}
                      <Button onClick={handleRequestUpload} disabled={!file || isProcessing} >
                          {isProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                          {isProcessing ? 'Preparing...' : 'Start Upload'}
                      </Button>
                 </CardContent>
             </Card>

            {/* Step 2: Uploading */}
            <Card className={cn(stage !== 'uploading' && 'hidden')}>
                <CardHeader><CardTitle>Uploading {file?.name}...</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-center text-sm">{uploadProgress}% Complete</p>
                    <Button variant="outline" size="sm" onClick={resetFlow} disabled={!xhrRef.current}>Cancel Upload</Button>
                </CardContent>
            </Card>

            {/* Step 3: Metadata */}
            <Card className={cn(stage !== 'metadata' && 'hidden')}>
                <CardHeader>
                    <CardTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Upload Complete - Add Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onMetadataSubmit)} className="space-y-4">
                         {/* Hidden field for objectKey */}
                        <input type="hidden" {...register('objectKey')} />

                         {/* Render Metadata Fields (Simplified Example) */}
                        <div><Label htmlFor="title">Title*</Label><Input id="title" {...register('title', { required: true })} className={cn(errors.title && "border-red-500")}/>{errors.title && <p className='text-xs text-red-500 mt-1'>Title is required.</p>}</div>
                        <div><Label htmlFor="languageCode">Language Code*</Label><Input id="languageCode" {...register('languageCode', { required: true })} className={cn(errors.languageCode && "border-red-500")} placeholder="e.g., en-US"/>{errors.languageCode && <p className='text-xs text-red-500 mt-1'>Language code is required.</p>}</div>
                        <div><Label htmlFor="durationMs">Duration (ms)*</Label><Input id="durationMs" type="number" {...register('durationMs', { required: true, min: 1, valueAsNumber: true })} className={cn(errors.durationMs && "border-red-500")} readOnly={!!watch("durationMs")} />{errors.durationMs && <p className='text-xs text-red-500 mt-1'>Valid duration (ms) is required.</p>}</div>
                        <div><Label htmlFor="level">Level</Label><Select id="level" {...register('level')}><option value="">-- Optional --</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option><option>NATIVE</option></Select></div>
                        <div className="flex items-center space-x-2"><Checkbox id="isPublic" {...register('isPublic')} defaultChecked={true} /><Label htmlFor="isPublic">Publicly Visible</Label></div>
                        <div><Label htmlFor="description">Description</Label><Textarea id="description" {...register('description')} /></div>
                        <div><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" {...register('tags')} /></div>
                        <div><Label htmlFor="coverImageUrl">Cover Image URL</Label><Input id="coverImageUrl" type="url" {...register('coverImageUrl')} placeholder="https://..." /></div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" type="button" onClick={resetFlow} disabled={isProcessing}>Cancel</Button>
                            <Button type="submit" disabled={isProcessing}>
                                {isProcessing ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
                                Create Track
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* --- Batch Upload Section (Future Implementation) --- */}
            {/* <Card> ... </Card> */}

        </div>
    );
}