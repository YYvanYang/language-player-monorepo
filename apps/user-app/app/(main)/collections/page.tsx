// apps/user-app/app/(main)/collections/page.tsx
import { listMyCollections } from '@/../_services/collectionService'; // Adjust alias
import { CollectionList } from '@/../_components/collection/CollectionList'; // Adjust alias
// Import Button/Link for Create New
import Link from 'next/link';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';

export default async function CollectionsPage() {
    // TODO: Implement pagination for listMyCollections service and pass params
    const { data: collections, total } = await listMyCollections({ limit: 100, offset: 0 }); // Fetch first 100 for now

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Collections</h1>
                 {/* TODO: Link to a '/collections/new' page or open a modal */}
                 <Button asChild>
                     <Link href="/collections/new"> {/* Adjust link */}
                         <Plus className="h-4 w-4 mr-2" /> Create Collection
                     </Link>
                 </Button>
             </div>
            <CollectionList collections={collections} />
             {/* TODO: Add Pagination Controls */}
        </div>
    );
}