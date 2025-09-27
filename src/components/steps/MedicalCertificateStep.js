import React, { useState, useEffect } from 'react';
import axios from "axios";
import Icon, { ICONS } from '../Icon';

const MedicalCertificateStep = ({ data, setData }) => {
    const [isLoading, setIsLoading] = useState({
        medical: false,
        written: false,
        practical: false
    });
    const [isFetched, setIsFetched] = useState({
        medical: !!data.certificateId,
        written: !!data.writtenTest,
        practical: !!data.practicalTest
    });
    const [error, setError] = useState({
        medical: null,
        written: null,
        practical: null
    });

    // Auto-fetch all data when component mounts
    useEffect(() => {
        fetchMedicalCertificate();
        fetchWrittenTest();
        fetchPracticalTest();
    }, []);

    const fetchMedicalCertificate = async () => {
        setIsLoading(prev => ({ ...prev, medical: true }));
        setError(prev => ({ ...prev, medical: null }));
        try {
            const endpoint = `http://localhost:8888/api/medical-certificate`;
            const requestBody = { sub: data.sub };
            const response = await axios.post(endpoint, requestBody, {
                headers: { "Content-Type": "application/json" }
            });
            const medicalData = response.data;
            setData(prev => ({ ...prev, ...medicalData }));
            setIsFetched(prev => ({ ...prev, medical: true }));
        } catch (err) {
            console.error("Failed to fetch medical certificate:", err);
            setError(prev => ({ ...prev, medical: "Could not fetch the medical certificate. Please try again later." }));
        } finally {
            setIsLoading(prev => ({ ...prev, medical: false }));
        }
    };

    const fetchWrittenTest = async () => {
        setIsLoading(prev => ({ ...prev, written: true }));
        setError(prev => ({ ...prev, written: null }));
        try {
            const endpoint = `http://localhost:8888/api/written-test`;
            const requestBody = { sub: data.sub };
            const response = await axios.post(endpoint, requestBody, {
                headers: { "Content-Type": "application/json" }
            });
            const writtenTestData = response.data;
            setData(prev => ({ 
                ...prev, 
                writtenTest: writtenTestData 
            }));
            setIsFetched(prev => ({ ...prev, written: true }));
        } catch (err) {
            console.error("Failed to fetch written test results:", err);
            setError(prev => ({ ...prev, written: "Could not fetch written test results. Please try again later." }));
        } finally {
            setIsLoading(prev => ({ ...prev, written: false }));
        }
    };

    const fetchPracticalTest = async () => {
        setIsLoading(prev => ({ ...prev, practical: true }));
        setError(prev => ({ ...prev, practical: null }));
        try {
            const endpoint = `http://localhost:8888/api/practical-test`;
            const requestBody = { sub: data.sub };
            const response = await axios.post(endpoint, requestBody, {
                headers: { "Content-Type": "application/json" }
            });
            const practicalTestData = response.data;
            setData(prev => ({ 
                ...prev, 
                practicalTest: practicalTestData 
            }));
            setIsFetched(prev => ({ ...prev, practical: true }));
        } catch (err) {
            console.error("Failed to fetch practical test results:", err);
            setError(prev => ({ ...prev, practical: "Could not fetch practical test results. Please try again later." }));
        } finally {
            setIsLoading(prev => ({ ...prev, practical: false }));
        }
    };

    const retryFetch = (type) => {
        switch (type) {
            case 'medical':
                fetchMedicalCertificate();
                break;
            case 'written':
                fetchWrittenTest();
                break;
            case 'practical':
                fetchPracticalTest();
                break;
            default:
                break;
        }
    };

    const renderStatus = (type, label) => {
        const loading = isLoading[type];
        const fetched = isFetched[type];
        const errorMsg = error[type];
        const testData = type === 'written' ? data.writtenTest : 
                        type === 'practical' ? data.practicalTest : data;

        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                    {errorMsg && (
                        <button 
                            onClick={() => retryFetch(type)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                            Retry
                        </button>
                    )}
                </div>

                {loading && (
                    <div className="flex justify-center items-center space-x-2 text-gray-600 py-4">
                        <Icon path={ICONS.spinner} className="animate-spin w-5 h-5" />
                        <span>Fetching {label.toLowerCase()}...</span>
                    </div>
                )}

                {fetched && !errorMsg && (
                    <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded-lg text-green-800">
                            <p className="font-semibold">{label} Data Retrieved Successfully!</p>
                        </div>
                        
                        {type === 'medical' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Status:</span> {testData.remarks}</div>
                                <div><span className="font-medium">Issued Date:</span> {testData.issuedDate}</div>
                                <div><span className="font-medium">Certificate ID:</span> {testData.certificateId}</div>
                                <div><span className="font-medium">Valid Until:</span> {testData.validUntil || 'N/A'}</div>
                            </div>
                        )}

                        {type === 'written' && testData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Score:</span> {testData.score}/100</div>
                                <div><span className="font-medium">Test Date:</span> {testData.testDate}</div>
                                <div><span className="font-medium">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${testData.score >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {testData.score >= 75 ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                                <div><span className="font-medium">Examiner:</span> {testData.examinerName || 'N/A'}</div>
                                {testData.remarks && (
                                    <div className="md:col-span-2">
                                        <span className="font-medium">Remarks:</span> {testData.remarks}
                                    </div>
                                )}
                            </div>
                        )}

                        {type === 'practical' && testData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="font-medium">Score:</span> {testData.score}/100</div>
                                <div><span className="font-medium">Test Date:</span> {testData.testDate}</div>
                                <div><span className="font-medium">Test Type:</span> {testData.testType}</div>
                                <div><span className="font-medium">Status:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${testData.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {testData.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                                <div><span className="font-medium">Examiner:</span> {testData.examinerName || 'N/A'}</div>
                                <div><span className="font-medium">Vehicle Category:</span> {testData.vehicleCategory || 'N/A'}</div>
                                {testData.remarks && (
                                    <div className="md:col-span-2">
                                        <span className="font-medium">Remarks:</span> {testData.remarks}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {errorMsg && !loading && (
                    <div className="bg-red-50 p-4 rounded-lg text-red-800">
                        <p className="font-semibold">{label} Fetch Failed</p>
                        <p className="text-sm">{errorMsg}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 p-6">
            {renderStatus('medical', 'Medical Certificate')}
            {renderStatus('written', 'Written Test Results')}
            {renderStatus('practical', 'Practical Test Results')}

            {/* Overall Application Status */}
            {(isFetched.medical || isFetched.written || isFetched.practical) && (
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-4 text-lg">Application Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${isFetched.medical ? 'text-green-600' : 'text-red-600'}`}>
                                {isFetched.medical ? '✓' : '✗'}
                            </div>
                            <div className="text-sm font-medium">Medical Certificate</div>
                            <div className="text-xs text-gray-600">
                                {isFetched.medical ? 'Verified' : 'Pending'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${isFetched.written ? 'text-green-600' : 'text-red-600'}`}>
                                {isFetched.written ? '✓' : '✗'}
                            </div>
                            <div className="text-sm font-medium">Written Test</div>
                            <div className="text-xs text-gray-600">
                                {isFetched.written ? (data.writtenTest?.score >= 75 ? 'Passed' : 'Failed') : 'Pending'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${isFetched.practical ? 'text-green-600' : 'text-red-600'}`}>
                                {isFetched.practical ? '✓' : '✗'}
                            </div>
                            <div className="text-sm font-medium">Practical Test</div>
                            <div className="text-xs text-gray-600">
                                {isFetched.practical ? (data.practicalTest?.passed ? 'Passed' : 'Failed') : 'Pending'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalCertificateStep;