// apps/user-app/app/(main)/profile/page.tsx
'use client'; // Needs useAuth hook

import { useAuth } from '@/../_hooks/useAuth'; // Adjust path
import { Loader } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'; // Adjust path

// If profile data needs fetching beyond basic auth info:
// import { useQuery } from '@tanstack/react-query';
// import { getMyProfile } from '@/../_services/userService';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Optional: Fetch more detailed profile if AuthContext only has ID
    // const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    //     queryKey: ['profile', user?.id],
    //     queryFn: () => getMyProfile(), // Assuming service exists
    //     enabled: !!user?.id,
    // });
    // const displayUser = profileData || user; // Use detailed data if available
    // const effectiveLoading = isLoading || isLoadingProfile;

    const effectiveLoading = isLoading; // Use basic loading state for now

    if (effectiveLoading) {
        return <div className="flex justify-center items-center p-10"><Loader className="h-8 w-8 animate-spin"/></div>;
    }

    if (!isAuthenticated || !user) {
        // This shouldn't happen if middleware is correct, but handle defensively
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Your registered details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Add profile image display if available */}
                    {/* {displayUser.profileImageUrl && <Image ... />} */}
                    <p><span className="font-medium">User ID:</span> {user.id}</p>
                    {/* Display more details if fetched */}
                    {/* <p><span className="font-medium">Name:</span> {displayUser.name || 'Not set'}</p> */}
                    {/* <p><span className="font-medium">Email:</span> {displayUser.email || 'Not available'}</p> */}
                    {/* <p><span className="font-medium">Provider:</span> {displayUser.authProvider}</p> */}
                    {/* Add link/button to edit profile page */}
                </CardContent>
            </Card>
        </div>
    );
}