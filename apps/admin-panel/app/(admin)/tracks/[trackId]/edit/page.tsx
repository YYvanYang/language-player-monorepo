// apps/admin-panel/app/(admin)/tracks/[trackId]/edit/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminTrack } from '@/_hooks/useAdminTracks'; // Use admin hook
import { ResourceForm, FieldSchema } from '@/_components/admin/ResourceForm';
import { updateTrackAction } from '@/_actions/adminTrackActions'; // Use admin action
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import type { CompleteUploadRequestDTO, AudioTrackResponseDTO, AudioLevel } from '@repo/types';
import Link from 'next/link';
import { Button } from '@repo/ui'; // Assuming Button is in ui

// Define the schema for editing track metadata
const trackEditSchema: FieldSchema<Partial<CompleteUploadRequestDTO>>[] = [
    // Key fields (often non-editable by admin once created)
    // { name: 'objectKey', label: 'Object Key', type: 'text', readOnly: true },
    // { name: 'durationMs', label: 'Duration (ms)', type: 'number', readOnly: true },

    // Editable fields
    { name: 'title', label: 'Title', type: 'text', required: 'Title is required.', validation: { maxLength: { value: 255, message: 'Title too long' } } },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'languageCode', label: 'Language Code', type: 'text', required: 'Language code is required.', placeholder: 'e.g., en-US' },
    { name: 'level', label: 'Level', type: 'select', options: [
        { value: "", label: "-- No Level --" },
        { value: "A1", label: "A1" }, { value: "A2", label: "A2" },
        { value: "B1", label: "B1" }, { value: "B2", label: "B2" },
        { value: "C1", label: "C1" }, { value: "C2", label: "C2" },
        { value: "NATIVE", label: "Native" },
    ], placeholder: "-- Select Level --" },
    { name: 'isPublic', label: 'Publicly Visible', type: 'checkbox' },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'news, easy, grammar' },
    { name: 'coverImageUrl', label: 'Cover Image URL (Optional)', type: 'text', validation: { pattern: { value: /^(https?:\/\/).*/, message: "Must be a valid URL" } } , placeholder: 'https://...'},
];

// Helper to map the fetched Track DTO to the subset needed for the form default values
function mapTrackToEditFormData(track?: AudioTrackResponseDTO): Partial<CompleteUploadRequestDTO> | undefined {
    if (!track) return undefined;
    return {
        title: track.title,
        description: track.description ?? '', // Ensure empty string if null
        languageCode: track.languageCode,
        level: track.level ?? '', // Map null/undefined level to empty string for select
        isPublic: track.isPublic,
        tags: track.tags ?? [], // Ensure array, even if null
        coverImageUrl: track.coverImageUrl ?? '', // Ensure empty string if null
        // Exclude non-editable fields like durationMs, objectKey
    };
}

export default function EditTrackPage() {
    const params = useParams();
    const router = useRouter();
    const trackId = params.trackId as string;

    // Fetch initial data using TanStack Query hook for ADMIN track details
    const { data: trackData, isLoading, isError, error } = useAdminTrack(trackId);

    // Handle successful update
    const handleUpdateSuccess = (result: any) => {
         if(result?.success) {
             console.log("Track updated successfully.");
             // Optionally show toast message
             alert("Track updated successfully!"); // Replace with toast
             // Navigate back to track list
             router.push('/tracks');
         } else {
             // Error handled by ResourceForm's useActionState display
             console.error("Track update failed (state received):", result?.message);
             // Optionally show error toast based on form state
         }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin" /> Loading track data...</div>;
    }

    if (isError) {
        return (
             <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700 flex items-center">
                 <AlertTriangle className="h-5 w-5 mr-2" />
                 Error loading track data: {error?.message || 'Unknown error'}
             </div>
        );
    }

    if (!trackData) {
         // This case might indicate a 404 handled by the hook/service, or an unexpected null
         return <div className="text-center p-10">Track not found. <Link href="/tracks" className="text-blue-600 hover:underline">Go back</Link></div>;
    }

    // Map the fetched data to the format expected by the form
    // Need to handle tags array -> comma-separated string for text input
    const initialFormData = mapTrackToEditFormData(trackData);
    const initialFormValuesForRHF = {
         ...initialFormData,
         tags: initialFormData?.tags?.join(', ') ?? '', // Convert tags array to comma-separated string
    };


    // Bind the trackId to the server action - **IMPORTANT**: updateTrackAction expects FormData, ResourceForm provides it
    // So, no need to manually bind data here if using form action prop.
    // const boundUpdateAction = (prevState: any, formData: FormData) => updateTrackAction(trackId, formData);

    return (
        <div className="container mx-auto py-6">
             <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/tracks"><ArrowLeft size={16} className="mr-1"/> Back to Tracks</Link>
            </Button>
            <h1 className="text-2xl font-bold mb-1">Edit Track</h1>
            <p className="text-sm text-slate-500 mb-6 truncate">ID: {trackId}</p>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                 <ResourceForm<CompleteUploadRequestDTO> // Use DTO reflecting form fields
                    schema={trackEditSchema}
                    initialData={initialFormValuesForRHF} // Pass comma-separated tags
                    // Pass the action directly, ResourceForm handles FormData submission
                    action={(prevState, formData) => updateTrackAction(trackId, formData)}
                    onSuccess={handleUpdateSuccess}
                    // onError={(msg) => { /* Optional: Show toast */ }}
                    submitButtonText="Update Track"
                />
            </div>
        </div>
    );
}