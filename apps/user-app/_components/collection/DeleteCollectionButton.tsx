// --- Client Component for Delete Button ---
'use client';
import { useState, useTransition } from 'react';
import { deleteCollectionAction } from '@/_actions/collectionActions';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@repo/ui"; // Assume AlertDialog exists
import { Button } from '@repo/ui';
import { Loader, Trash2 } from 'lucide-react';

interface DeleteCollectionButtonProps {
    collectionId: string;
    collectionTitle: string;
}
export function DeleteCollectionButton({ collectionId, collectionTitle }: DeleteCollectionButtonProps) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = () => {
        setError(null);
        startDeleteTransition(async () => {
            const result = await deleteCollectionAction(collectionId);
            if (result.success) {
                alert("Collection deleted."); // Replace with toast
                router.push('/collections'); // Redirect after delete
            } else {
                setError(result.message || "Failed to delete collection.");
                 // Keep dialog open on error? Or close and show toast? Closing is simpler.
            }
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                    {isDeleting ? <Loader className="h-4 w-4 mr-1.5 animate-spin"/> : <Trash2 className="h-4 w-4 mr-1.5"/>}
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the collection &quot;{collectionTitle}&quot;? This action cannot be undone.
                         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
// export default DeleteCollectionButton;