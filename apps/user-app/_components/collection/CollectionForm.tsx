// apps/user-app/_components/collection/CollectionForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation'; // To redirect after creation

import { Button, Input, Textarea, Select, Label } from '@repo/ui'; // Adjust path if needed
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    CollectionType,
} from '@repo/types';
import {
    createCollectionAction,
    updateCollectionMetadataAction,
} from '@/../_actions/collectionActions'; // Adjust alias
import { cn } from '@repo/utils'; // Adjust alias

// Define the shape of the form data
interface CollectionFormData {
    title: string;
    description: string;
    type: CollectionType;
    // initialTrackIds: string[]; // We'll handle track selection separately for simplicity now
}

interface CollectionFormProps {
    initialData?: AudioCollectionResponseDTO | null; // Provide for editing
    onSuccess?: (collectionId: string) => void; // Optional callback after success
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : (isEditing ? 'Update Collection' : 'Create Collection')}
        </Button>
    );
}

export function CollectionForm({ initialData, onSuccess }: CollectionFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    // --- React Hook Form Setup ---
    const {
        register,
        handleSubmit,
        reset,
        control, // Needed for <Select> if it's a custom component
        formState: { errors, isDirty }, // isDirty useful for enabling submit button
    } = useForm<CollectionFormData>({
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            type: initialData?.type ?? 'PLAYLIST', // Default to PLAYLIST for new
            // initialTrackIds: [],
        },
    });

    // --- Server Action State ---
    const actionToCall = isEditing
        ? updateCollectionMetadataAction.bind(null, initialData!.id) // Bind collectionId for update
        : createCollectionAction;

    // Define action result type expected from server actions
    type FormActionState = {
        success: boolean;
        message?: string;
        collection?: AudioCollectionResponseDTO; // create action returns this
    } | null;

    const [state, formAction, isPending] = useActionState<FormActionState, FormData>(actionToCall, null);

    // --- Effects ---
    // Reset form if initialData changes (e.g., navigating between edit pages)
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description ?? '',
                type: initialData.type,
            });
        } else {
            reset({ title: '', description: '', type: 'PLAYLIST' }); // Reset for create form
        }
    }, [initialData, reset]);

    // Handle success feedback/redirect
    useEffect(() => {
        if (state?.success) {
            const collectionId = state.collection?.id ?? initialData?.id;
            if (onSuccess && collectionId) {
                onSuccess(collectionId); // Call callback if provided
            } else if (collectionId && !isEditing) {
                // Redirect to the newly created collection page
                router.push(`/collections/${collectionId}`);
            }
            // Maybe show a success toast notification here
        }
        // Error messages are displayed below the form
    }, [state, isEditing, onSuccess, initialData?.id, router]);

    // --- Render Logic ---
    return (
        // Use the formAction provided by useActionState
        <form action={formAction} className="space-y-5 p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Collection' : 'Create New Collection'}
            </h2>

            {/* Title Field */}
            <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className={cn(errors.title ? 'border-red-500' : '')}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className={cn(errors.description ? 'border-red-500' : '')}
                />
                {/* No validation error shown for optional field unless specific rules added */}
            </div>

            {/* Type Field */}
            <div>
                <Label htmlFor="type">Collection Type*</Label>
                 {/* Using Controller for potentially custom Select component integration */}
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Collection type is required' }}
                    render={({ field }) => (
                         <Select
                            id="type"
                            {...field} // Spread field props (value, onChange, onBlur)
                            className={cn(errors.type ? 'border-red-500' : '')}
                         >
                            <option value="PLAYLIST">Playlist</option>
                            <option value="COURSE">Course</option>
                        </Select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>

            {/* --- Optional: Initial Track Selection (Stubbed) --- */}
            {/*
            !isEditing && (
                <div>
                    <Label htmlFor="initialTracks">Add Initial Tracks (Optional)</Label>
                    {/* Implement a multi-select component here (e.g., using react-select or Shadcn Combobox) *}
                    {/* This component would fetch available tracks and allow selection *}
                    {/* For now, it's omitted, tracks are managed on the detail page *}
                    <p className="text-xs text-gray-500 mt-1">You can add tracks after creating the collection.</p>
                </div>
            )
            */}
            {/* --- End Track Selection --- */}

            {/* Display Server Action Error */}
            {state && !state.success && state.message && (
                <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded">
                    {state.message}
                </p>
            )}

            <div className="flex justify-end">
                <SubmitButton isEditing={isEditing} />
                {/* Maybe add a Cancel button */}
            </div>
        </form>
    );
}