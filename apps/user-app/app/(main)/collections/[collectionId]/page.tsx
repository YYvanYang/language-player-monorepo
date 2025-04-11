// apps/user-app/app/(main)/collections/[collectionId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCollectionDetailsWithTracks } from '@/_services/collectionService'; // Use correct path
import { CollectionTrackList } from '@/_components/collection/CollectionTrackList'; // Use correct path
import { Button } from '@repo/ui';
import { ListMusic, BookOpen, Edit, Trash2, ArrowLeft } from 'lucide-react'; // Use correct path
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use correct path
import { APIError } from '@repo/api-client'; // Use correct path
import { DeleteCollectionButton } from '@/_components/collection/DeleteCollectionButton'; // Client component for delete confirmation

interface CollectionDetailPageProps {
    params: { collectionId: string };
}

// --- Generate Metadata ---
export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
    try {
        // Fetch only basic details if possible, otherwise reuse full fetch
        const collection = await getCollectionDetailsWithTracks(params.collectionId);
        return { title: `${collection?.title || 'Collection'} - AudioLang Player`, description: collection?.description };
    } catch (error) {
        // Handle 404 specifically for metadata generation
        if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
            return { title: 'Collection Not Found' };
        }
        console.error("Error generating metadata for collection:", params.collectionId, error);
        return { title: 'Error' };
    }
}

// --- Server Component Logic ---
export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
    const collectionId = params.collectionId;
    let collectionDetails: Awaited<ReturnType<typeof getCollectionDetailsWithTracks>> | null = null;
    // Tracks are usually included in the details response, initialize based on that
    let trackDetails: Awaited<ReturnType<typeof getCollectionDetailsWithTracks>>['tracks'] = [];
    let fetchError: string | null = null;
    let isOwner = false; // Determine ownership

    try {
        // Check session server-side to determine ownership *before* making potentially sensitive UI decisions
        const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
        const currentUserId = session.userId;

        // Fetch collection details (backend handles actual data access permissions)
        collectionDetails = await getCollectionDetailsWithTracks(collectionId);

        // Determine if the logged-in user is the owner for UI controls
        isOwner = !!currentUserId && !!collectionDetails && collectionDetails.ownerId === currentUserId;

        // Extract tracks if they were included in the details response
        trackDetails = collectionDetails?.tracks ?? [];

    } catch (error: any) {
        console.error(`Error loading collection ${collectionId}:`, error);
        if (error instanceof APIError && (error.status === 404 || error.status === 403)) {
            notFound(); // 404 or Forbidden -> Not Found Page
        }
        fetchError = error.message || "Failed to load collection details.";
    }

    // Handle case where fetch succeeded but returned null (should be caught by error ideally)
    if (!fetchError && !collectionDetails) {
        notFound();
    }

    // Display error if fetch failed but wasn't a 404/403
    if (fetchError) {
        return <div className="container mx-auto py-6 text-center p-10 text-red-600">{fetchError}</div>;
    }

    // Type guard for collectionDetails after error handling
    if (!collectionDetails) return null;

    const Icon = collectionDetails.type === 'COURSE' ? BookOpen : ListMusic;

    return (
        <div className="container mx-auto py-6">
             <Button variant="outline" size="sm" asChild className="mb-4">
                 <Link href="/collections"><ArrowLeft size={16} className="mr-1"/> Back to Collections</Link>
             </Button>

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
                             <Button variant="outline" size="sm" asChild>
                                 <Link href={`/collections/${collectionId}/edit`}>
                                     <Edit className="h-4 w-4 mr-1.5"/> Edit
                                 </Link>
                             </Button>
                             {/* Client component for delete confirmation */}
                             <DeleteCollectionButton collectionId={collectionId} collectionTitle={collectionDetails.title} />
                         </div>
                     )}
                </div>
                {collectionDetails.description && (
                    <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">{collectionDetails.description}</p>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-4 mt-6">Tracks ({trackDetails?.length ?? 0})</h2>

            {/* Pass tracks and ownership status to Client Component */}
             {/* No Suspense needed here if tracks are included in initial load */}
            <CollectionTrackList
                initialTracks={trackDetails ?? []}
                collectionId={collectionId}
                isOwner={isOwner}
            />
        </div>
    );
}

// --- Client Component for Delete Button ---
// (Can be in a separate file e.g., _components/collection/DeleteCollectionButton.tsx)
'use client';
import { useState, useTransition } from 'react';
import { deleteCollectionAction } from '@/_actions/collectionActions';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui"; // Assume AlertDialog exists

interface DeleteCollectionButtonProps {
    collectionId: string;
    collectionTitle: string;
}
function DeleteCollectionButton({ collectionId, collectionTitle }: DeleteCollectionButtonProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        setError(null);
        startDeleteTransition(async () => {
            const result = await deleteCollectionAction(collectionId);
            if (result.success) {
                alert("Collection deleted."); // Replace with toast
                router.push('/collections'); // Redirect after delete
            } else {
                setError(result.message || "Failed to delete collection.");
                 // Keep dialog open on error? Or close and show toast? Closing is simpler.
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                    {isDeleting ? <Loader className="h-4 w-4 mr-1.5 animate-spin"/> : <Trash2 className="h-4 w-4 mr-1.5"/>}
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the collection &quot;{collectionTitle}&quot;? This action cannot be undone.
                         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}