import React, { useState } from 'react';
import Icon, { ICONS } from '../Icon';
import axios from 'axios';

const ReviewPage = ({ formData, onConfirm, onEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Fix: Get selected categories from the array instead of individual keys
    const selectedCategories = formData.selectedCategories && formData.selectedCategories.length > 0 
        ? formData.selectedCategories.join(', ') 
        : 'None Selected';

    // Extract test data
    const writtenTest = formData.writtenTest || {};
    const practicalTest = formData.practicalTest || {};

    console.log('ReviewPage formData:', formData);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            await onConfirm();
            
            axios.post('http://localhost:8888/api/confirm-payment', formData, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                console.log('Payment initiation response:', response.data);
                if (response.status === 200) {
                    window.location.href = 'http://localhost:5173/';
                } else {
                    setError('Payment initiation failed. Please try again.');
                }
            })
            .catch(err => {
                console.error('Payment initiation error:', err);
                setError('An error occurred while initiating payment. Please try again.');
            });     

        } catch (err) {
            setError('Failed to connect to the payment service. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTestStatusBadge = (passed, score, passingScore = 75) => {
        if (!score && score !== 0) return null;
        
        const isPassed = passed !== undefined ? passed : score >= passingScore;
        return (
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {isPassed ? 'PASSED' : 'FAILED'}
            </span>
        );
    };

    const formatTestDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString('en-LK');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
            <p className="text-gray-600 mb-6">Please carefully check all your details before proceeding to payment.</p>
            
            <div className="space-y-6">
                {/* Personal Details Section */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Full Name:</strong> {formData.fullName}</p>
                        <p><strong className="text-gray-600">Date of Birth:</strong> {formData.dob}</p>
                        <p><strong className="text-gray-600">Phone Number:</strong> {formData.phone}</p>
                        <p><strong className="text-gray-600">Email:</strong> {formData.email}</p>
                        <p><strong className="text-gray-600">Gender:</strong> {formData.gender}</p>
                    </div>
                </div>

                {/* Medical Certificate Section */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Medical Certificate</h3>
                    <div className="space-y-2 text-sm">
                        <p className={`flex items-center ${formData.isFitToDrive === true ? 'text-green-600' : 'text-red-600'}`}>
                            <strong className="text-gray-600 mr-2">Status:</strong> 
                            {formData.remarks || 'Not fetched'} 
                            {formData.issuedDate ? ` (Issued: ${formData.issuedDate})` : ''}
                        </p>
                        {formData.certificateId && (
                            <p><strong className="text-gray-600">Certificate ID:</strong> {formData.certificateId}</p>
                        )}
                        {formData.doctorName && (
                            <p><strong className="text-gray-600">Issued by:</strong> {formData.doctorName}</p>
                        )}
                    </div>
                </div>

                {/* Written Test Section */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Written Test Results</h3>
                    {writtenTest.score !== undefined ? (
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center">
                                <strong className="text-gray-600 mr-2">Score:</strong> 
                                {writtenTest.score}/100
                                {getTestStatusBadge(writtenTest.passed, writtenTest.score, 75)}
                            </p>
                            <p><strong className="text-gray-600">Test Date:</strong> {formatTestDate(writtenTest.testDate)}</p>
                            {writtenTest.examinerName && (
                                <p><strong className="text-gray-600">Examiner:</strong> {writtenTest.examinerName}</p>
                            )}
                            {writtenTest.testCenter && (
                                <p><strong className="text-gray-600">Test Center:</strong> {writtenTest.testCenter}</p>
                            )}
                            {writtenTest.remarks && (
                                <p><strong className="text-gray-600">Remarks:</strong> {writtenTest.remarks}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-yellow-600 text-sm">Written test results not available</p>
                    )}
                </div>

                {/* Practical Test Section */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Practical Test Results</h3>
                    {practicalTest.score !== undefined ? (
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center">
                                <strong className="text-gray-600 mr-2">Score:</strong> 
                                {practicalTest.score}/100
                                {getTestStatusBadge(practicalTest.passed, practicalTest.score, 80)}
                            </p>
                            <p><strong className="text-gray-600">Test Date:</strong> {formatTestDate(practicalTest.testDate)}</p>
                            {practicalTest.testType && (
                                <p><strong className="text-gray-600">Test Type:</strong> {practicalTest.testType}</p>
                            )}
                            {practicalTest.vehicleCategory && (
                                <p><strong className="text-gray-600">Vehicle Category:</strong> {practicalTest.vehicleCategory}</p>
                            )}
                            {practicalTest.examinerName && (
                                <p><strong className="text-gray-600">Examiner:</strong> {practicalTest.examinerName}</p>
                            )}
                            {practicalTest.testCenter && (
                                <p><strong className="text-gray-600">Test Center:</strong> {practicalTest.testCenter}</p>
                            )}
                            {practicalTest.remarks && (
                                <p><strong className="text-gray-600">Remarks:</strong> {practicalTest.remarks}</p>
                            )}
                        </div>
                    ) : (
                        <p className="text-yellow-600 text-sm">Practical test results not available</p>
                    )}
                </div>

                {/* Licence Details Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Licence Details</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong className="text-gray-600">Selected Categories:</strong> {selectedCategories}</p>
                        {formData.paymentDetails && formData.paymentDetails.totalAmount && (
                            <p><strong className="text-gray-600">Total Amount:</strong> LKR {parseFloat(formData.paymentDetails.totalAmount).toFixed(2)}</p>
                        )}
                    </div>
                </div>

                {/* Overall Eligibility Status */}
                {(writtenTest.score !== undefined || practicalTest.score !== undefined) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Eligibility Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className={`text-lg font-bold ${formData.isFitToDrive ? 'text-green-600' : 'text-red-600'}`}>
                                    {formData.isFitToDrive ? '✓' : '✗'}
                                </div>
                                <div>Medical Fitness</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-lg font-bold ${writtenTest.passed ? 'text-green-600' : writtenTest.score !== undefined ? 'text-red-600' : 'text-gray-400'}`}>
                                    {writtenTest.score !== undefined ? (writtenTest.passed ? '✓' : '✗') : '?'}
                                </div>
                                <div>Written Test</div>
                                {writtenTest.score !== undefined && (
                                    <div className="text-xs">{writtenTest.score}/100</div>
                                )}
                            </div>
                            <div className="text-center">
                                <div className={`text-lg font-bold ${practicalTest.passed ? 'text-green-600' : practicalTest.score !== undefined ? 'text-red-600' : 'text-gray-400'}`}>
                                    {practicalTest.score !== undefined ? (practicalTest.passed ? '✓' : '✗') : '?'}
                                </div>
                                <div>Practical Test</div>
                                {practicalTest.score !== undefined && (
                                    <div className="text-xs">{practicalTest.score}/100</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t flex flex-col items-end">
                <div className="flex space-x-3">
                    <button 
                        onClick={onEdit} 
                        disabled={isSubmitting} 
                        className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Edit Details
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={isSubmitting} 
                        className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <Icon path={ICONS.spinner} className="animate-spin w-4 h-4 mr-2" />
                                Processing...
                            </span>
                        ) : (
                            'Proceed to Payment'
                        )}
                    </button>
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default ReviewPage;