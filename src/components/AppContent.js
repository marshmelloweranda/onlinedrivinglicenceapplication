import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios"; // Add this import
import Header from './Header';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import ApplicationPage from './pages/ApplicationPage';
import ReviewPage from './pages/ReviewPage';
import ConfirmationPage from './pages/ConfirmationPage';

const AppContent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState(null);

    const handleLogin = (nic) => {
        const mockUserData = {
            fullName: "Kasun Asanka Silva",
            nic: nic,
            dob: "1999-09-15",
            bloodGroup: "O+",
            address: "No. 123, Galle Road, Colombo 03",
            phone: "0771234567",
            email: "kasun.silva@email.com",
            gender: "Male",
            photoUrl: `/person1.jpeg`
        };
        setUserData(mockUserData);
        setFormData(mockUserData);
        navigate('/application');
    };

    const handleSubmit = (data) => {
        setFormData(data);
        navigate('/review');
    };

    const handleEdit = () => {
        navigate('/application');
    }

    const handleResubmit = () => {
        setFormData({});
        setUserData(null);
        navigate('/');
    }

    const proceedToApplication = (sludiData) => {
        const mappedUserData = {
            fullName: sludiData.name,
            sub: sludiData.sub,
            dob: sludiData.birthdate,
            phone: sludiData.phone_number,
            email: sludiData.email,
            gender: sludiData.gender,
            photoUrl: sludiData.picture || '/default-avatar.png'
        };
        setUserData(mappedUserData);
        setFormData(mappedUserData);
        navigate('/application');
        console.log("SLUDI Data Mapped to Application:", mappedUserData);
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header onResubmit={handleResubmit} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/userprofile" element={<UserProfile onSubmitToSLUDI={proceedToApplication} />} />
                    <Route path="/application" element={<ApplicationPage onSubmit={handleSubmit} initialData={formData} />} />
                    <Route
                        path="/review"
                        element={
                            <ReviewPage
                                formData={formData}
                                onConfirm={async () => {
                                    try {
                                        const response = await axios.post('http://localhost:8888/api/initiate-payment', formData, {
                                            headers: { 'Content-Type': 'application/json' }
                                        });

                                        console.log('Payment initiation response:', response.data);

                                        if (response.status === 200) {
                                            window.location.href = 'http://localhost:5173/';
                                        } else {
                                            throw new Error('Payment initiation failed with status: ' + response.status);
                                        }
                                    } catch (error) {
                                        console.error('Payment initiation failed:', error);
                                        throw error;
                                    }
                                }}
                                onEdit={handleEdit}
                            />
                        }
                    />
                    <Route path="/confirmation" element={<ConfirmationPage onResubmit={handleResubmit} />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppContent;