// apps/user-app/_components/collection/CollectionForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, Label } from '@repo/ui';
import type {
    AudioCollectionResponseDTO,
    CreateCollectionRequestDTO, // This includes initialTrackIds now
    UpdateCollectionRequestDTO,
    CollectionType,
} from '@repo/types';
import {
    createCollectionAction,
    updateCollectionMetadataAction,
} from '@/_actions/collectionActions'; // Adjust alias
import { cn } from '@repo/utils';
// Remove CollectionTrackSelector import for now, handle tracks separately

interface CollectionFormData {
    title: string;
    description: string;
    type: CollectionType;
    // initialTrackIds are handled outside this basic form for simplicity
}

interface CollectionFormProps {
    initialData?: AudioCollectionResponseDTO | null;
    onSuccessRedirect?: (collectionId: string) => void; // More flexible redirect/callback
}

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

export function CollectionForm({ initialData, onSuccessRedirect }: CollectionFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CollectionFormData>({
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            type: (initialData?.type as CollectionType) ?? 'PLAYLIST',
        },
    });

    // Determine the action based on edit mode
    const actionToCall = isEditing
        ? updateCollectionMetadataAction.bind(null, initialData!.id)
        : createCollectionAction;

    // Prepare the form action using useActionState
    type FormActionState = { success: boolean; message?: string; collection?: AudioCollectionResponseDTO } | null;
    const [state, formAction, isPending] = useActionState<FormActionState, FormData>(actionToCall, null);

    // Reset form if initialData changes
    useEffect(() => {
        if (initialData) {
            reset({ title: initialData.title, description: initialData.description ?? '', type: initialData.type });
        } else {
            reset({ title: '', description: '', type: 'PLAYLIST' });
        }
    }, [initialData, reset]);

    // Handle success feedback/redirect
    useEffect(() => {
        if (state?.success) {
            const collectionId = state.collection?.id ?? initialData?.id;
            if (onSuccessRedirect && collectionId) {
                onSuccessRedirect(collectionId); // Use callback if provided
            } else if (collectionId && !isEditing) {
                router.push(`/collections/${collectionId}`); // Default redirect on create
            } else if (isEditing) {
                // Optionally show success message for edits without redirect
                alert("Collection updated successfully!"); // Replace with toast
            }
            // Reset form on successful creation? Only if not redirecting immediately.
            // if (!isEditing && !onSuccessRedirect) reset();
        }
        // Error messages are displayed below the form
    }, [state, isEditing, onSuccessRedirect, initialData?.id, router, reset]);

    // RHF's handleSubmit isn't used directly when passing action to <form>
    // const onSubmit: SubmitHandler<CollectionFormData> = data => {
    //     // Manual action call if not using form action={}
    // };

    return (
        // Use formAction from useActionState
        <form action={formAction} className="space-y-4">

            {/* Title Field */}
            <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                    id="title"
                    {...register('title', { required: 'Title is required', maxLength: { value: 255, message: 'Title too long'} })}
                    className={cn(errors.title ? 'border-red-500' : '')}
                    aria-invalid={errors.title ? "true" : "false"}
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
                    className={cn(errors.description ? 'border-red-500' : '')}
                     aria-invalid={errors.description ? "true" : "false"}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1" role="alert">{errors.description.message}</p>}
            </div>

            {/* Type Field */}
            <div>
                <Label htmlFor="type">Collection Type*</Label>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Collection type is required' }}
                    render={({ field }) => (
                        <Select
                            id="type"
                            {...field}
                            className={cn("mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50", errors.type ? 'border-red-500' : '')}
                            aria-invalid={errors.type ? "true" : "false"}
                        >
                            <option value="PLAYLIST">Playlist</option>
                            <option value="COURSE">Course</option>
                        </Select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-xs mt-1" role="alert">{errors.type.message}</p>}
            </div>

            {/* Display Server Action Error */}
            {state && !state.success && state.message && (
                <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded" role="alert">
                    {state.message}
                </p>
            )}

            <div className="flex justify-end pt-2">
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    );
}