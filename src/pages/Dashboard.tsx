
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {  useNavigate } from "react-router-dom"
import { formApi } from "../apis"
import type { FormSchema } from "../types"


interface dashboardForms {
    schema: FormSchema,
    url: string,
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<dashboardForms>({
        schema: {
            id: "",
            title: "",
            description: "",
            fields: [],
        }, url: ""
    })

    const { data: schema, isLoading } = useQuery({
        queryKey: ['formSchema'],
        queryFn: formApi.getForm,
    });

    useEffect(() => {
        if (formData.url) {
            navigate(formData.url, { state: formData.schema });
        }
    }, [formData])

    return (
        <div className=" bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dynamic Form Builder </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate("/forms")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            + New Form
                        </button>

                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading forms...</p>
                ) : !schema?.length ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No forms yet. Create your first form!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {Array.isArray(schema) && schema.map((form) => {
                            return <div key={form.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className=" text-left text-xl font-bold text-gray-900">{form.title}</h2>
                                        <p className="text-gray-600 mt-1">{form.description}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => {
                                                setFormData(({ schema: form, url: `/forms/${form.id}` }));
                                            }}
                                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                        >
                                            Preview Form
                                        </button>
                                        {/* <button
                                            // onClick={() => navigate(`/admin/edit/${form._id}`)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Edit
                                        </button> */}
                                        <button
                                            onClick={() => navigate(`/submissions/${form.id}`)}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                        >
                                            Submissions
                                        </button>

                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                )}
            </main>
        </div>







    )
}

export default Dashboard;