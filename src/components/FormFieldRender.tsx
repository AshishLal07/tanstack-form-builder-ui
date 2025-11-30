import type { FormField } from '../types';


const FormFieldRenderer: React.FC<{
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
}> = ({ field, value, onChange, onBlur, error }) => {
  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
    }`;

  const labelClasses = 'block text-start text-sm font-medium text-gray-700 mb-1';

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={inputClasses}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'number':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={inputClasses}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'file':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="file"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            className={inputClasses}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );


    case 'textarea':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={4}
            className={inputClasses}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );


    case 'select':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'multiselect':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="border border-gray-300 rounded-lg p-3 space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValue = value || [];
                    if (e.target.checked) {
                      onChange([...currentValue, option]);
                    } else {
                      onChange(currentValue.filter((v: string) => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'date':
      return (
        <div className="mb-4">
          <label className={labelClasses}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={inputClasses}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    case 'checkbox':
    case 'switch':
      return (
        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                checked={value || false}
                onChange={(e) => onChange(!e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition ${value ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                onClick={() => {
                  onChange(!value)
                }}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? 'transform translate-x-5' : ''
                    }`}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    default:
      return null;
  }
};


export default FormFieldRenderer;