// apps/user-app/app/(main)/collections/[collectionId]/edit/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCollectionDetailsWithTracks } from '@/_services/collectionService';
import { CollectionForm } from '@/_components/collection/CollectionForm';
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { useAuth } from '@/_hooks/useAuth'; // Check ownership client-side

// Define query key factory
const collectionQueryKeys = {
    detail: (id: string) => ['collection', id] as const,
};

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, isLoading: isLoadingAuth } = useAuth();
    const collectionId = params.collectionId as string;

    // Fetch collection data
    const { data: collectionData, isLoading: isLoadingCollection, isError, error, isFetching } = useQuery({
        queryKey: collectionQueryKeys.detail(collectionId),
        queryFn: () => getCollectionDetailsWithTracks(collectionId),
        enabled: !!collectionId, // Only fetch if ID exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isLoading = isLoadingAuth || isLoadingCollection;
    const isOwner = user?.id === collectionData?.ownerId;

    // Handle success: Invalidate cache and navigate back to detail page
    const handleSuccess = () => {
        // Invalidate the specific collection query
        queryClient.invalidateQueries({ queryKey: collectionQueryKeys.detail(collectionId) });
        // Invalidate the user's list of collections if title changed
        if (user?.id) {
            queryClient.invalidateQueries({ queryKey: ['collections', user.id] });
        }
        // Redirect back to the collection detail page
        router.push(`/collections/${collectionId}`);
        alert("Collection updated successfully!"); // TODO: Replace with toast
    };

    const handleCancel = () => {
        router.back(); // Go back to previous page
    };

    // --- Render Logic ---

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/> Loading...</div>;
    }

    if (isError) {
        return (
            <div className="container mx-auto py-6">
                <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700">
                    <AlertTriangle className="h-5 w-5 inline mr-2"/>
                    Error loading collection: {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            </div>
        );
    }

    // Check ownership *after* data has loaded
    if (!isLoadingAuth && !isOwner && collectionData) { // Only check if auth loaded and user is not owner
         return (
             <div className="container mx-auto py-6 text-center">
                 <p className="text-red-600">You do not have permission to edit this collection.</p>
                 <Button variant="link" asChild className="mt-4"><Link href="/collections">Back to Collections</Link></Button>
             </div>
         );
     }

    if (!collectionData) {
        return <div className="container mx-auto py-6 text-center">Collection not found.</div>;
    }

    return (
        <div className="container mx-auto py-6">
            {/* Breadcrumbs or Back Button */}
             <Button variant="outline" size="sm" onClick={handleCancel} className="mb-4">
                <ArrowLeft size={16} className="mr-1"/> Back
            </Button>

            <h1 className="text-2xl font-bold mb-1">Edit Collection</h1>
             <p className="text-sm text-slate-500 mb-6 truncate" title={collectionData.title}>
                Editing: {collectionData.title}
            </p>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm max-w-2xl">
                 {/* Pass initial data to the form */}
                 <CollectionForm
                    initialData={collectionData}
                    onSuccess={handleSuccess} // Use specific callback
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}