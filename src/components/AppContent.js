import React, { useState } from 'react';
import { Routes, Route, useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import Header from './Header';
import LoginPage from './pages/LoginPage';
import ApplicationPage from './pages/ApplicationPage';
import ReviewPage from './pages/ReviewPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PaymentAppPage from './pages/PaymentAppPage';

const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState(null);


    // Check if the current path is the root (Login Page)
    const isLoginPage = location.pathname === '/';

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

    // Modified: Directly proceed to application after SLUDI login
    const handleSLUDILogin = (sludiData) => {
        const mappedUserData = {
            fullName: sludiData.name,
            sub: sludiData.sub,
            dob: sludiData.birthdate,
            phone: sludiData.phone_number,
            email: sludiData.email,
            gender: sludiData.gender,
            photoUrl: sludiData.picture || '/default-avatar.png',

            // simulate RMV data
            blood_group: 'B+',
            medical_certificate_id: 'med-1',
            doctorName: 'Dr. Sampath',
            hospital: 'IDH',
            issuedDate: '2013/01/12',
            expiryDate: '2027/01/12',
            isFitToDrive: 'Yes',
            vision: 'good',
            hearing: 'good',
            remarks: 'none',
        };
        setUserData(mappedUserData);
        setFormData(mappedUserData);
        navigate('/application');
        console.log("SLUDI Data Mapped to Application:", mappedUserData);
    }

    const handlePayment = async () => {

       // window.location.href = 'http://localhost:5173/';
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {!isLoginPage && <Header onResubmit={handleResubmit} />}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} onSLUDILogin={handleSLUDILogin} />} />
                    <Route path="/application" element={<ApplicationPage onSubmit={handleSubmit} initialData={formData} />} />
                    <Route
                        path="/review"
                        element={
                            <ReviewPage
                                formData={formData}
                                onConfirm={handlePayment}
                                onEdit={handleEdit}
                            />
                        }
                    />
                    <Route path="/confirmation" element={<ConfirmationPage onResubmit={handleResubmit} />} />
                    <Route path="/payment" element={<PaymentAppPage />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppContent;