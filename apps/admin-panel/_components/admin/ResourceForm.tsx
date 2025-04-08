// apps/admin-panel/_components/admin/ResourceForm.tsx (Conceptual Example)
'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues, Path } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod'; // If using Zod for schema
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, Input, Textarea, Select, Checkbox, Label } from '@repo/ui'; // Assuming these exist

// Define a generic schema structure (adapt as needed)
interface FieldSchema<T extends FieldValues> {
    name: Path<T>; // Typed field name
    label: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'checkbox' | 'select';
    required?: boolean;
    options?: { value: string; label: string }[]; // For select
    // Add validation rules compatible with react-hook-form or zod schema
    validation?: Record<string, any>;
    placeholder?: string;
}

interface ResourceFormProps<T extends FieldValues> {
    schema: FieldSchema<T>[];
    initialData?: T | null;
    // The Server Action to call on submit
    action: (prevState: any, formData: FormData) => Promise<any>;
    onSuccess?: (data: any) => void; // Callback on successful action
    submitButtonText?: string;
}

function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : text}
        </Button>
    );
}

export function ResourceForm<T extends FieldValues>({
    schema,
    initialData,
    action,
    onSuccess,
    submitButtonText = 'Save Changes',
}: ResourceFormProps<T>) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<T>({
         defaultValues: initialData ?? undefined,
         // resolver: zodResolver(yourZodSchema), // Optional: use Zod
    });

    // Use useActionState to handle server action feedback
    const [state, formAction, isPending] = useActionState(action, null);

    // Reset form on successful submission if needed, or call onSuccess callback
    useEffect(() => {
        if (state?.success === true) {
            console.log("Form Action Successful:", state);
            if (onSuccess) {
                onSuccess(state); // Pass back result data if action returns it
            }
            // Optionally reset form - might not be desired for edits
            // if (!initialData) { // Only reset on create?
            //     reset();
            // }
        }
         if (state?.success === false && state?.message) {
             console.error("Form Action Error:", state.message);
             // Display error message (e.g., using a toast notification library or inline)
         }
    }, [state, reset, onSuccess, initialData]);

    // RHF's onSubmit wraps the form data automatically for the action
    // We don't need a separate manual SubmitHandler function here when using form action={}

    return (
        // Use the formAction from useActionState
        <form action={formAction} className="space-y-4">
            {schema.map((field) => (
                <div key={field.name}>
                    <Label htmlFor={field.name}>{field.label}{field.required ? '*' : ''}</Label>
                    {field.type === 'textarea' ? (
                        <Textarea
                            id={field.name}
                            {...register(field.name, { required: field.required, ...field.validation })}
                            placeholder={field.placeholder}
                            className={errors[field.name] ? 'border-red-500' : ''}
                        />
                    ) : field.type === 'checkbox' ? (
                         <Checkbox
                            id={field.name}
                            {...register(field.name, { required: field.required, ...field.validation })}
                            // Default checked state from initialData?
                        />
                    ) : field.type === 'select' ? (
                         <Select
                            id={field.name}
                            {...register(field.name, { required: field.required, ...field.validation })}
                            className={errors[field.name] ? 'border-red-500' : ''}
                         >
                            <option value="">Select {field.label}...</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    ) : (
                        <Input
                            id={field.name}
                            type={field.type} // Use HTML input types
                            {...register(field.name, { required: field.required, ...field.validation })}
                            placeholder={field.placeholder}
                            className={errors[field.name] ? 'border-red-500' : ''}
                        />
                    )}
                    {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">{errors[field.name]?.message?.toString() ?? 'Invalid input'}</p>
                    )}
                </div>
            ))}

            {/* Display server action error message */}
             {state && !state.success && state.message && (
                 <p className="text-red-500 text-sm">{state.message}</p>
             )}

            <SubmitButton text={submitButtonText} />
        </form>
    );
}