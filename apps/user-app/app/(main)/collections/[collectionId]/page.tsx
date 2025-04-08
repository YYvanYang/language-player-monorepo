// apps/user-app/app/(main)/collections/[collectionId]/page.tsx
import { notFound } from 'next/navigation';
import { getCollectionDetailsWithTracks } from '@/../_services/collectionService'; // Adjust alias
import { CollectionTrackList } from '@/../_components/collection/CollectionTrackList'; // Adjust alias
import { Button } from '@repo/ui'; // For Edit/Delete buttons
import Link from 'next/link';
// Import client component for delete confirmation if needed

interface CollectionDetailPageProps {
    params: { collectionId: string };
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
    const collectionId = params.collectionId;
    let collectionDetails;

    try {
        // Fetches collection AND its tracks (service needs to handle this)
        collectionDetails = await getCollectionDetailsWithTracks(collectionId);
        if (!collectionDetails) notFound();
    } catch (error: any) {
        console.error("Error fetching collection details:", collectionId, error);
        if (error.code === 'NOT_FOUND' || error.code === 'FORBIDDEN') { // Check APIError code
            notFound(); // Treat permission denied as not found for non-owners
        }
        return <div>Error loading collection.</div>;
    }

    return (
        <div>
            <div className="mb-4 border-b pb-4">
                 <div className="flex justify-between items-start">
                    <div>
                         <h1 className="text-3xl font-bold mb-1">{collectionDetails.title}</h1>
                         <p className="text-sm text-gray-500">Type: {collectionDetails.type}</p>
                    </div>
                     <div className="space-x-2">
                        {/* TODO: Link to edit page or open edit modal */}
                         <Button variant="outline" size="sm">Edit</Button>
                        {/* TODO: Add Delete button with confirmation */}
                         {/* <DeleteCollectionButton collectionId={collectionId} /> */}
                     </div>
                 </div>
                {collectionDetails.description && (
                    <p className="text-gray-700 mt-2">{collectionDetails.description}</p>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-4">Tracks in this collection</h2>
            {/* Pass tracks to a potentially client component list */}
            <CollectionTrackList
                tracks={collectionDetails.tracks ?? []}
                collectionId={collectionId}
                // Pass callbacks for reordering/removing if implemented client-side
            />
        </div>
    );
}