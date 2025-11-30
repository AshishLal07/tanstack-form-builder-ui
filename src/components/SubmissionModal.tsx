import type { Submission } from "../types";

const SubmissionModal: React.FC<{
    submission: Submission;
    onClose: () => void;
}> = ({ submission, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Submission Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Submission ID:</span> {submission.id}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Created:</span>{' '}
                            {new Date(submission.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-100 pb-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">{key}</p>
                                <p className="text-sm text-gray-900">
                                    {Array.isArray(value) ? value.join(', ') :
                                        typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                            String(value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;

