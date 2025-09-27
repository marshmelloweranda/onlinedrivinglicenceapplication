import React, { useState, useEffect } from 'react';
import PersonalDetailsStep from '../steps/PersonalDetailsStep';
import MedicalCertificateStep from '../steps/MedicalCertificateStep';
import LicenceDetailsStep from '../steps/LicenceDetailsStep';

const ApplicationPage = ({ onSubmit, initialData }) => {
    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState(initialData || {});

    useEffect(() => {
        setFormState(initialData);
        setStep(1);
    }, [initialData]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalDetailsStep data={formState} />;
            case 2:
                return <MedicalCertificateStep data={formState} setData={setFormState} />;
            case 3:
                return <LicenceDetailsStep data={formState} onChange={handleChange} />;
            default:
                return null;
        }
    };

    const totalSteps = 3;
    const isLastStep = step === totalSteps;

    return (
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Driving Licence Application</h2>
            <p className="text-gray-600 mb-6">Step {step} of {totalSteps} - {['Personal Details', 'Medical Certificate', 'Licence Category'][step - 1]}</p>
            <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
            </div>
            <div>{renderStep()}</div>
            <div className="mt-8 pt-6 border-t flex justify-between">
                <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                {isLastStep ? (
                    <button onClick={() => onSubmit(formState)} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Review Application</button>
                ) : (
                    <button onClick={handleNext} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Next Step</button>
                )}
            </div>
        </div>
    );
};

export default ApplicationPage;