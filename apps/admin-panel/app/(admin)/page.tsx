// apps/admin-panel/app/(admin)/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'; // Adjust path
import { Users, Music, ListMusic } from 'lucide-react';

// This is a placeholder. Fetch actual stats if needed using server-side fetching or TanStack Query.
async function getDashboardStats() {
    // Replace with actual API calls using admin services
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
    return {
        userCount: 123,
        trackCount: 456,
        collectionCount: 78,
    };
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats(); // Fetch stats server-side

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Audio Tracks</CardTitle>
                         <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.trackCount}</div>
                         <p className="text-xs text-muted-foreground">Uploaded tracks</p>
                    </CardContent>
                </Card>
                 <Card>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Collections</CardTitle>
                         <ListMusic className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold">{stats.collectionCount}</div>
                         <p className="text-xs text-muted-foreground">Created collections</p>
                     </CardContent>
                 </Card>
                {/* Add more stat cards or widgets */}
            </div>
            {/* Add charts or recent activity logs */}
        </div>
    );
}