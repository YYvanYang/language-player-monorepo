// apps/user-app/_components/collection/CollectionCard.tsx
import Link from 'next/link';
import type { AudioCollectionResponseDTO } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'; // Use Card parts
import { ListMusic, BookOpen } from 'lucide-react'; // Example icons
import { cn } from '@repo/utils';

interface CollectionCardProps {
    collection: AudioCollectionResponseDTO;
    className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
    const Icon = collection.type === 'COURSE' ? BookOpen : ListMusic;
    return (
        // Wrap Card in Link
        <Link href={`/collections/${collection.id}`} className={cn("block group", className)}>
             <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200"> {/* Ensure card fills height if in grid */}
                <CardHeader className="pb-2"> {/* Adjust padding */}
                     <div className="flex justify-between items-start gap-2">
                         <CardTitle className="text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                             {collection.title}
                         </CardTitle>
                         <Icon className="h-5 w-5 text-slate-400 flex-shrink-0 mt-1" />
                     </div>
                </CardHeader>
                 <CardContent className="flex-grow pt-0"> {/* Remove top padding, allow grow */}
                     <CardDescription className="text-xs line-clamp-3">
                         {collection.description || <span className="italic text-slate-400">No description.</span>}
                     </CardDescription>
                 </CardContent>
                 <div className="text-xs text-slate-500 border-t dark:border-slate-700 px-4 py-2 mt-auto"> {/* Footer style */}
                     <span className="capitalize">{collection.type.toLowerCase()}</span>
                     {/* TODO: Add track count if API provides it */}
                     {/* {collection.trackCount !== undefined && <span className="ml-2">{collection.trackCount} Tracks</span>} */}
                </div>
            </Card>
        </Link>
    );
}