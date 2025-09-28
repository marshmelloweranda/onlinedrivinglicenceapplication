import React from 'react';
import FormInput from '../FormInput';

const PersonalDetailsStep = ({ data }) => {
    // Safely handle missing data
    const safeData = {
        fullName: data.name || data.fullName || 'Not available',
        dob: data.date_of_birth || data.dob || 'Not available',
        phone: data.phone_number || data.phone || 'Not available',
        email: data.email || 'Not available',
        gender: data.gender || 'Not specified',
        photoUrl: data.photo || data.photoUrl || '/default-avatar.png'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Full Name" name="fullName" value={safeData.fullName} readOnly={true} />
                <FormInput label="Date of Birth" name="dob" value={safeData.dob} readOnly={true} />
                <FormInput label="Phone Number" name="phone" value={safeData.phone} readOnly={true} />
                <FormInput label="Email" name="email" value={safeData.email} readOnly={true} />
                <FormInput label="Gender" name="gender" value={safeData.gender} readOnly={true} />
                <FormInput label="User ID" name="sub" value={data.sub || 'Not available'} readOnly={true} />
            </div>
            <div className="text-center">
                <img 
                    src={safeData.photoUrl} 
                    alt="Applicant" 
                    className="w-40 h-50 object-cover rounded-lg shadow-md mx-auto border"
                    onError={(e) => {
                        e.target.src = '/default-avatar.png';
                    }}
                />
                <p className="text-sm text-gray-500 mt-2">Photo from SLUDI</p>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;