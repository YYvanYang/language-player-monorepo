// apps/user-app/_components/collection/CollectionList.tsx
import type { AudioCollectionResponseDTO } from '@repo/types';
import { CollectionCard } from './CollectionCard';
import { ListMusic } from 'lucide-react';

interface CollectionListProps {
    collections: AudioCollectionResponseDTO[];
    isLoading?: boolean;
}

export function CollectionList({ collections, isLoading }: CollectionListProps) {
    if (isLoading) {
      // Optional: Render skeleton loaders
      return (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg aspect-[4/3]"></div> // Placeholder aspect ratio
               ))}
           </div>
      );
  }

    if (!collections || collections.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <ListMusic className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2"/>
                No collections found.
                {/* TODO: Add a button/link to create one? */}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
    );
}