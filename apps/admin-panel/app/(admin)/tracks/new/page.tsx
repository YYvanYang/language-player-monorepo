// apps/admin-panel/app/(admin)/tracks/new/page.tsx
'use client';

import React, { useState, useTransition, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { requestUploadAction, createTrackMetadataAction } from '@/../_actions/adminTrackActions'; // Adjust alias
import { ResourceForm, FieldSchema } from '@/../_components/admin/ResourceForm'; // Adjust alias
import { Button } from '@repo/ui';
import { Loader, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import type { CompleteUploadRequestDTO, AudioLevel } from '@repo/types';

// Define the schema for the metadata form (could be moved to a helper)
const trackMetadataSchema: FieldSchema<CompleteUploadRequestDTO>[] = [
    // objectKey is hidden, populated after upload
    { name: 'title', label: 'Title', type: 'text', required: true, validation: { maxLength: 255 } },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'languageCode', label: 'Language Code', type: 'text', required: true, placeholder: 'e.g., en-US' },
    { name: 'level', label: 'Level', type: 'select', options: [
        { value: "", label: "-- Select Level --" },
        { value: "A1", label: "A1" }, { value: "A2", label: "A2" },
        { value: "B1", label: "B1" }, { value: "B2", label: "B2" },
        { value: "C1", label: "C1" }, { value: "C2", label: "C2" },
        { value: "NATIVE", label: "Native" },
    ]},
    { name: 'durationMs', label: 'Duration (ms)', type: 'number', required: true, validation: { min: 1, valueAsNumber: true }, placeholder: 'Calculated after upload or manual entry' },
    { name: 'isPublic', label: 'Publicly Visible', type: 'checkbox' },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'news, easy, grammar' },
    { name: 'coverImageUrl', label: 'Cover Image URL (Optional)', type: 'text', validation: { pattern: /^(https?:\/\/).*/ } , placeholder: 'https://...'},
];


