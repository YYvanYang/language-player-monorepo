// apps/user-app/_components/collection/CollectionForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, Label } from '@repo/ui';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO,
    UpdateCollectionRequestDTO,
    CollectionType,
} from '@repo/types';
import {
    createCollectionAction,
    updateCollectionMetadataAction,
} from '@/_actions/collectionActions';
import { cn } from '@repo/utils';
import { Loader } from 'lucide-react';

// Define the shape of the form data handled by react-hook-form
interface CollectionFormData {
    title: string;
    description: string;
    type: CollectionType;
    // initialTrackIds removed - handle track selection separately
}

interface CollectionFormProps {
    initialData?: AudioCollectionResponseDTO | null; // For editing
    // Callback triggered on successful form submission (create or update)
    onSuccess?: (collection: AudioCollectionResponseDTO) => void;
    onCancel?: () => void; // Callback for cancel action
}

// --- Submit Button Component ---
function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[120px]">
            {pending ? (
                <> <Loader className="h-4 w-4 mr-2 animate-spin"/> Saving... </>
            ) : (isEditing ? 'Update Collection' : 'Create Collection')}
        </Button>
    );
}

// --- Main Form Component ---
export function CollectionForm({ initialData, onSuccess, onCancel }: CollectionFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const {
        register,
        handleSubmit, // Use RHF's handleSubmit for client-side validation *before* calling the action programmatically
        reset,
        control, // For Controller component (Select)
        formState: { errors, isDirty }, // Track errors and changes
    } = useForm<CollectionFormData>({
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            type: (initialData?.type as CollectionType) ?? 'PLAYLIST', // Default to PLAYLIST for new
        },
    });

    // Determine the correct server action based on mode
    const actionToCall = isEditing
        ? (data: CollectionFormData) => updateCollectionMetadataAction(initialData!.id, data) // Pass data directly
        : (data: CollectionFormData) => createCollectionAction({ ...data, initialTrackIds: [] }); // Create without tracks

    // State for handling server action feedback
    type ActionState = { success: boolean; message?: string; collection?: AudioCollectionResponseDTO } | null;
    const [state, submitAction, isPending] = useActionState<ActionState, CollectionFormData>(actionToCall, null);

    // Reset form if initialData changes (e.g., navigating between edit pages)
    useEffect(() => {
        if (initialData) {
            reset({ title: initialData.title, description: initialData.description ?? '', type: initialData.type });
        } else {
            reset({ title: '', description: '', type: 'PLAYLIST' });
        }
    }, [initialData, reset]);

    // Handle success/error feedback after server action completes
    useEffect(() => {
        if (state?.success) {
            const collection = state.collection ?? initialData; // Use returned or initial data
            // Show success feedback (e.g., toast)
            alert(isEditing ? "Collection updated successfully!" : "Collection created successfully!"); // Replace with toast
            if (onSuccess && collection) {
                onSuccess(collection); // Call onSuccess callback if provided
            } else if (collection?.id && !isEditing) { // Default redirect on create if no callback
                router.push(`/collections/${collection.id}`);
            }
            // Optionally reset form after successful creation if not redirecting
            // if (!isEditing && !onSuccess) reset();
        } else if (state && !state.success && state.message) {
            // Show server-side error (e.g., toast or inline message)
            console.error("Server Action Error:", state.message);
            // Error message is displayed below the form using `state.message`
        }
    }, [state, isEditing, onSuccess, initialData, router, reset]);

    // RHF's onSubmit handles client validation THEN calls submitAction
    const onSubmit: SubmitHandler<CollectionFormData> = (data) => {
        // Client-side validation passed, now call the server action
        submitAction(data);
    };

    return (
        // Use RHF's handleSubmit to trigger client validation before calling the action
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Title Field */}
            <div>
                <Label htmlFor="title" className={cn(errors.title && "text-red-600")}>Title*</Label>
                <Input
                    id="title"
                    {...register('title', { required: 'Title is required', maxLength: { value: 255, message: 'Title cannot exceed 255 characters'} })}
                    className={cn("mt-1", errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.title ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1" role="alert">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className={cn("mt-1", errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.description ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1" role="alert">{errors.description.message}</p>}
            </div>

            {/* Type Field */}
            <div>
                <Label htmlFor="type" className={cn(errors.type && "text-red-600")}>Collection Type*</Label>
                {/* Use Controller for integrating non-standard inputs like Select with RHF */}
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Collection type is required' }}
                    render={({ field }) => (
                        <Select
                            id="type"
                            {...field} // Spread field props (value, onChange, onBlur)
                            className={cn("mt-1 block w-full", errors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                            aria-invalid={errors.type ? "true" : "false"}
                            disabled={isPending}
                        >
                            <option value="PLAYLIST">Playlist</option>
                            <option value="COURSE">Course</option>
                        </Select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-xs mt-1" role="alert">{errors.type.message}</p>}
            </div>

            {/* Display Server Action Error Message (if not handled by toasts) */}
            {state && !state.success && state.message && (
                <p className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded" role="alert">
                    {state.message}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t dark:border-slate-700">
                 {/* Allow Cancel button only if callback provided */}
                 {onCancel && (
                     <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
                         Cancel
                     </Button>
                 )}
                {/* SubmitButton uses useFormStatus which is tied to the <form> */}
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    );
}