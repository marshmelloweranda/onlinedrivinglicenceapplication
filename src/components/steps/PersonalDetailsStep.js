import React from 'react';
import FormInput from '../FormInput';

const PersonalDetailsStep = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="fullName" value={data.fullName} readOnly={true} />
            <FormInput label="Date of Birth" name="dob" value={data.dob} readOnly={true} />
            <FormInput label="Phone Number" name="phone" value={data.phone} readOnly={true} />
            <FormInput label="email" name="email" value={data.email} readOnly={true} />
            <FormInput label="Gender" name="gender" value={data.gender} readOnly={true} />
        </div>
        <div className="text-center">
            <img src={data.photoUrl} alt="Applicant" className="w-40 h-50 object-cover rounded-lg shadow-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Photo from SLUDI</p>
        </div>
    </div>
);

export default PersonalDetailsStep;