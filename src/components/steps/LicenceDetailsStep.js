import React, { useState, useEffect } from 'react';
import axios from "axios";
import Icon, { ICONS } from '../Icon';
import CheckboxCard from '../CheckboxCard';

const LicenceDetailsStep = ({ data, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://dmt.digieconcenter.gov.lk/user/api/licence-categories');
                setCategories(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch licence categories:", err);
                setError(err.response?.data?.error || "Could not load licence options. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Create a data object for CheckboxCard where keys are category IDs and values are booleans
    const checkboxData = {};
    categories.forEach(category => {
        checkboxData[category.id] = data.selectedCategories?.includes(category.id) || false;
    });

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        
        const updatedCategories = checked
            ? [...(data.selectedCategories || []), id]
            : (data.selectedCategories || []).filter(catId => catId !== id);

        onChange({
            ...data,
            selectedCategories: updatedCategories
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 space-x-2 text-gray-600">
                <Icon path={ICONS.spinner} className="animate-spin w-6 h-6" />
                <span>Loading Licence Categories...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="bg-red-50 p-4 rounded-lg text-red-800 max-w-md mx-auto">
                    <p className="font-semibold">Error Loading Categories</p>
                    <p className="text-sm mt-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Licence Category</h3>
            <p className="text-sm text-gray-500 mb-4">Select the class of vehicles you wish to be licensed for.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                    <CheckboxCard
                        key={category.id}
                        id={category.id}
                        label={category.label}
                        description={category.description}
                        data={checkboxData}
                        onChange={handleCheckboxChange}
                    />
                ))}
            </div>
            
            {data.selectedCategories && data.selectedCategories.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">
                        Selected {data.selectedCategories.length} categor{data.selectedCategories.length === 1 ? 'y' : 'ies'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LicenceDetailsStep;