'use client';

import * as React from 'react';
import { Link } from '@repo/ui'; // Use shared Link component

// Placeholder for AuthContext or session hook
// import { useAuth } from '@/../_context/AuthContext';

export function Sidebar() {
    // Placeholder: Fetch user status (logged in/out)
    const isAuthenticated = false; // Replace with actual auth check
    const isAdmin = false; // Replace with actual role check if needed

    return (
        <aside className="w-64 bg-gray-100 p-4 border-r">
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link href="/dashboard">Dashboard</Link>
                            </li>
                            {/* Add other authenticated user links */}
                            <li>
                                {/* Placeholder for logout button/action */}
                                <button>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/login">Login</Link>
                            </li>
                            <li>
                                <Link href="/register">Register</Link>
                            </li>
                        </>
                    )}
                    {/* Example Admin Link (conditionally rendered) */}
                    {isAuthenticated && isAdmin && (
                        <li>
                            <Link href="/admin">Admin Panel</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
} 