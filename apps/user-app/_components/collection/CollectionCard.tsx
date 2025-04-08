// apps/user-app/_components/collection/CollectionCard.tsx
import Link from 'next/link';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Card } from '@repo/ui';
import { ListMusic, BookOpen } from 'lucide-react'; // Example icons

interface CollectionCardProps {
    collection: AudioCollectionResponseDTO;
}

export function CollectionCard({ collection }: CollectionCardProps) {
    const Icon = collection.type === 'COURSE' ? BookOpen : ListMusic;
    return (
        <Link href={`/collections/${collection.id}`} className="block hover:opacity-90 transition-opacity">
             <Card className="h-full flex flex-col"> {/* Ensure card fills height if needed */}
                <div className="p-4 flex-grow">
                     <div className="flex justify-between items-start mb-2">
                         <h3 className="font-semibold text-lg group-hover:text-blue-600">{collection.title}</h3>
                         <Icon className="h-5 w-5 text-gray-400" />
                     </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{collection.description || 'No description.'}</p>
                </div>
                 <div className="text-xs text-gray-500 border-t p-3 mt-auto">
                     <span>Type: {collection.type}</span>
                     {/* Add track count if available directly on DTO */}
                     {/* {collection.trackCount !== undefined && <span>{collection.trackCount} Tracks</span>} */}
                </div>
            </Card>
        </Link>
    );
}