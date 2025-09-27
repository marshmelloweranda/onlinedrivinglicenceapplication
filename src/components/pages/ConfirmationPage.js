import React from 'react';
import Icon, { ICONS } from '../Icon';

const ConfirmationPage = ({ onResubmit }) => {
    return (
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon path={ICONS.check} className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">Your application has been received. You will be notified for the written and practical tests.</p>
            <div className="bg-gray-100 p-4 rounded-md inline-block">
                <p className="text-sm text-gray-600">Your Application Reference Number is:</p>
                <p className="text-lg font-bold text-indigo-600">SLDL-2025-117892</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">You will receive an email confirmation shortly. You can use the reference number to check the status of your application online.</p>
            <div className="mt-8">
                <button
                    onClick={onResubmit}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                    Submit Another Application
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;