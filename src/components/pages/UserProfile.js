import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, } from "react-router-dom";
import axios from "axios";
import clientDetails from "../../constants/clientDetails";
import FormInput from '../FormInput';
import Icon, { ICONS } from '../Icon';

const UserProfile = ({ onSubmitToSLUDI }) => {
    const status = {
        LOADING: "LOADING",
        AUTHENTICATING: "AUTHENTICATING",
        LOADED: "LOADED",
        ERROR: "ERROR",
    };
    const [currentStatus, setStatus] = useState(status.LOADING);
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    // This useEffect hook should only run once on component mount.
    useEffect(() => {
        const handleSLUDICallback = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                console.error('SLUDI Authentication Error:', error);
                setError({ errorCode: error, errorMsg: 'Authentication failed' });
                setStatus(status.ERROR);
                return;
            }

            if (code) {
                setStatus(status.AUTHENTICATING);
                // Fetch user info directly and proceed to application
                fetchUserInfo(code);
            }
        };

        const fetchUserInfo = async (authCode) => {
            try {
                const endpoint = `${process.env.REACT_APP_API_URL}/delegate/fetchUserInfo`;
                const requestBody = {
                    code: authCode,
                    client_id: clientDetails.clientId,
                    redirect_uri: clientDetails.redirect_uri_userprofile,
                    grant_type: "authorization_code"
                };
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });
                
                if (response.ok) {
                    const userInfo = await response.json();
                    setUserInfo(userInfo);
                    setStatus(status.LOADED);
                    // Call the onSubmitToSLUDI prop with user info
                    if (onSubmitToSLUDI) {
                        onSubmitToSLUDI(userInfo);
                    }
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (err) {
                console.error("SLUDI API Fetch Error:", err);
                setError({ errorCode: 'FETCH_ERROR', errorMsg: err.message });
                setStatus(status.ERROR);
            }
        };

        // Check if this is a callback from SLUDI
        if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
            handleSLUDICallback();
        } else {
            setStatus(status.LOADED);
        }
    }, [onSubmitToSLUDI]); // Added onSubmitToSLUDI to dependency array

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto text-center">
            {currentStatus === status.LOADING && (
                <div className="flex flex-col items-center">
                    <Icon path={ICONS.spinner} className="animate-spin w-8 h-8 text-indigo-600 mb-4" />
                    <p className="text-gray-600">Loading, please wait...</p>
                </div>
            )}
            {currentStatus === status.AUTHENTICATING && (
                <div className="flex flex-col items-center">
                    <Icon path={ICONS.spinner} className="animate-spin w-8 h-8 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">Authenticating</h3>
                    <p className="text-gray-600">Fetching your details securely...</p>
                </div>
            )}
            {currentStatus === status.LOADED && userInfo && (
                 <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {userInfo?.given_name}!</h2>
                    <img src={userInfo?.picture} alt="User profile" className="w-32 h-32 rounded-full shadow-lg mb-4 object-cover" />
                    <div className="text-left space-y-2 bg-gray-50 p-4 rounded-lg w-full">
                        <p><strong>Email:</strong> {userInfo?.email}</p>
                        <p><strong>Date of Birth:</strong> {userInfo?.birthdate}</p>
                        <p><strong>Phone:</strong> {userInfo?.phone_number || "N/A"}</p>
                    </div>
                     <button
                        // onClick={() => onSubmitToSLUDI(userInfo)}
                        onClick={()=> navigate('/application')}
                        className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Proceed to Application
                    </button>
                </div>
            )}
            {currentStatus === status.ERROR && (
                <div className="bg-red-50 p-6 rounded-lg text-red-800">
                    <h3 className="font-bold text-lg mb-2">Oops! An error occurred.</h3>
                    <p className="text-sm">We couldn't log you in. Please try again later.</p>
                    {error && (
                        <div className="mt-4 text-left bg-red-100 p-2 rounded text-xs">
                           <p><strong>Error Code:</strong> {error.errorCode}</p>
                           <p><strong>Details:</strong> {error.errorMsg}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;