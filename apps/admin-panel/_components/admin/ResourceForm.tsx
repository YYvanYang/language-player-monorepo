// apps/admin-panel/_components/admin/ResourceForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues, Path, FieldError, Controller } from 'react-hook-form'; // Import Controller
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Input, Textarea, Select, Checkbox, Label } from '@repo/ui';
import { cn } from '@repo/utils';
import { Loader } from 'lucide-react';

export interface FieldSchema<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' | 'select' | 'password';
    required?: string | boolean;
    options?: { value: string | number | boolean; label: string }[]; // Options for select (value can be boolean)
    placeholder?: string;
    defaultValue?: any;
    // Add RHF validation options directly
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number | string; message: string }; // Can be number or string date
    max?: { value: number | string; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string | Promise<boolean | string>; // Custom validation
    disabled?: boolean; // Allow disabling specific fields
}

interface ResourceFormProps<T extends FieldValues> {
    schema: FieldSchema<T>[];
    initialData?: T | null;
    // Action now takes FormData, not the typed object
    action: (prevState: any, formData: FormData) => Promise<any>;
    onSuccess?: (data: any) => void;
    onError?: (message?: string) => void;
    submitButtonText?: string;
}

function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="min-w-[100px]">
             {pending ? <Loader className="h-4 w-4 mr-2 animate-spin"/> : null}
            {pending ? 'Saving...' : text}
        </Button>
    );
}

export function ResourceForm<T extends FieldValues>({
    schema,
    initialData,
    action,
    onSuccess,
    onError,
    submitButtonText = 'Save Changes',
}: ResourceFormProps<T>) {
    const { register, handleSubmit, reset, formState: { errors, isDirty }, control } = useForm<T>({ // Add control
         // defaultValues need careful initialization, especially for checkboxes
         defaultValues: initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any),
    });

    // Action state remains the same
    const [state, formAction, isPending] = useActionState(action, null);

    // Effect to reset form - should correctly reset checkboxes now
     useEffect(() => {
         reset(initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any));
     }, [initialData, schema, reset]);

    // Handle action result state (remains the same)
    useEffect(() => {
        if (state?.success === true) {
            console.log("Form Action Successful:", state);
            if (onSuccess) onSuccess(state);
        } else if (state?.success === false && state?.message) {
             console.error("Form Action Server Error:", state.message);
             if (onError) onError(state.message);
        }
    }, [state, onSuccess, onError]);

    // RHF validation happens client-side before the action is called.
    // We don't need a separate client-side submit handler unless we
    // want to do complex pre-processing *before* creating FormData.
    // The <form action={formAction}> will handle creating FormData
    // and passing it to the server action.

    // Helper to get register options (remains the same)
    const getRegisterOptions = (field: FieldSchema<T>) => {
         const options: any = {};
         if (field.required) options.required = typeof field.required === 'string' ? field.required : 'This field is required';
         if (field.minLength) options.minLength = field.minLength;
         if (field.maxLength) options.maxLength = field.maxLength;
         if (field.min) options.min = field.min;
         if (field.max) options.max = field.max;
         if (field.pattern) options.pattern = field.pattern;
         if (field.type === 'number') options.valueAsNumber = true;
         if (field.validate) options.validate = field.validate;
         return options;
     };

    return (
        // Use the formAction directly. handleSubmit is NOT needed here
        // as the browser handles FormData creation for Server Actions.
        // RHF is primarily for client-side validation feedback in this case.
        <form action={formAction} className="space-y-4">
            {schema.map((field) => {
                const fieldError = errors[field.name] as FieldError | undefined;
                return (
                    <div key={field.name as string}>
                        <Label htmlFor={field.name as string} className={cn(fieldError && "text-red-600")}>
                            {field.label}{field.required ? '*' : ''}
                        </Label>
                        <div className="mt-1">
                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name as string}
                                    // Use RHF register for validation binding only
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                    defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''} // Set default value for server action
                                    disabled={field.disabled || isPending} // Disable field if needed or pending
                                />
                            ) : field.type === 'checkbox' ? (
                                // IMPORTANT: Checkboxes need careful handling with FormData
                                // We need a hidden input to submit 'off' if unchecked.
                                // Or, handle boolean conversion in the Server Action based on presence.
                                // Using Controller provides better integration.
                                <Controller
                                    name={field.name}
                                    control={control}
                                    rules={getRegisterOptions(field)}
                                    render={({ field: controllerField }) => (
                                        <div className="flex items-center h-10">
                                             {/* Hidden input might not be needed with Controller */}
                                             <Checkbox
                                                 id={field.name as string}
                                                 checked={controllerField.value}
                                                 onCheckedChange={controllerField.onChange}
                                                 onBlur={controllerField.onBlur}
                                                 name={controllerField.name} // Ensure name is passed
                                                 ref={controllerField.ref}
                                                 className={cn(fieldError ? 'border-red-500 focus:ring-red-500' : '')}
                                                 aria-invalid={fieldError ? "true" : "false"}
                                                 disabled={field.disabled || isPending}
                                             />
                                         </div>
                                    )}
                                />
                            ) : field.type === 'select' ? (
                                <Select
                                    id={field.name as string}
                                    {...register(field.name, getRegisterOptions(field))}
                                    className={cn("mt-1 block w-full", fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                     defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''}
                                     disabled={field.disabled || isPending}
                                >
                                    {field.placeholder && <option value="">{field.placeholder}</option>}
                                    {field.options?.map(opt => (
                                        <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option> // Ensure value is string for select
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    id={field.name as string}
                                    type={field.type}
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                     defaultValue={initialData?.[field.name] ?? field.defaultValue ?? ''}
                                     disabled={field.disabled || isPending}
                                />
                            )}
                        </div>
                         {fieldError && (
                            <p className="text-red-600 text-xs mt-1" role="alert">{fieldError.message}</p>
                        )}
                    </div>
                );
            })}

            {state && !state.success && state.message && (
                 <p className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded" role="alert">
                     {state.message}
                 </p>
             )}

            <div className="pt-4">
                <SubmitButton text={submitButtonText} />
            </div>
        </form>
    );
}