import React, { useState } from 'react';
import axios from "axios";
import Icon, { ICONS } from '../Icon';

const MedicalCertificateStep = ({ data, setData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(!!data.certificateId);
    const [error, setError] = useState(null);

    const handleFetchMedical = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const endpoint = `http://localhost:8888/api/medical-certificate`;
            const requestBody = { sub: data.sub };
            const response = await axios.post(endpoint, requestBody, {
                headers: { "Content-Type": "application/json" }
            });
            const medicalData = response.data;
            setData(prev => ({ ...prev, ...medicalData }));
            setIsFetched(true);
        } catch (err) {
            console.error("Failed to fetch medical certificate:", err);
            setError("Could not fetch the medical certificate. Please try again later.");
            setIsFetched(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-center p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fetch Medical Certificate</h3>
            <p className="text-sm text-gray-500 mb-6">Click the button below to fetch your latest medical certificate from the national health database.</p>

            {!isFetched && !isLoading && (
                <button onClick={handleFetchMedical} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Fetch Certificate
                </button>
            )}

            {isLoading && (
                <div className="flex justify-center items-center space-x-2 text-gray-600">
                    <Icon path={ICONS.spinner} className="animate-spin w-6 h-6" />
                    <span>Fetching data...</span>
                </div>
            )}

            {isFetched && !error && (
                <div className="bg-green-50 p-4 rounded-lg text-green-800">
                    <p className="font-semibold">Medical Certificate Fetched Successfully!</p>
                    <p className="text-sm">Status: {data.remarks} (Issued: {data.issuedDate})</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 p-4 rounded-lg text-red-800">
                    <p className="font-semibold">Fetch Failed</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default MedicalCertificateStep;