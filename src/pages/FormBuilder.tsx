import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type { FormSchema, FormField } from "../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { formApi } from "../apis"


const FormBuilder: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormSchema>({
        id: crypto.randomUUID(),
        title: "",
        description: "",
        fields: [],
    })

    const queryClient = useQueryClient();

    const [currentField, setCurrentField] = useState<Partial<FormField>>({})
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    // const [loading, setLoading] = useState(!!id)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

   

    const addField = () => {
        if (!currentField.name || !currentField.label || !currentField.type) {
            alert("Fill all field details")
            return
        }

        const newField: FormField = {
            id: (formData.fields.length + 1).toString(),
            name: currentField.name as string,
            label: currentField.label as string,
            type: currentField.type,
            required: currentField.required || false,
            order: editingIndex !== null ? editingIndex : formData.fields.length,
            options: currentField.options,
            validation: currentField.validation,
        }

        if (editingIndex !== null) {
            const updated = [...formData.fields]
            updated[editingIndex] = newField
            setFormData({ ...formData, fields: updated })
            setEditingIndex(null)
        } else {
            setFormData({
                ...formData,
                fields: [...formData.fields, newField].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            })
        }

        setCurrentField({})
    }

    const removeField = (index: number) => {
        setFormData({
            ...formData,
            fields: formData.fields.filter((_, i) => i !== index),
        })
    }

    const editField = (index: number) => {
        setCurrentField(formData.fields[index])
        setEditingIndex(index)
    }

    const mutation = useMutation({
        mutationFn: formApi.submitForm,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });



    const handleSave = async () => {
        if (!formData.title || !formData.description || formData.fields.length === 0) {
            alert("Fill form title, description, and add at least one field")
            return
        }

        try {
            mutation.mutate(formData);
            navigate("/")
        } catch (error) {
            alert("Failed to save form")
        }
    }

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null)
            return
        }

        const newFields = [...formData.fields]
        const draggedField = newFields[draggedIndex]
        newFields.splice(draggedIndex, 1)
        newFields.splice(targetIndex, 0, draggedField)

        newFields.forEach((field, idx) => {
            field.order = idx
        })

        setFormData({ ...formData, fields: newFields })
        setDraggedIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }


    // if (loading) return <p className="text-center p-4">Loading...</p>

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold mb-6">{id ? "Edit Form" : "Create New Form"}</h1>

                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">Form Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter form title"
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter form description"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Add Field</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Field Name</label>
                                <input
                                    type="text"
                                    value={currentField.name || ""}
                                    onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="unique_field_name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Field Label</label>
                                <input
                                    type="text"
                                    value={currentField.label || ""}
                                    onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="User-friendly label"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Field Type</label>
                                <select
                                    value={currentField.type || ""}
                                    onChange={(e) => setCurrentField({ ...currentField, type: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="">Select type</option>
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="number">Number</option>
                                    <option value="email">Email</option>
                                    <option value="date">Date</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="select">Select</option>
                                    <option value="switch">Switch</option>

                                    {/* <option value="select">multiSelect</option> */}

                                    <option value="file">File</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium mt-6">
                                    <input
                                        type="checkbox"
                                        checked={currentField.required || false}
                                        onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Required
                                </label>
                            </div>
                        </div>
                        {(currentField.type === "text" || currentField.type === "textarea" || currentField.type === "number") && (

                            <div className="grid grid-cols-2 gap-5 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum</label>
                                    <input
                                        type="number"
                                        value={currentField.validation?.min}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, validation: { ...currentField.validation, min: parseInt(e.target.value) ?? 0 } })
                                        }
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Maxmimum</label>
                                    <input
                                        type="number"
                                        value={currentField.validation?.max}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, validation: { ...currentField.validation, max: parseInt(e.target.value) ?? 0 } })
                                        }
                                        className="w-full px-3 py-2 border rounded"
                                        placeholder="50"
                                    />
                                </div>

                            </div>
                        )}
                        {(currentField.type === "email") && (

                            <div className="mb-6 w-1/2">
                                <label className="block text-sm font-medium mb-1">Regex</label>
                                <input
                                    type="text"
                                    value={currentField.validation?.regex}
                                    onChange={(e) =>
                                        setCurrentField({ ...currentField, validation: { ...currentField.validation, regex: e.target.value } })
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="a-zA-Z"
                                />
                            </div>
                        )}


                        {(currentField.type === "radio" || currentField.type === "select" || currentField.type === "checkbox") && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Options (comma-separated)</label>
                                <input
                                    type="text"
                                    value={currentField.options?.join(", ") || ""}
                                    onChange={(e) =>
                                        setCurrentField({ ...currentField, options: e.target.value.split(",").map((o) => o.trim()) })
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                    placeholder="Option 1, Option 2, Option 3"
                                />
                            </div>
                        )}

                        <button onClick={addField} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            {editingIndex !== null ? "Update Field" : "Add Field"}
                        </button>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-4">Fields ({formData.fields.length})</h2>
                        <p className="text-sm text-gray-600 mb-3">Drag and drop fields to reorder them</p>
                        {formData.fields.length === 0 ? (
                            <p className="text-gray-500">No fields added yet</p>
                        ) : (
                            <div className="space-y-2">
                                {formData.fields.map((field, index) => (
                                    <div
                                        key={index}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex justify-between items-center p-3 bg-gray-50 rounded border cursor-move transition-all ${draggedIndex === index
                                            ? "opacity-50 border-indigo-600 bg-indigo-50"
                                            : "border-gray-300 hover:border-indigo-400"
                                            }`}
                                    >
                                        <div className="flex items-center flex-1">
                                            <div className="text-gray-400 mr-3 text-lg">⋮⋮</div>
                                            <div>
                                                <p className="text-left font-medium">{field.label}</p>
                                                <p className="text-sm text-gray-600">
                                                    Type: {field.type} {field.required ? "(Required)" : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => editField(index)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => removeField(index)}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
                        >
                            {id ? "Update Form" : "Create Form"}
                        </button>
                        <button
                            onClick={() => navigate("/admin")}
                            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormBuilder;