// apps/user-app/app/(main)/collections/[collectionId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCollectionDetailsWithTracks, getTracksForCollection } from '@/../_services/collectionService';
import { CollectionTrackList } from '@/../_components/collection/CollectionTrackList';
import { Button } from '@repo/ui';
import { ListMusic, BookOpen, Edit, Trash2, WifiOff } from 'lucide-react';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { APIError } from '@repo/api-client';
// Import client component for delete confirmation
// import { DeleteCollectionButton } from '@/../_components/collection/DeleteCollectionButton'; // Example

interface CollectionDetailPageProps {
    params: { collectionId: string };
}

// --- Generate Metadata ---
export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
    try {
        // Fetch only basic details for metadata if possible, or reuse full fetch
        const collection = await getCollectionDetailsWithTracks(params.collectionId);
        return { title: collection?.title || 'Collection Not Found', description: collection?.description };
    } catch (error) { return { title: 'Error' }; }
}

// --- Server Component Logic ---
export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
    const collectionId = params.collectionId;
    let collectionDetails: Awaited<ReturnType<typeof getCollectionDetailsWithTracks>> | null = null;
    let trackDetails: Awaited<ReturnType<typeof getTracksForCollection>> | null = [];
    let fetchError: string | null = null;
    let isOwner = false; // Determine ownership

    try {
        // Check session server-side to determine ownership *before* fetching
        // This prevents leaking existence of private collections
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        const currentUserId = session.userId;

        // Fetch collection details (backend handles actual ownership check for data access)
        collectionDetails = await getCollectionDetailsWithTracks(collectionId);

        // Now determine if the logged-in user is the owner for UI controls
        isOwner = !!currentUserId && collectionDetails?.ownerId === currentUserId;

        // Fetch tracks separately if collectionDetails doesn't include them,
        // or if you want to ensure you get the latest track list independently.
        // If collectionDetails includes tracks, this might be redundant.
        // Assuming getCollectionDetailsWithTracks *does* return tracks:
        trackDetails = collectionDetails?.tracks ?? [];
        // If it *doesn't* return tracks:
        // trackDetails = await getTracksForCollection(collectionId);

    } catch (error: any) {
        console.error(`Error loading collection ${collectionId}:`, error);
        if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
            notFound(); // 404 or Forbidden -> Not Found Page
        }
        fetchError = error.message || "Failed to load collection details.";
    }

    // Handle case where collection was fetched but is null (should be caught by error ideally)
    if (!fetchError && !collectionDetails) {
        notFound();
    }

    // Display error if fetch failed but wasn't a 404/403
    if (fetchError) {
        return <div className="text-center p-10 text-red-600">{fetchError}</div>;
    }

    // Type guard for collectionDetails
    if (!collectionDetails) return null; // Should be unreachable if error handling is correct

    const Icon = collectionDetails.type === 'COURSE' ? BookOpen : ListMusic;

    return (
        <div>
            <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium uppercase">{collectionDetails.type}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-1">{collectionDetails.title}</h1>
                    </div>
                     {/* Edit/Delete Buttons - Only visible to owner */}
                     {isOwner && (
                         <div className="flex-shrink-0 flex space-x-2 mt-2 sm:mt-0">
                             {/* TODO: Link to edit page */}
                             <Button variant="outline" size="sm" asChild>
                                 <Link href={`/collections/${collectionId}/edit`}>
                                     <Edit className="h-4 w-4 mr-1.5"/> Edit
                                 </Link>
                             </Button>
                             {/* TODO: Implement DeleteCollectionButton client component with confirmation */}
                             {/* <DeleteCollectionButton collectionId={collectionId} /> */}
                         </div>
                     )}
                </div>
                {collectionDetails.description && (
                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">{collectionDetails.description}</p>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Tracks ({trackDetails?.length ?? 0})</h2>
            {/* Pass tracks and ownership status to Client Component */}
            <Suspense fallback={<div className="mt-6">Loading tracks...</div>}>
                <CollectionTrackList
                    initialTracks={trackDetails ?? []}
                    collectionId={collectionId}
                    isOwner={isOwner}
                />
            </Suspense>
        </div>
    );
}