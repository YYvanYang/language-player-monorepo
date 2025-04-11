// apps/user-app/app/(main)/collections/page.tsx
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { listMyCollections, type ListMyCollectionsParams } from '@/_services/collectionService';
import { CollectionList } from '@/_components/collection/CollectionList';
import { Button } from '@repo/ui';
import { Plus, ListMusic, Info } from 'lucide-react';
import { PaginationControls } from '@/_components/ui/PaginationControls';
import { DefaultLimit } from '@repo/utils'; // Use shared constant

interface CollectionsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function CollectionsContent({ searchParams }: CollectionsPageProps) {
    const page = parseInt(searchParams?.page as string || '1', 10);
    const limit = parseInt(searchParams?.limit as string || String(DefaultLimit), 10);
    const offset = (page - 1) * limit;

    // Check auth status directly here to avoid fetching if not logged in
    const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
    if (!session.userId) {
        return (
             <div className="text-center text-slate-500 dark:text-slate-400 py-10">
                  <Info size={24} className="mx-auto mb-2 text-slate-400"/>
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view or create collections.
             </div>
        );
    }

    try {
        // Fetch data for the current page
        const params: ListMyCollectionsParams = { limit, offset, sortBy: 'updatedAt', sortDir: 'desc' }; // Example sort
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
         console.error("Failed to load user collections:", error);
         // Handle specific errors if needed (e.g., API down)
         return <p className="text-center text-red-500 dark:text-red-400">Could not load your collections at this time. Please try again later.</p>;
    }
}

export default function CollectionsPage({ searchParams }: CollectionsPageProps) {
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
             {/* Suspense handles loading state */}
            <Suspense fallback={<div className="text-center p-10 text-slate-500">Loading collections...</div>}>
                <CollectionsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}