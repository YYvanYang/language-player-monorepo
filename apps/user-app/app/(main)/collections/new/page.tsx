// apps/user-app/app/(main)/collections/new/page.tsx
import React from 'react';
import { CollectionForm } from '@/../_components/collection/CollectionForm'; // Adjust alias

export default function CreateCollectionPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Create New Collection</h1>
            <CollectionForm />
        </div>
    );
}