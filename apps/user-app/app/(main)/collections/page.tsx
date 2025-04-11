// apps/user-app/app/(main)/collections/page.tsx
import { Suspense } from 'react';
import { listMyCollections } from '@/_services/collectionService'; // Adjust alias
import { CollectionList } from '@/_components/collection/CollectionList'; // Adjust alias
import Link from 'next/link';
import { Button } from '@repo/ui'; // Adjust alias
import { Plus } from 'lucide-react';
import { PaginationControls } from '@/_components/ui/PaginationControls'; // Adjust alias
import { DefaultLimit } from '@/pkg/pagination/pagination'; // Import default limit

// Define search params type for the page
interface CollectionsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function CollectionsContent({ searchParams }: CollectionsPageProps) {
    const page = parseInt(searchParams?.page as string || '1', 10);
    const limit = parseInt(searchParams?.limit as string || String(DefaultLimit), 10);
    const offset = (page - 1) * limit;

    try {
        // Fetch data for the current page
        const { data: collections, total } = await listMyCollections({ limit, offset });

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
    } catch (error) {
         console.error("Failed to load collections:", error);
         // Handle error (e.g., user not authenticated will redirect via middleware,
         // but other errors could occur)
         return <p className="text-center text-red-500">Could not load collections.</p>;
    }
}

export default function CollectionsPage({ searchParams }: CollectionsPageProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Collections</h1>
                <Button asChild>
                    <Link href="/collections/new">
                        <Plus className="h-4 w-4 mr-2" /> Create Collection
                    </Link>
                </Button>
            </div>
            <Suspense fallback={<div className="text-center p-10">Loading collections...</div>}>
                {/* Pass searchParams down */}
                <CollectionsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}