export default function NewTrackPage() {
    const router = useRouter();
    const [uploadStage, setUploadStage] = useState<'select' | 'uploading' | 'metadata' | 'error'>('select');
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const [objectKey, setObjectKey] = useState<string | null>(null);
    const [durationMs, setDurationMs] = useState<number | undefined>(undefined);

    const [isRequestingUrl, startRequestTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadError(null);
            setUploadStage('select'); // Allow re-selecting
             // Attempt to get duration client-side
             getAudioDuration(selectedFile);
        }
    };

     const getAudioDuration = (audioFile: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContext.decodeAudioData(e.target?.result as ArrayBuffer)
                .then(buffer => {
                    setDurationMs(Math.round(buffer.duration * 1000));
                    console.log("Detected duration:", buffer.duration * 1000, "ms");
                })
                .catch(err => {
                    console.warn("Could not decode audio file client-side to get duration:", err);
                    setDurationMs(undefined); // Reset if detection fails
                });
        };
         reader.onerror = () => {
            console.warn("FileReader error trying to get duration.");
            setDurationMs(undefined);
         };
        reader.readAsArrayBuffer(audioFile);
    };

    const handleRequestUpload = () => {
        if (!file) {
            setUploadError("Please select an audio file first.");
            return;
        }
        setUploadError(null);
        setUploadProgress(0);

        startRequestTransition(async () => {
            const result = await requestUploadAction(file.name, file.type);
            if (result.success && result.uploadUrl && result.objectKey) {
                setPresignedUrl(result.uploadUrl);
                setObjectKey(result.objectKey);
                setUploadStage('uploading'); // Move to uploading stage
                handleDirectUpload(result.uploadUrl); // Start upload immediately
            } else {
                setUploadError(result.message || "Failed to get upload URL.");
                setUploadStage('error');
            }
        });
    };

    const handleDirectUpload = useCallback((url: string) => {
        if (!file || !url) return;

        setIsUploading(true);
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };
        xhr.onload = () => {
            setIsUploading(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log("Upload successful!");
                setUploadStage('metadata'); // Move to metadata stage
            } else {
                console.error("Upload failed:", xhr.status, xhr.responseText);
                setUploadError(`Upload failed: ${xhr.statusText || 'Network Error'}`);
                setUploadStage('error');
            }
        };
        xhr.onerror = () => {
            setIsUploading(false);
            console.error("Upload error (network).");
            setUploadError("Upload failed due to a network error.");
            setUploadStage('error');
        };
        xhr.setRequestHeader('Content-Type', file.type); // Set content type for upload
        xhr.send(file);
    }, [file]);


    // Handle success after metadata form submission
    const handleMetadataSuccess = (result: any) => {
        if(result?.success && result?.track?.id) {
            console.log("Track created successfully, redirecting...");
            // Redirect to the track list or the new track's edit page
            router.push('/tracks'); // Redirect to track list
            // or router.push(`/tracks/${result.track.id}/edit`);
        } else {
            // Error is handled by ResourceForm's useActionState display
            console.error("Metadata submission failed (state received):", result?.message);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Upload New Audio Track</h1>

            {/* --- Step 1: File Selection --- */}
            {uploadStage === 'select' && (
                <div className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
                    <label htmlFor="audioFile" className="block text-sm font-medium text-gray-700">
                        Select Audio File
                    </label>
                    <Input
                        id="audioFile"
                        name="audioFile"
                        type="file"
                        accept="audio/mpeg, audio/ogg, audio/wav, audio/aac, audio/mp4" // Adjust accepted types
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                     {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name} ({file.type})</p>}
                     {durationMs !== undefined && <p className="text-sm text-gray-500">Detected duration: ~{Math.round(durationMs / 1000)}s</p>}
                     {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}

                    <Button
                        onClick={handleRequestUpload}
                        disabled={!file || isRequestingUrl}
                        className="mt-4"
                    >
                        {isRequestingUrl ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                        {isRequestingUrl ? 'Preparing...' : 'Start Upload Process'}
                    </Button>
                </div>
            )}

            {/* --- Step 2: Uploading Progress --- */}
            {uploadStage === 'uploading' && (
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                     <h2 className="text-lg font-semibold mb-3">Uploading {file?.name}...</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm mt-2">{uploadProgress}% Complete</p>
                     {isUploading && !isRequestingUrl && <Loader className="h-5 w-5 animate-spin inline-block ml-2" />}
                     {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
                </div>
            )}

            {/* --- Step 3: Metadata Form --- */}
            {uploadStage === 'metadata' && objectKey && (
                <div className="mt-6 p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center text-green-600 mb-4">
                       <CheckCircle className="h-5 w-5 mr-2" /> Upload Complete! Enter Track Details:
                    </div>
                    <ResourceForm<CompleteUploadRequestDTO> // Ensure type matches
                        schema={trackMetadataSchema}
                         initialData={{ // Pre-fill known values
                            objectKey: objectKey, // IMPORTANT: Include hidden field if needed, or handle in action
                            durationMs: durationMs, // Pre-fill detected duration
                            isPublic: true, // Default to public
                         } as any} // Cast might be needed if form type differs slightly
                        action={createTrackMetadataAction.bind(null, /* Add hidden objectKey if form doesn't have it */ objectKey)} // Bind objectKey if not part of form data directly
                        onSuccess={handleMetadataSuccess}
                        submitButtonText="Create Track"
                    />
                </div>
            )}

             {/* --- Error State --- */}
            {uploadStage === 'error' && uploadError && (
                 <div className="mt-6 p-4 border border-red-400 bg-red-50 rounded-lg text-red-700 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {uploadError}
                      <Button onClick={() => setUploadStage('select')} variant="outline" size="sm" className="ml-auto">Try Again</Button>
                 </div>
            )}

        </div>
    );
}