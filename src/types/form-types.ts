export interface FormField {
    id: string;
    name?: string;
    type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'file' | 'switch'| string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    order?: number;
    validation?: {
        minLength?: number;
        maxLength?: number;
        regex?: string;
        min?: number;
        max?: number;
        minDate?: string;
        minSelected?: number;
        maxSelected?: number;
    };
}

export interface FormSchema {
    id: string,
    title: string,
    description: string,
    fields: FormField[];
}
