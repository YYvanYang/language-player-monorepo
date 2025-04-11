// apps/admin-panel/app/(admin)/tracks/[trackId]/edit/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use params from hook
import { useAdminTrack } from '@/_hooks/useAdminTracks'; // Adjust path for single track hook
import { ResourceForm, FieldSchema } from '@/_components/admin/ResourceForm'; // Adjust path
import { updateTrackAction } from '@/_actions/adminTrackActions'; // Adjust path
import { Loader, AlertTriangle } from 'lucide-react';
import type { CompleteUploadRequestDTO, AudioTrackResponseDTO } from '@repo/types'; // Import types

// Define the schema for editing track metadata
const trackEditSchema: FieldSchema<Partial<CompleteUploadRequestDTO>>[] = [ // Use partial for updates
    // Can't edit objectKey or duration usually
    { name: 'title', label: 'Title', type: 'text', required: true, validation: { maxLength: 255 } },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'languageCode', label: 'Language Code', type: 'text', required: true, placeholder: 'e.g., en-US' },
    { name: 'level', label: 'Level', type: 'select', options: [ /* ... same options as create ... */ ]},
    { name: 'isPublic', label: 'Publicly Visible', type: 'checkbox' },
    { name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'news, easy, grammar' },
    { name: 'coverImageUrl', label: 'Cover Image URL (Optional)', type: 'text', validation: { pattern: /^(https?:\/\/).*/ } , placeholder: 'https://...'},
];

// Helper to map the fetched Track DTO to the subset needed for the form default values
function mapTrackToEditFormData(track?: AudioTrackResponseDTO): Partial<CompleteUploadRequestDTO> | undefined {
    if (!track) return undefined;
    return {
        title: track.title,
        description: track.description,
        languageCode: track.languageCode,
        level: track.level, // Already string or empty string
        isPublic: track.isPublic,
        tags: track.tags,
        coverImageUrl: track.coverImageUrl,
        // Exclude non-editable fields like durationMs, objectKey
    };
}

export default function EditTrackPage() {
    const params = useParams();
    const router = useRouter();
    const trackId = params.trackId as string; // Get trackId from URL

    // Fetch initial data using TanStack Query hook
    const { data: trackData, isLoading, isError, error } = useAdminTrack(trackId);

    // Handle successful update
    const handleUpdateSuccess = (result: any) => {
         if(result?.success) {
             console.log("Track updated successfully.");
             // Optionally show toast message
             // Navigate back to track list or detail view
             router.push('/tracks');
         } else {
             // Error handled by ResourceForm's useActionState display
             console.error("Track update failed (state received):", result?.message);
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
         // Or use Next.js notFound() if hook/service handles it appropriately
         return <div>Track not found.</div>
    }

    // Map the fetched data to the format expected by the form
    const initialFormData = mapTrackToEditFormData(trackData);

    // Bind the trackId to the server action
    const boundUpdateAction = updateTrackAction.bind(null, trackId);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Edit Track: {trackData.title}</h1>
            <div className="p-6 border rounded-lg bg-white shadow-sm">
                 <ResourceForm<Partial<CompleteUploadRequestDTO>> // Use partial type for update
                    schema={trackEditSchema}
                    initialData={initialFormData}
                    action={boundUpdateAction} // Use the bound action
                    onSuccess={handleUpdateSuccess}
                    submitButtonText="Update Track"
                />
            </div>
        </div>
    );
}