// apps/user-app/app/(main)/collections/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
// Now uses the service function that calls the proxy
import { listMyCollections, type ListMyCollectionsParams } from '@/_services/collectionService';
import { CollectionList } from '@/_components/collection/CollectionList';
import { Button } from '@repo/ui';
import { Plus, ListMusic, Info, ShieldAlert } from 'lucide-react';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { DefaultLimit } from '@repo/utils'; // Adjusted import
import { Loader } from 'lucide-react';
import { APIError } from '@repo/api-client'; // Adjusted import


// REMOVED decryptAccessToken placeholder function

async function CollectionsContent({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const page = parseInt(searchParams?.page as string || '1', 10);
    const limit = parseInt(searchParams?.limit as string || String(DefaultLimit), 10);
    const offset = (page - 1) * limit;

    // Check session server-side ONLY to determine if user is logged in
    const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
    const currentUserId = session.userId;

    // REMOVED: Token decryption logic is now handled by the BFF proxy

    if (!currentUserId) {
        return (
             <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                  <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view or create collections.
             </div>
        );
    }

    // REMOVED: decryptionError check is no longer needed here

    try {
        // Fetch data using the service function that calls the proxy
        const params: ListMyCollectionsParams = { limit, offset, sortBy: 'updatedAt', sortDir: 'desc' };
        // REMOVED: Token argument is no longer passed to listMyCollections
        const { data: collections, total } = await listMyCollections(params);

        if (total === 0) {
            return (
                 <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <ListMusic className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2"/>
                    You haven't created any collections yet.
                     <Button asChild size="sm" className="mt-4">
                        <Link href="/collections/new">
                            <Plus className="h-4 w-4 mr-1" /> Create Your First Collection
                        </Link>
                     </Button>
                </div>
             );
        }

        return (
            <>
                <CollectionList collections={collections} />
                <PaginationControls
                    totalItems={total}
                    currentPage={page}
                    itemsPerPage={limit}
                />
            </>
        );
    } catch (error: any) {
        console.error("Failed to load user collections (via proxy):", error);
         // Handle 401 error coming FROM THE PROXY
        if (error instanceof APIError && error.status === 401) {
             return (
                 <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                      <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                     Your session may have expired or is invalid. Please <Link href="/login?next=/collections" className="text-blue-600 hover:underline font-medium">Login</Link> again.
                 </div>
             );
        }
        // Handle other errors (e.g., 502 from proxy if backend is down)
         const message = error instanceof APIError ? error.message : "Could not load your collections. Please try again later.";
         return <p className="text-center text-red-500 dark:text-red-400">{message}</p>;
    }
}

// Main export using Suspense remains the same
export default function CollectionsPage({ searchParams }: { searchParams?: { /*...*/ } }) {
    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">Your Collections</h1>
                 <Button asChild size="sm">
                     <Link href="/collections/new">
                         <Plus className="h-4 w-4 mr-1" /> Create Collection
                     </Link>
                 </Button>
            </div>
            {/* Use a more specific loading indicator */}
            <Suspense fallback={<div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/> Loading Collections...</div>}>
                <CollectionsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}