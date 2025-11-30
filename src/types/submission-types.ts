


export interface Submission {
    id: string;
    createdAt: string;
    data: Record<string, any>;
}

export interface PaginatedSubmissions {
    submissions: Submission[];
    pagination: {
        page: number;
        totalPages: number;
        totalCount: number;
        limit: number;
    };

}
