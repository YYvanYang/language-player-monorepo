// apps/user-app/app/(main)/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { listTracks } from '@/_services/trackService'; // Adjust alias
import { listMyCollections } from '@/_services/collectionService'; // Adjust alias
import { TrackList } from '@/_components/track/TrackList'; // Adjust alias
import { CollectionList } from '@/_components/collection/CollectionList'; // Adjust alias
import { Button } from '@repo/ui';
import { ArrowRight } from 'lucide-react';

async function RecentlyAddedTracks() {
    try {
        const { data: tracks } = await listTracks({ limit: 4, sortBy: 'createdAt', sortDir: 'desc' });
        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Recently Added Tracks</h2>
                    <Button variant="link" asChild className="text-sm">
                        <Link href="/tracks">View All <ArrowRight size={16} className="ml-1"/></Link>
                    </Button>
                </div>
                <TrackList tracks={tracks} />
            </section>
        );
    } catch (error) {
        console.error("Failed to load recent tracks:", error);
        return <p className="text-sm text-red-500">Could not load recent tracks.</p>;
    }
}

async function UserCollectionsPreview() {
    try {
         // Check session server-side
         const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
         if (!session.userId) return null; // Don't show if not logged in

        const { data: collections } = await listMyCollections({ limit: 4, sortBy: 'updatedAt', sortDir: 'desc' });
         if (!collections || collections.length === 0) return null; // Don't show empty section

        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Your Collections</h2>
                     <Button variant="link" asChild className="text-sm">
                        <Link href="/collections">View All <ArrowRight size={16} className="ml-1"/></Link>
                    </Button>
                </div>
                <CollectionList collections={collections} />
            </section>
        );
    } catch (error) {
        console.error("Failed to load user collections preview:", error);
        // Don't render the section on error
        return null;
    }
}


export default function MainPage() {
    // This page can use Server Components to fetch initial data previews
    return (
        <div className="space-y-8">
            {/* Welcome message or other dashboard elements */}
            <h1 className="text-3xl font-bold">Welcome to AudioLang Player</h1>
            <p className="text-slate-600 dark:text-slate-400">Explore tracks and manage your collections.</p>

            {/* Use Suspense to handle loading of server components */}
            <Suspense fallback={<div className="p-4 text-center">Loading recent tracks...</div>}>
                <RecentlyAddedTracks />
            </Suspense>

            <Suspense fallback={<div className="p-4 text-center">Loading your collections...</div>}>
                <UserCollectionsPreview />
            </Suspense>

            {/* Add other dashboard sections like recent progress, etc. */}
        </div>
    );
}