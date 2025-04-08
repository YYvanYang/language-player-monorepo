// apps/user-app/_components/collection/CollectionList.tsx
import type { AudioCollectionResponseDTO } from '@repo/types';
import { CollectionCard } from './CollectionCard';

interface CollectionListProps {
    collections: AudioCollectionResponseDTO[];
}

export function CollectionList({ collections }: CollectionListProps) {
    if (!collections || collections.length === 0) {
        return <p className="text-center text-gray-500">No collections found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
    );
}