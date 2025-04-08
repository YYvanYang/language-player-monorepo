'use client';

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import { useActionState } from 'react'; // TODO: Use when actions are available
// import { createCollectionAction, updateCollectionMetadataAction } from '@/actions/collectionActions'; // TODO: Adjust import path
// import { CollectionType } from '@prisma/client'; // TODO: Adjust import path if needed

// TODO: Define actual schema based on backend requirements
const collectionSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  type: z.enum(['PRIVATE', 'PUBLIC']), // TODO: Replace with actual CollectionType enum values if available
  // initialTrackIds: z.array(z.string()).optional(), // TODO: Add if track selection is implemented
});

type CollectionFormInputs = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  collectionId?: string; // Provide if updating an existing collection
  defaultValues?: Partial<CollectionFormInputs>;
  onSubmitSuccess?: () => void;
}

export function CollectionForm({
  collectionId,
  defaultValues,
  onSubmitSuccess,
}: CollectionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CollectionFormInputs>({
    resolver: zodResolver(collectionSchema),
    defaultValues: defaultValues || { type: 'PRIVATE' }, // Default type
  });

  // TODO: Replace with useActionState when actions are implemented
  // const [state, formAction, isPending] = useActionState(
  //   collectionId ? updateCollectionMetadataAction.bind(null, collectionId) : createCollectionAction,
  //   null
  // );

  const onSubmit: SubmitHandler<CollectionFormInputs> = async (data) => {
    console.log('Form data:', data);
    // TODO: Replace with formAction(data) when using useActionState
    try {
      if (collectionId) {
        // await updateCollectionMetadataAction(collectionId, data); // Placeholder
        console.log('Updating collection...', collectionId, data);
      } else {
        // await createCollectionAction(data); // Placeholder
        console.log('Creating collection...', data);
      }
      reset(); // Reset form on successful submission
      onSubmitSuccess?.(); // Call optional success callback
    } catch (error) {
      console.error('Form submission error:', error);
      // TODO: Handle submission error (e.g., display error message from state)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          标题
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="title"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          描述 (可选)
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          类型
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {/* TODO: Populate from CollectionType enum */}
              <option value="PRIVATE">私密</option>
              <option value="PUBLIC">公开</option>
            </select>
          )}
        />
         {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

       {/* TODO: Implement initial track selection UI (e.g., Multi-select dropdown) */}
       {/*
       <div>
         <label htmlFor="initialTracks" className="block text-sm font-medium text-gray-700">
           初始音轨 (可选)
         </label>
         <Controller
           name="initialTrackIds"
           control={control}
           render={({ field }) => (
             // Replace with your track selection component
             <select multiple {...field} id="initialTracks" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
               <option value="track1">Track 1</option>
               <option value="track2">Track 2</option>
             </select>
           )}
         />
       </div>
       */}

      {/* TODO: Display server-side errors from useActionState 'state' */}
      {/* {state?.message && <p className="text-sm text-red-600">{state.message}</p>} */}

      <button
        type="submit"
        disabled={isSubmitting} // Use isPending when using useActionState
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? '提交中...' : (collectionId ? '更新收藏集' : '创建收藏集')}
      </button>
    </form>
  );
} 