// apps/user-app/app/(main)/profile/page.tsx
'use client'; // Needs hooks

import { useAuth } from '@/_hooks/useAuth'; // Adjust path
import { Loader, AlertTriangle, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui'; // Adjust path
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/_services/userService'; // Adjust path
import Image from 'next/image';
import Link from 'next/link';

// Query key for the user's profile
const profileQueryKey = (userId?: string) => ['profile', userId || 'guest'];

export default function ProfilePage() {
    const { user: authUser, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

    // Fetch full profile details using TanStack Query
    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError,
        error,
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
        // Should be handled by middleware, but good fallback
        return <p className="text-center text-gray-500">Please <Link href="/login" className="text-blue-600 hover:underline">login</Link> to view your profile.</p>;
    }

    if (isError) {
        return (
             <div className="p-4 border border-red-400 bg-red-50 rounded-lg text-red-700">
                <AlertTriangle className="h-5 w-5 inline mr-2"/>
                Error loading profile: {error instanceof Error ? error.message : 'Unknown error'}
             </div>
        );
    }

    if (!profileData) {
        // Could happen if query runs but returns nothing unexpectedly
        return <p className="text-center text-gray-500">Could not load profile data.</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-2xl font-bold">My Profile</h1>
                {/* TODO: Add Link/Button to Edit Profile Page */}
                 {/* <Button variant="outline" size="sm" asChild>
                     <Link href="/profile/edit"><Edit className="h-4 w-4 mr-1.5"/> Edit Profile</Link>
                 </Button> */}
            </div>

            <Card className="max-w-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                     {/* Profile Image Placeholder/Display */}
                     <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
                         {profileData.profileImageUrl ? (
                             <Image
                                 src={profileData.profileImageUrl}
                                 alt="Profile picture"
                                 width={64}
                                 height={64}
                                 className="object-cover"
                                 onError={(e) => { e.currentTarget.style.display = 'none'; /* Hide on error */ }}
                             />
                         ) : (
                             <span className="text-xl font-semibold">{profileData.name?.charAt(0)?.toUpperCase() || '?'}</span>
                         )}
                     </div>
                    <div>
                         <CardTitle>{profileData.name || 'User'}</CardTitle>
                         <CardDescription>Manage your account details.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">User ID:</span> <span className="font-mono text-xs">{profileData.id}</span></div>
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Email:</span> {profileData.email}</div>
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Name:</span> {profileData.name || <span className="italic text-slate-400">Not set</span>}</div>
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Provider:</span> <span className="capitalize">{profileData.authProvider}</span></div>
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Joined:</span> {new Date(profileData.createdAt).toLocaleDateString()}</div>
                     <div><span className="font-medium text-slate-600 dark:text-slate-400 w-24 inline-block">Last Update:</span> {new Date(profileData.updatedAt).toLocaleString()}</div>
                </CardContent>
            </Card>
        </div>
    );
}