import React from 'react';

const FormInput = ({ label, name, value, onChange, placeholder, type = "text", readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input 
            type={type} 
            name={name} 
            id={name} 
            value={value || ''} 
            onChange={onChange} 
            readOnly={readOnly} 
            className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
            placeholder={placeholder} 
        />
    </div>
);

export default FormInput;