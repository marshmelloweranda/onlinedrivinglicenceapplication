import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
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
    const [currentStatus, setCurrentStatus] = useState(status.LOADING);
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const getUserDetails = async (authCode) => {
            setCurrentStatus(status.AUTHENTICATING);
            setError(null);
            setUserInfo(null);

            try {
                const endpoint = `http://localhost:8888//delegate/fetchUserInfo`;
                const requestBody = {
                    code: authCode,
                    client_id: clientDetails.clientId,
                    redirect_uri: clientDetails.redirect_uri_userprofile,
                    grant_type: "authorization_code"
                };
                const response = await axios.post(endpoint, requestBody, {
                    headers: { "Content-Type": "application/json" }
                });
                setUserInfo(response.data);
                setCurrentStatus(status.LOADED);

            } catch (err) {
                console.error("API Fetch Error:", err);
                setError({
                    errorCode: err.response?.data?.errorCode || "API_FETCH_FAILED",
                    errorMsg: err.response?.data?.errorMsg || err.message
                });
                setCurrentStatus(status.ERROR);
            }
        };

        const getQueryParams = () => {
            const authCode = searchParams.get("code");
            const errorCode = searchParams.get("error");
            const errorDesc = searchParams.get("error_description");

            if (errorCode) {
                setError({
                    errorCode: errorCode,
                    errorMsg: errorDesc || "An error occurred during authentication."
                });
                setCurrentStatus(status.ERROR);
                return;
            }

            if (authCode) {
                getUserDetails(authCode);
            } else {
                setError({
                    errorCode: "AUTH_CODE_MISSING",
                    errorMsg: "Authentication code is missing from the URL."
                });
                setCurrentStatus(status.ERROR);
            }
        };

        getQueryParams();
    }, [searchParams]);

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            {currentStatus === status.LOADING && (
                <div className="flex flex-col items-center text-center">
                    <Icon path={ICONS.spinner} className="animate-spin w-8 h-8 text-indigo-600 mb-4" />
                    <p className="text-gray-600">Loading, please wait...</p>
                </div>
            )}
            {currentStatus === status.AUTHENTICATING && (
                <div className="flex flex-col items-center text-center">
                    <Icon path={ICONS.spinner} className="animate-spin w-8 h-8 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">Authenticating</h3>
                    <p className="text-gray-600">Finalizing secure login and fetching your details...</p>
                </div>
            )}
            {currentStatus === status.LOADED && userInfo && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Details</h2>
                    <p className="text-gray-600 mb-6">These details have been securely fetched from your SLUDI profile. Please confirm they are correct before proceeding.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-t border-b py-6">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Full Name" name="fullName" value={userInfo.name || ""} readOnly={true} />
                            <FormInput label="Date of Birth" name="dob" value={userInfo.birthdate || ""} readOnly={true} />
                            <FormInput label="Phone Number" name="phone" value={userInfo.phone_number || ""} readOnly={true} />
                            <FormInput label="Email Address" name="email" value={userInfo.email || ""} readOnly={true} />
                            <FormInput label="Gender" name="gender" value={userInfo.gender || ""} readOnly={true} />
                        </div>
                        <div className="text-center">
                            <img src={userInfo.picture || '/default-avatar.png'} alt="Applicant" className="w-40 h-50 object-cover rounded-lg shadow-md mx-auto" />
                            <p className="text-sm text-gray-500 mt-2">Photo from SLUDI</p>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => onSubmitToSLUDI(userInfo)} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Confirm & Proceed to Application
                            <Icon path={ICONS.arrowRight} className="ml-2 -mr-1 w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            {currentStatus === status.ERROR && (
                <div className="bg-red-50 p-6 rounded-lg text-red-800 text-center">
                    <h3 className="font-bold text-lg mb-2">Oops! Authentication Failed.</h3>
                    <p className="text-sm">We could not log you in using SLUDI. Please try again later or use a different login method.</p>
                    {error && (
                        <div className="mt-4 text-left bg-red-100 p-3 rounded text-xs font-mono">
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