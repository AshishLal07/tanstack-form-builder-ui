import type { FormSchema, PaginatedSubmissions } from "../types";
import baseApi from "./api";

const formApi = {
    getFormSchema: async (): Promise<FormSchema> => {
        const response = await baseApi.get(`/forms/:id`);

        if (response.status !== 200) throw new Error('Failed to fetch form schema');
        return response.data;
    },
    getForm: async (): Promise<FormSchema[]> => {
        const response = await baseApi.get(`/forms`);
        if (response.status !== 200) throw new Error('Failed to fetch form schema');
        const formsData = response.data.data;

        const result = Object.keys(formsData).map((key) => { return formsData[key] })

        return result;
        return [];
    },
    submitForm: async (data: Record<string, any>) => {
        const reqBody = {
             title: data.title,
            description: data.description,
            fields: data.fields
        }        
        const response = await baseApi.post(`/forms`,reqBody);

        if (response.status == 200) throw new Error('Failed to submit form');
        return response.data;
    },

    submitSubmission: async (data: Record<string, any>) => {
        const response = await baseApi.post(`/submissions`, data);

        if (response.status == 200) throw new Error('Failed to submit form');
        return response.data;
    },

    getSubmissions: async (formId: string, page: number, limit: number, sortBy: string, sortOrder: string): Promise<PaginatedSubmissions> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            formId,
            sortBy,
            sortOrder,
        });
        const response = await baseApi.get(`/submissions?${params}`);
        if (response.status == 200) throw new Error('Failed to fetch submissions');
        return response.data.data;
    },
};


export default formApi;