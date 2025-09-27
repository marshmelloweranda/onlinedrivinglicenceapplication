import React from 'react';

const CheckboxCard = ({ id, label, description, data, onChange }) => (
    <label htmlFor={id} className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all duration-200 ${data[id] ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}>
        <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-600">{label}</span>
            <input id={id} name={id} type="checkbox" checked={data[id] || false} onChange={onChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        </div>
        <div className="mt-2 text-sm text-gray-600">{description}</div>
    </label>
);

export default CheckboxCard;