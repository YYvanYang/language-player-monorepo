// apps/admin-panel/_components/admin/ResourceForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues, Path, FieldError } from 'react-hook-form';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Input, Textarea, Select, Checkbox, Label } from '@repo/ui'; // Assuming these exist
import { cn } from '@repo/utils';
import { Loader } from 'lucide-react';

// Updated FieldSchema to better align with react-hook-form register options
export interface FieldSchema<T extends FieldValues> {
    name: Path<T>; // Typed field name
    label: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' | 'select' | 'password'; // Added password
    required?: string | boolean; // Use string for custom message
    options?: { value: string | number; label: string }[]; // For select
    placeholder?: string;
    defaultValue?: any;
    // Add specific validation rules supported by RHF register
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    // Add more as needed (validate function, etc.)
}

interface ResourceFormProps<T extends FieldValues> {
    schema: FieldSchema<T>[];
    initialData?: T | null;
    // The Server Action to call on submit
    action: (prevState: any, formData: FormData) => Promise<any>;
    onSuccess?: (data: any) => void; // Callback on successful action
    onError?: (message?: string) => void; // Callback on server action error
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
    const { register, handleSubmit, reset, formState: { errors } } = useForm<T>({
         // RHF requires defaultValues to be set for controlled inputs
         defaultValues: initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any),
         // resolver: zodResolver(yourZodSchema), // Optional: use Zod
    });

    // Use useActionState to handle server action feedback
    const [state, formAction, isPending] = useActionState(action, null);

    // Effect to reset form when initialData changes (e.g., navigating between edit pages)
     useEffect(() => {
         reset(initialData || schema.reduce((acc, field) => {
             acc[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
             return acc;
         }, {} as any));
     }, [initialData, schema, reset]);

    // Handle action result state
    useEffect(() => {
        if (state?.success === true) {
            console.log("Form Action Successful:", state);
            // Optionally show success toast
            if (onSuccess) {
                onSuccess(state); // Pass back result data if action returns it
            }
        } else if (state?.success === false && state?.message) {
             console.error("Form Action Server Error:", state.message);
             // Optionally show error toast
             if (onError) {
                 onError(state.message);
             }
        }
    }, [state, onSuccess, onError]);


    // Function to get RHF register options from schema
     const getRegisterOptions = (field: FieldSchema<T>) => {
         const options: any = {};
         if (field.required) options.required = typeof field.required === 'string' ? field.required : 'This field is required';
         if (field.minLength) options.minLength = field.minLength;
         if (field.maxLength) options.maxLength = field.maxLength;
         if (field.min) options.min = field.min;
         if (field.max) options.max = field.max;
         if (field.pattern) options.pattern = field.pattern;
         if (field.type === 'number') options.valueAsNumber = true;
         return options;
     };

    return (
        <form action={formAction} className="space-y-4">
            {schema.map((field) => {
                const fieldError = errors[field.name] as FieldError | undefined;
                return (
                    <div key={field.name as string}>
                        <Label htmlFor={field.name as string} className={cn(fieldError && "text-red-600")}>
                            {field.label}{field.required ? '*' : ''}
                        </Label>
                        <div className="mt-1"> {/* Add margin-top for spacing */}
                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name as string}
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                />
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center h-10"> {/* Align checkbox vertically */}
                                     <Checkbox
                                        id={field.name as string}
                                        {...register(field.name, getRegisterOptions(field))}
                                        className={cn(fieldError ? 'border-red-500 focus:ring-red-500' : '')}
                                        aria-invalid={fieldError ? "true" : "false"}
                                    />
                                </div>
                            ) : field.type === 'select' ? (
                                <Select
                                    id={field.name as string}
                                    {...register(field.name, getRegisterOptions(field))}
                                    className={cn("mt-1 block w-full", fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                >
                                    {field.placeholder && <option value="">{field.placeholder}</option>}
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </Select>
                            ) : (
                                <Input
                                    id={field.name as string}
                                    type={field.type} // Use HTML input types
                                    {...register(field.name, getRegisterOptions(field))}
                                    placeholder={field.placeholder}
                                    className={cn(fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '')}
                                    aria-invalid={fieldError ? "true" : "false"}
                                />
                            )}
                        </div>
                         {fieldError && (
                            <p className="text-red-600 text-xs mt-1" role="alert">{fieldError.message}</p>
                        )}
                    </div>
                );
            })}

            {/* Display server action error message (not specific to a field) */}
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