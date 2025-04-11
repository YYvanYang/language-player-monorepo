// apps/user-app/app/(main)/collections/[collectionId]/edit/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCollectionDetailsWithTracks } from '@/_services/collectionService'; // Adjust alias
import { CollectionForm } from '@/_components/collection/CollectionForm'; // Adjust alias
import { Loader, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Define query key
const collectionQueryKey = (id: string) => ['collection', id];

export default function EditCollectionPage() {
    const params = useParams();
    const router = useRouter();
    const collectionId = params.collectionId as string;

    // Fetch collection data
    const { data: collectionData, isLoading, isError, error } = useQuery({
        queryKey: collectionQueryKey(collectionId),
        queryFn: () => getCollectionDetailsWithTracks(collectionId),
        enabled: !!collectionId, // Only fetch if ID exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const handleSuccess = () => {
        // Redirect back to the collection detail page after successful update
        router.push(`/collections/${collectionId}`);
         // Optionally show a success toast notification
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin"/> Loading...</div>;
    }

    if (isError) {
        return (
            <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700">
                <AlertTriangle className="h-5 w-5 inline mr-2"/>
                Error loading collection: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    if (!collectionData) {
        // Should be caught by error handler or notFound in service typically
        return <div>Collection not found.</div>;
    }

    return (
        <div>
            <nav className="text-sm mb-4" aria-label="Breadcrumb">
               <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                       <Link href="/collections" className="text-blue-600 hover:underline">Collections</Link>
                        <svg className="fill-current w-3 h-3 mx-3" /* ... icon path ... */></svg>
                    </li>
                     <li className="flex items-center">
                       <Link href={`/collections/${collectionId}`} className="text-blue-600 hover:underline truncate max-w-[200px]">{collectionData.title}</Link>
                        <svg className="fill-current w-3 h-3 mx-3" /* ... icon path ... */></svg>
                    </li>
                    <li>
                       <span className="text-gray-500">Edit</span>
                    </li>
               </ol>
           </nav>

            {/* Pass initial data to the form */}
            <CollectionForm
                initialData={collectionData}
                onSuccessRedirect={handleSuccess} // Use specific callback
            />

             {/* Link to manage tracks (optional, could be part of detail page only) */}
             <div className="mt-6 text-center">
                 <Link href={`/collections/${collectionId}`} className="text-sm text-blue-600 hover:underline">
                     View or Manage Tracks in this Collection
                 </Link>
             </div>
        </div>
    );
}