// apps/user-app/app/(main)/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import { listTracks } from '@/_services/trackService';
import { listMyCollections } from '@/_services/collectionService';
import { TrackList } from '@/_components/track/TrackList';
import { CollectionList } from '@/_components/collection/CollectionList';
import { Button } from '@repo/ui';
import { ArrowRight, Loader } from 'lucide-react';

// Server Component to fetch recent tracks
async function RecentlyAddedTracks() {
    try {
        // Fetch last 4 added tracks
        const { data: tracks } = await listTracks({ limit: 4, sortBy: 'createdAt', sortDir: 'desc' });
        if (!tracks || tracks.length === 0) {
             return <p className="text-sm text-slate-500 dark:text-slate-400">No tracks available yet.</p>;
        }
        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Recently Added</h2>
                    <Button variant="link" size="sm" asChild className="text-sm">
                        <Link href="/tracks">View All <ArrowRight size={16} className="ml-1 inline-block"/></Link>
                    </Button>
                </div>
                {/* TrackList itself handles the grid */}
                <TrackList tracks={tracks} />
            </section>
        );
    } catch (error) {
        console.error("Failed to load recent tracks:", error);
        return <p className="text-sm text-red-500 dark:text-red-400">Could not load recent tracks.</p>;
    }
}

// Server Component to fetch user's recent collections
async function UserCollectionsPreview() {
    let collections = [];
    let total = 0;
    let userId = null;
    try {
         // Check session server-side
         const session = await getIronSession<SessionData>(cookies(), getUserSessionOptions());
         userId = session.userId;

         // Only fetch if user is logged in
         if (userId) {
             const response = await listMyCollections({ limit: 4, sortBy: 'updatedAt', sortDir: 'desc' });
             collections = response.data;
             total = response.total;
         }

         // Don't render section if not logged in or no collections
         if (!userId || total === 0) return null;

        return (
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">Your Collections</h2>
                     <Button variant="link" size="sm" asChild className="text-sm">
                        <Link href="/collections">View All <ArrowRight size={16} className="ml-1 inline-block"/></Link>
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

// Main Page Component
export default function MainPage() {
    // This Server Component orchestrates fetching data server-side via other Server Components
    return (
        <div className="space-y-8">
            {/* TODO: Add a more engaging dashboard/welcome message */}
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Discover new audio or continue where you left off.</p>

            {/* Recent Tracks Section */}
            <Suspense fallback={<div className="p-4 text-center text-slate-500"><Loader className="inline-block mr-2 h-5 w-5 animate-spin"/>Loading recent tracks...</div>}>
                <RecentlyAddedTracks />
            </Suspense>

            {/* User Collections Section */}
            <Suspense fallback={<div className="p-4 text-center text-slate-500"><Loader className="inline-block mr-2 h-5 w-5 animate-spin"/>Loading your collections...</div>}>
                <UserCollectionsPreview />
            </Suspense>

            {/* Placeholder for other potential dashboard sections */}
            {/* <section>
                <h2 className="text-xl font-semibold mb-3">Continue Listening</h2>
                <p className="text-slate-500">...</p>
            </section> */}
        </div>
    );
}