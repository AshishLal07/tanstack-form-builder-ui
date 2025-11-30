import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {  useState } from "react";
import { formApi } from '../apis'
import { useForm } from "@tanstack/react-form";
import { FormFieldRenderer } from "../components";
import { validateField } from "../utils";
import type { FormField } from '../types'

const DynamicForm: React.FC = () => {
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();


    const schema = location.state;
    

    const mutation = useMutation({
        mutationFn: formApi.submitSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            setMessage({ type: 'success', text: 'Form submitted successfully!' });

        },
        onError: (error: Error) => {
            setMessage({ type: 'error', text: error.message || 'Failed to submit form' });
        },
    });

    const form = useForm({
        defaultValues: {...schema},
        onSubmit: async ({ value }) => {
            setMessage(null);
            mutation.mutate({ formId: id, data: value });
            form.reset();
            setTimeout(() => {
                navigate('/')
            }, 1000)
        },
    });


    if (mutation.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Error loading form: {(mutation.error as Error).message}
            </div>
        );
    }

    if (!schema) return null;

    const handleSubmit = () => {
        form.handleSubmit();
    };

   


    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <header className="flex items-center mb-6 ">

                <h2 className="flex-1 text-2xl font-bold text-gray-800 ">{schema.title}</h2>
                <button
                    onClick={() => {
                        navigate(-1)
                    }}
                    type="button"
                    className="bg-red-400 text-white h-fit py-2 px-2 rounded text-sm hover:bg-red-500"
                >
                    Dashboard
                </button>
            </header>

            {message && (
                <div
                    className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                {schema.fields.map((field: FormField) => {

                    return <form.Field
                        key={field.id}
                        name={field.name || ""}
                        validators={{
                            onChange: ({ value }) => validateField(value, field),
                            onBlur: ({ value }) => validateField(value, field),
                        }}
                    >
                        {(fieldApi) => (
                            <FormFieldRenderer
                                field={field}
                                value={fieldApi.state.value}
                                onChange={fieldApi.handleChange}
                                onBlur={fieldApi.handleBlur}
                                error={fieldApi.state.meta.errors?.[0]}
                            />
                        )}
                    </form.Field>
                })}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className={`w-1/3 py-3 px-4 mt-5 rounded-lg font-medium text-white transition ${mutation.isPending
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        }`}
                >
                    {mutation.isPending ? (
                        <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                        </span>
                    ) : (
                        'Submit Form'
                    )}
                </button>
            </div>
        </div>
    );
};



export default DynamicForm;