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

    // 使用react-hook-form管理表单状态和验证
    const {
        register,
        control,
        formState: { errors },
        reset,
    } = useForm<CollectionFormData>({
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            type: (initialData?.type as CollectionType) ?? 'PLAYLIST',
        },
    });

    // 定义服务器action函数
    async function serverAction(prevState: any, formData: FormData) {
        try {
            // 服务器端的基本验证
            const title = formData.get('title') as string;
            if (!title?.trim()) {
                return { success: false, message: "Title is required" };
            }
            
            const type = formData.get('type') as CollectionType;
            if (!type || (type !== 'PLAYLIST' && type !== 'COURSE')) {
                return { success: false, message: "Valid collection type is required" };
            }
            
            const description = formData.get('description') as string;
            
            if (isEditing && initialData) {
                // 更新现有集合
                const updateResult = await updateCollectionMetadataAction(initialData.id, {
                    title,
                    description
                });
                
                if (updateResult.success) {
                    // 更新成功，返回更新后的集合
                    return { 
                        success: true, 
                        message: "Collection updated successfully",
                        collection: {
                            ...initialData,
                            title,
                            description,
                            type
                        }
                    };
                } else {
                    return { 
                        success: false, 
                        message: updateResult.message || "Failed to update collection"
                    };
                }
            } else {
                // 创建新集合
                const createResult = await createCollectionAction({
                    title,
                    description,
                    type,
                    initialTrackIds: []
                });
                
                if (createResult.success && createResult.collection) {
                    return { 
                        success: true, 
                        message: "Collection created successfully",
                        collection: createResult.collection
                    };
                } else {
                    return { 
                        success: false, 
                        message: createResult.message || "Failed to create collection"
                    };
                }
            }
        } catch (error) {
            return { 
                success: false, 
                message: error instanceof Error ? error.message : "An unexpected error occurred"
            };
        }
    }

    // 使用useActionState管理服务器action的状态
    const [state, formAction, isPending] = useActionState(serverAction, null);

    // Reset form if initialData changes
    useEffect(() => {
        if (initialData) {
            reset({ 
                title: initialData.title, 
                description: initialData.description ?? '', 
                type: initialData.type 
            });
        } else {
            reset({ 
                title: '', 
                description: '', 
                type: 'PLAYLIST' 
            });
        }
    }, [initialData, reset]);

    // 处理服务器响应
    useEffect(() => {
        if (state?.success) {
            const collection = state.collection;
            if (collection) {
                // 调用成功回调或重定向
                if (onSuccess) {
                    onSuccess(collection);
                } else if (!isEditing) {
                    router.push(`/collections/${collection.id}`);
                }
            }
        }
    }, [state, onSuccess, isEditing, router]);

    return (
        <form action={formAction} className="space-y-4">
            {/* Title Field */}
            <div>
                <Label htmlFor="title" className={cn(errors.title && "text-red-600")}>Title*</Label>
                <Input
                    id="title"
                    {...register('title', { 
                        required: 'Title is required',
                        maxLength: { 
                            value: 255, 
                            message: 'Title cannot exceed 255 characters'
                        } 
                    })}
                    name="title"
                    required
                    className={cn("mt-1", errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.title ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mt-1" role="alert">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description Field */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    name="description"
                    className={cn("mt-1", errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                    aria-invalid={errors.description ? "true" : "false"}
                    disabled={isPending}
                />
                {errors.description && (
                    <p className="text-red-500 text-xs mt-1" role="alert">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Type Field */}
            <div>
                <Label htmlFor="type" className={cn(errors.type && "text-red-600")}>Collection Type*</Label>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Collection type is required' }}
                    render={({ field }) => (
                        <Select
                            id="type"
                            {...field}
                            name="type"
                            required
                            className={cn("mt-1 block w-full", errors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                            aria-invalid={errors.type ? "true" : "false"}
                            disabled={isPending}
                        >
                            <option value="PLAYLIST">Playlist</option>
                            <option value="COURSE">Course</option>
                        </Select>
                    )}
                />
                {errors.type && (
                    <p className="text-red-500 text-xs mt-1" role="alert">
                        {errors.type.message}
                    </p>
                )}
            </div>

            {/* Server Action Feedback */}
            {state && !state.success && state.message && (
                <p className="text-red-600 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded" role="alert">
                    {state.message}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t dark:border-slate-700">
                {onCancel && (
                    <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                )}
                <SubmitButton isEditing={isEditing} />
            </div>
        </form>
    );
}