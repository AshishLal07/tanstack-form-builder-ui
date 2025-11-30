import { useState } from "react";
import type { Submission } from "../types";
import { useQuery } from "@tanstack/react-query";
import { formApi } from "../apis";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SubmissionModal } from "../components";
import { useNavigate, useParams } from "react-router-dom";

const SubmissionsTable: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['submissions', page, limit, sortOrder],
        queryFn: () => formApi.getSubmissions(id || "", page, limit, 'created_at', sortOrder),
    });


    const columnHelper = createColumnHelper<Submission>();

    const columns = [
        columnHelper.accessor('id', {
            header: 'Submission ID',
            cell: (info) => (
                <span className="font-mono text-sm text-gray-700">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor('createdAt', {
            header: () => (
                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-1 hover:text-blue-600 transition"
                >
                    <span>Created Date</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            ),
            cell: (info) => (
                <span className="text-sm text-gray-700">
                    {new Date(info.getValue()).toLocaleString()}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => (
                <button
                    onClick={() => setSelectedSubmission(info.row.original)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                    View
                </button>
            ),
        }),
    ];

    const table = useReactTable({
        data: data?.submissions || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                Error loading submissions: {(error as Error).message}
            </div>
        );
    }

    if (!data || data.submissions.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">No submissions found</p>
            </div>
        );
    }

    const { pagination } = data;

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <header className="flex items-center mb-6">
                    <h2 className="flex-1 text-2xl font-bold text-gray-800">Submissions</h2>
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
                <p className="text-sm text-gray-600 mt-1">
                    Total: {pagination.totalCount} submissions
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <label className="text-sm text-gray-700">
                        Items per page:
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </label>
                    <span className="text-sm text-gray-700">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === pagination.totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedSubmission && (
                <SubmissionModal
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                />
            )}
        </div>
    );
};

export default SubmissionsTable;