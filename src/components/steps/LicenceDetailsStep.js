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
                const response = await axios.get('http://localhost:8888/api/licence-categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch licence categories:", err);
                setError("Could not load licence options. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 space-x-2 text-gray-600">
                <Icon path={ICONS.spinner} className="animate-spin w-6 h-6" />
                <span>Loading Licence Categories...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{error}</div>;
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
                        data={data}
                        onChange={onChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default LicenceDetailsStep;