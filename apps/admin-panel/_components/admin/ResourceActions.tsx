// apps/admin-panel/_components/admin/ResourceActions.tsx
'use client';

import React, { useState, useTransition, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Loader } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repo/ui"; // Assuming AlertDialog components are exported from @repo/ui

interface ResourceActionsProps {
    resourceId: string;
    editPath?: string; // Path for the edit page, e.g., /users/[id]/edit
    deleteAction?: (id: string) => Promise<{ success: boolean; message?: string }>; // Server action for delete
    resourceName?: string; // e.g., "user", "track" for confirmation message
    onDeleteSuccess?: () => void; // Optional callback after successful delete
    onDeleteError?: (message?: string) => void; // Optional callback on delete error
}

export function ResourceActions({
    resourceId,
    editPath,
    deleteAction,
    resourceName = 'item',
    onDeleteSuccess,
    onDeleteError,
}: ResourceActionsProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    // Using AlertDialog, no need for separate showConfirmDialog state

    const handleDeleteConfirm = () => {
        if (!deleteAction || isDeleting) return;

        startDeleteTransition(async () => {
            const result = await deleteAction(resourceId);
            // Dialog closes automatically on action click if not prevented
            if (result.success) {
                console.log(`${resourceName} ${resourceId} deleted successfully.`);
                // TODO: Replace alert with a toast notification library
                alert(`${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)} deleted successfully.`);
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                console.error(`Failed to delete ${resourceName} ${resourceId}:`, result.message);
                 // TODO: Replace alert with a toast notification library
                alert(`Error deleting ${resourceName}: ${result.message || 'Unknown error'}`);
                 if (onDeleteError) onDeleteError(result.message);
            }
        });
    };

    return (
        <div className="space-x-1 flex items-center justify-end">
             {/* Edit Button */}
            {editPath && (
                <Button variant="ghost" size="icon" asChild title={`Edit ${resourceName}`}>
                    <Link href={editPath}>
                        <Pencil className="h-4 w-4 text-blue-600 hover:text-blue-700" />
                    </Link>
                </Button>
            )}

            {/* Delete Button */}
            {deleteAction && (
                 <AlertDialog>
                     <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title={`Delete ${resourceName}`} disabled={isDeleting}>
                              {isDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-red-600 hover:text-red-700"/>}
                          </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                         <AlertDialogHeader>
                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                         <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the {resourceName}.
                         </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                         <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                             {isDeleting ? "Deleting..." : "Yes, delete"}
                         </AlertDialogAction>
                         </AlertDialogFooter>
                     </AlertDialogContent>
                 </AlertDialog>
            )}
        </div>
    );
}