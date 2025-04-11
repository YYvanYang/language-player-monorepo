// apps/user-app/app/(main)/profile/page.tsx
'use client'; // Needs client hooks for auth check and data fetching

import { useAuth } from '@/_hooks/useAuth';
import { Loader, AlertTriangle, Edit, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/_services/userService';
import Image from 'next/image';
import Link from 'next/link';

// Query key for the user's profile
const profileQueryKey = (userId?: string) => ['profile', userId || 'guest'] as const;

export default function ProfilePage() {
    const { user: authUser, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

    // Fetch full profile details using TanStack Query
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError,
        error,
        isFetching, // Indicates background refetching
    } = useQuery({
        queryKey: profileQueryKey(authUser?.id),
        queryFn: getMyProfile, // Service function fetches from /users/me
        enabled: !!authUser?.id, // Only run query if user ID is available
        staleTime: 5 * 60 * 1000, // Cache profile for 5 minutes
    });

    const isLoading = isLoadingAuth || (isAuthenticated && isLoadingProfile);

    if (isLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin text-blue-500"/></div>;
    }

    if (!isAuthenticated || !authUser) {
        // Should be handled by middleware, but provide a clear message
        return (
             <p className="text-center text-slate-500 dark:text-slate-400 py-10">
                 Please <Link href="/login" className="text-blue-600 hover:underline font-medium">Login</Link> or{' '}
                 <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>{' '}
                 to view your profile.
             </p>
        );
    }

    if (isError) {
        return (
             <div className="container mx-auto py-6">
                 <div className="p-4 border border-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5 inline mr-2"/>
                    Error loading profile: {error instanceof Error ? error.message : 'Unknown error'}
                 </div>
             </div>
        );
    }

    if (!profileData && !isFetching) {
        // Could happen if API returns empty success or if authUser exists but profile fetch fails silently
        return <p className="text-center text-slate-500 dark:text-slate-400 py-10">Could not load profile data.</p>;
    }

    // Display data, handle potential fetching state
    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
                {/* TODO: Implement Edit Profile functionality and link */}
                 {/* <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/edit"><Edit className="h-4 w-4 mr-1.5"/> Edit Profile</Link>
                 </Button> */}
            </div>

            <Card className="max-w-lg mx-auto md:mx-0"> {/* Center on small screens */}
                <CardHeader className="flex flex-row items-center gap-4">
                     {/* Profile Image */}
                     <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative">
                         {profileData?.profileImageUrl ? (
                             <Image
                                 src={profileData.profileImageUrl}
                                 alt="Profile picture"
                                 fill // Use fill layout
                                 sizes="64px" // Specify size hint
                                 className="object-cover"
                                 onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; /* Hide on error */ }}
                             />
                         ) : (
                             <UserCircle size={40} className="text-slate-400 dark:text-slate-500" />
                         )}
                     </div>
                    <div>
                         <CardTitle>{profileData?.name || 'User'}</CardTitle>
                         <CardDescription>Your account details.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                     {profileData ? (
                         <>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">User ID:</span> <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{profileData.id}</span></div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Email:</span> {profileData.email}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Name:</span> {profileData.name || <span className="italic text-slate-400">Not set</span>}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Provider:</span> <span className="capitalize px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{profileData.authProvider}</span></div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Joined:</span> {new Date(profileData.createdAt).toLocaleDateString()}</div>
                             <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Last Update:</span> {new Date(profileData.updatedAt).toLocaleString()}</div>
                          </>
                     ) : (
                         <div className="text-center text-slate-500">Loading profile details...</div>
                     )}
                 </CardContent>
            </Card>
        </div>
    );
}