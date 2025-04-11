// apps/user-app/app/(main)/collections/new/page.tsx
'use client'; // Form interaction requires client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { CollectionForm } from '@/_components/collection/CollectionForm';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import type { AudioCollectionResponseDTO } from '@repo/types';

// Note: Metadata can still be defined in Server Components, but this page needs to be client-rendered
// export const metadata = {
//     title: 'Create New Collection - AudioLang Player',
// };

export default function CreateCollectionPage() {
    const router = useRouter();

    const handleSuccess = (createdCollection?: AudioCollectionResponseDTO) => {
         // Redirect to the newly created collection's page
         if (createdCollection?.id) {
             alert("Collection created!"); // Replace with toast
             router.push(`/collections/${createdCollection.id}`);
         } else {
             // Fallback redirect if ID isn't returned (shouldn't happen ideally)
             router.push('/collections');
         }
     };

     const handleCancel = () => {
         router.back(); // Or redirect to /collections
     };

    return (
        <div className="container mx-auto py-6">
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/collections"><ArrowLeft size={16} className="mr-1"/> Back to Collections</Link>
            </Button>
            <h1 className="text-2xl font-bold mb-6">Create New Collection</h1>

            <div className="p-4 md:p-6 border rounded-lg bg-white dark:bg-slate-800 shadow-sm max-w-2xl">
                {/* CollectionForm handles the server action call */}
                <CollectionForm
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}