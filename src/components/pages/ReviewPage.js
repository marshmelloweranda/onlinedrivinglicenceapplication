import React, { useState } from 'react';
import Icon, { ICONS } from '../Icon';
import axios from 'axios';

const ReviewPage = ({ formData, onConfirm, onEdit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const selectedCategories = Object.keys(formData).filter(key => ['A1', 'A', 'B1', 'B', 'C1', 'C'].includes(key) && formData[key]).join(', ') || 'None Selected';

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            await onConfirm();
            
            axios.post('http://localhost:8888/api/initiate-payment', formData, {
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

    return (
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
            <p className="text-gray-600 mb-6">Please carefully check all your details before proceeding to payment.</p>
            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Full Name:</strong> {formData.fullName}</p>
                        <p><strong className="text-gray-600">Date of Birth:</strong> {formData.dob}</p>
                        <p><strong className="text-gray-600">Phone Number:</strong> {formData.phone}</p>
                        <p><strong className="text-gray-600">Email:</strong> {formData.email}</p>
                        <p><strong className="text-gray-600">Gender:</strong> {formData.gender}</p>
                    </div>
                </div>
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical Certificate</h3>
                    <p className={`text-sm ${formData.isFitToDrive === true ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {formData.remarks || 'Not fetched'} {formData.issuedDate ? `(Issued: ${formData.issuedDate})` : ''}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Licence Details</h3>
                    <p className="text-sm"><strong className="text-gray-600">Selected Categories:</strong> {selectedCategories}</p>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t flex flex-col items-end">
                <div className="flex space-x-3">
                    <button onClick={onEdit} disabled={isSubmitting} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Edit Details</button>
                    <button onClick={handleConfirm} disabled={isSubmitting} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default ReviewPage;