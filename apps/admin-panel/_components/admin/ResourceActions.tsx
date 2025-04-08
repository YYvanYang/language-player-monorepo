// apps/admin-panel/_components/admin/ResourceActions.tsx
'use client';

import React, { useState, useTransition, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { Pencil, Trash2, Loader } from 'lucide-react';
// Import a simple Dialog or use window.confirm
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui"; // Example if using Shadcn AlertDialog

interface ResourceActionsProps {
    resourceId: string;
    editPath?: string; // Path for the edit page, e.g., /users/[id]/edit
    deleteAction?: (id: string) => Promise<{ success: boolean; message?: string }>; // The server action to call for delete
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
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDelete = () => {
        if (!deleteAction) return;

        startDeleteTransition(async () => {
            const result = await deleteAction(resourceId);
            setShowConfirmDialog(false); // Close dialog regardless of outcome
            if (result.success) {
                console.log(`${resourceName} ${resourceId} deleted successfully.`);
                // Optionally show success toast
                if (onDeleteSuccess) onDeleteSuccess();
                // Cache invalidation (revalidateTag/Path) happens in the Server Action itself
            } else {
                console.error(`Failed to delete ${resourceName} ${resourceId}:`, result.message);
                // Optionally show error toast
                 if (onDeleteError) onDeleteError(result.message);
            }
        });
    };

    // --- Using window.confirm (Simpler) ---
    const handleDeleteClick = () => {
         if (!deleteAction || isDeleting) return;
         if (window.confirm(`Are you sure you want to delete this ${resourceName}? This action cannot be undone.`)) {
             handleDelete();
         }
    };

    // --- Using a Modal Dialog (Example structure - requires Dialog component) ---
    // const handleDeleteClickWithModal = () => {
    //      if (!deleteAction || isDeleting) return;
    //      setShowConfirmDialog(true);
    // };

    return (
        <div className="space-x-1 flex items-center justify-end">
             {/* Edit Button */}
            {editPath && (
                <Button variant="ghost" size="icon" asChild title={`Edit ${resourceName}`}>
                    <Link href={editPath}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                    </Link>
                </Button>
            )}

            {/* Delete Button */}
            {deleteAction && (
                <>
                    {/* --- Option 1: window.confirm --- */}
                     <Button
                        variant="ghost"
                        size="icon"
                        title={`Delete ${resourceName}`}
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-red-600"/>}
                    </Button>

                    {/* --- Option 2: Modal Dialog --- */}
                     {/* <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                        <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" title={`Delete ${resourceName}`} disabled={isDeleting}>
                                 {isDeleting ? <Loader className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4 text-red-600"/>}
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
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                                {isDeleting ? "Deleting..." : "Yes, delete"}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog> */}
                </>
            )}
        </div>
    );
}