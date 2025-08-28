import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSearchParams } from "react-router-dom"; // Assuming you are using react-router-dom
import { useExternalScript } from './useExternalScript';

// --- Helper Components ---

// Icon component for easily rendering SVG icons
const Icon = ({ path, className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

// --- SVG Icons ---
const ICONS = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    document: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
    arrowRight: "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z",
    car: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    spinner: "M12 6v2.45c-2.3.64-4 2.72-4 5.05s1.7 4.41 4 5.05V21c-4.42 0-8-3.58-8-8s3.58-8 8-8zm0 13v-2.45c2.3-.64 4-2.72 4-5.05s-1.7-4.41-4-5.05V3c4.42 0 8 3.58 8 8s-3.58 8-8 8z"
};

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState(null);

    const handleLogin = (nic) => {
        // Simulate API call to SLUDI
        const mockUserData = {
            fullName: "Kasun Asanka Silva",
            nic: nic,
            dob: "1999-09-15",
            bloodGroup: "O+",
            address: "No. 123, Galle Road, Colombo 03",
            phone: "0771234567",
            email: "kasun.silva@email.com",
            photoUrl: `./person1.jpeg`
        };
        setUserData(mockUserData);
        setFormData(mockUserData);
        setCurrentPage('application');
    };

    const handleSubmit = (data) => {
        setFormData(data);
        setCurrentPage('review');
    };

    const handlePaymentSuccess = () => {
        console.log("Payment Successful. Submitting Application:", formData);
        setCurrentPage('confirmation');
    };

    const handleEdit = () => {
        setCurrentPage('application');
    }

    const handleResubmit = () => {
        setFormData({});
        setUserData(null);
        setCurrentPage('login');
    }

    const handleLoginWithSLUDI = () => {
        setCurrentPage('userprofile');
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage onLogin={handleLogin} />;
            case 'application':
                return <ApplicationPage onSubmit={handleSubmit} initialData={formData} />;
            case 'review':
                return <ReviewPage formData={formData} onConfirm={() => setCurrentPage('payment')} onEdit={handleEdit} />;
            case 'payment':
                return <PaymentPage onPaymentSuccess={handlePaymentSuccess} />;
            case 'confirmation':
                return <ConfirmationPage onResubmit={handleResubmit} />;
            case 'userprofile':
                return <UserProfile onSubmitToSLUDI={handleLoginWithSLUDI} />;
            default:
                return <LoginPage onLogin={handleLogin} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Department of Motor Traffic</h1>
                        <p className="text-sm text-gray-600">Online Driving Licence Application</p>
                    </div>
                    <nav className="space-x-4 text-sm font-medium">
                        {currentPage !== 'login' && <a href="#" onClick={handleResubmit} className="text-gray-500 hover:text-gray-900">Logout</a>}
                        <a href="#" className="text-gray-500 hover:text-gray-900">Check Status</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">Contact Us</a>
                    </nav>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderPage()}
            </main>
        </div>
    );
}

// --- Page Components ---

const LoginPage = ({ onLogin }) => {
    const [nic, setNic] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (nic) onLogin(nic);
    }

    const signInButtonScript = "https://sludiauth.icta.gov.lk/plugins/sign-in-button-plugin.js";
    const state = useExternalScript(signInButtonScript);

    useEffect(() => {
        const renderButton = () => {
            window.SignInWithEsignetButton?.init(
                {
                    oidcConfig: {
                        acr_values: 'mosip:idp:acr:generated-code mosip:idp:acr:biometrics mosip:idp:acr:static-code',
                        authorizeUri: 'https://sludiauth.icta.gov.lk/authorize',
                        claims_locales: 'en',
                        client_id: 'IIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArpXLs',
                        display: 'page',
                        max_age: 21,
                        nonce: 'ere973eieljznge2311',
                        prompt: 'consent',
                        redirect_uri: 'http://localhost:5000/userprofile',
                        scope: 'openid profile',
                        state: 'eree2311',
                        ui_locales: 'en'
                    },
                    buttonConfig: {

                        customStyle: {
                            labelSpanStyle: {
                                display: 'inline-block',
                                'font-size': '0.875rem',
                                'font-weight': '600',
                                'line-height': '1.25rem',
                                'vertical-align': 'middle',
                            },
                            logoDivStyle: {
                                alignItems: 'center',
                                background: 'white',
                                border: '1px solid #0E3572',
                                'border-radius': '18px',
                                display: 'inline-block',
                                height: '30px',
                                position: 'absolute',
                                right: '8px',
                                verticalAlign: 'middle',
                                width: '30px'
                            },
                            logoImgStyle: {
                                height: '29px',
                                'object-fit': 'contain',
                                width: '29px'
                            },
                            outerDivStyleStandard: {
                                'align-items': 'center',
                                background: '#0E3572',
                                border: '1px solid #0E3572',
                                'border-radius': '0.375rem',
                                color: 'white',
                                display: 'flex',
                                padding: '0.625rem 1.25rem',
                                position: 'relative',
                                'text-decoration': 'none',
                                width: '250px',
                            }
                        },
                        labelText: 'Sign in with SLUDI',

                    },
                    signInElement: document.getElementById('sign-in-with-esignet'),
                }
            )
        }
        renderButton();
    },[state])

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Applicant Login</h2>
            <p className="text-gray-600 mb-6 text-center">Enter your NIC to begin.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput label="National Identity Card (NIC) Number" name="nic" value={nic} onChange={(e) => setNic(e.target.value)} placeholder="e.g., 199925801234" />
                <FormInput label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Login & Fetch Details
                    </button>
                </div>
                <div>
                    <div id="sign-in-with-esignet" style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}></div>
                </div>
            </form>
        </div>
    );
};

const ApplicationPage = ({ onSubmit, initialData }) => {
    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState(initialData || {});

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
                <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Back</button>
                {isLastStep ? (
                    <button onClick={() => onSubmit(formState)} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Review Application</button>
                ) : (
                    <button onClick={handleNext} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Next Step</button>
                )}
            </div>
        </div>
    );
};

const ReviewPage = ({ formData, onConfirm, onEdit }) => {
    const selectedCategories = Object.keys(formData).filter(key => ['A1', 'A', 'B1', 'B', 'C1', 'C'].includes(key) && formData[key]).join(', ');

    return (
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
            <p className="text-gray-600 mb-6">Please carefully check all your details before proceeding to payment.</p>

            <div className="space-y-6">
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong className="text-gray-600">Full Name:</strong> {formData.fullName}</p>
                        <p><strong className="text-gray-600">NIC:</strong> {formData.nic}</p>
                        <p><strong className="text-gray-600">Date of Birth:</strong> {formData.dob}</p>
                        <p><strong className="text-gray-600">Address:</strong> {formData.address}</p>
                    </div>
                </div>
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical Certificate</h3>
                    <p className={`text-sm ${formData.medicalStatus === 'Valid' ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {formData.medicalStatus || 'Not fetched'} (Issued: {formData.medicalDate || 'N/A'})
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Licence Details</h3>
                    <p className="text-sm"><strong className="text-gray-600">Selected Categories:</strong> {selectedCategories}</p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                <button onClick={onEdit} className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Edit Details</button>
                <button onClick={onConfirm} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Proceed to Payment</button>
            </div>
        </div>
    );
};

const PaymentPage = ({ onPaymentSuccess }) => {
    const [cardInfo, setCardInfo] = useState({ cardNumber: '', expiry: '', cvc: '', cardName: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Gateway</h2>
            <p className="text-gray-600 mb-6">Enter your card details to complete the application fee payment.</p>
            <div className="space-y-4">
                <FormInput label="Card Number" name="cardNumber" value={cardInfo.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <FormInput label="Expiry Date" name="expiry" value={cardInfo.expiry} onChange={handleChange} placeholder="MM/YY" />
                    </div>
                    <FormInput label="CVC" name="cvc" value={cardInfo.cvc} onChange={handleChange} placeholder="123" />
                </div>
                <FormInput label="Name on Card" name="cardName" value={cardInfo.cardName} onChange={handleChange} placeholder="e.g. K. A. Silva" />
            </div>
            <div className="mt-8">
                <button onClick={onPaymentSuccess} className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    Pay LKR 2,500.00
                </button>
            </div>
        </div>
    );
};

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
                <p className="text-lg font-bold text-indigo-600">SLDL-2024-117892</p>
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

// --- Form Step Components ---

const FormInput = ({ label, name, value, onChange, placeholder, type = "text", readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} name={name} id={name} value={value || ''} onChange={onChange} readOnly={readOnly} className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${readOnly ? 'bg-gray-100' : ''}`} placeholder={placeholder} />
    </div>
);

const PersonalDetailsStep = ({ data }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" name="fullName" value={data.fullName} readOnly={true} />
            <FormInput label="NIC Number" name="nic" value={data.nic} readOnly={true} />
            <FormInput label="Date of Birth" name="dob" value={data.dob} readOnly={true} />
            <FormInput label="Address" name="address" value={data.address} readOnly={true} />
        </div>
        <div className="text-center">
            <img src={data.photoUrl} alt="Applicant" className="w-40 h-50 object-cover rounded-lg shadow-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">Photo from SLUDI</p>
        </div>
    </div>
);

const MedicalCertificateStep = ({ data, setData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(!!data.medicalStatus);

    const handleFetchMedical = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const medicalData = { medicalStatus: "Valid", medicalDate: "2025-08-15" };
            setData(prev => ({ ...prev, ...medicalData }));
            setIsLoading(false);
            setIsFetched(true);
        }, 1500);
    };

    return (
        <div className="text-center p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fetch Medical Certificate</h3>
            <p className="text-sm text-gray-500 mb-6">Click the button below to fetch your latest medical certificate from the national health database.</p>

            {!isFetched && !isLoading && (
                <button onClick={handleFetchMedical} className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Fetch Certificate
                </button>
            )}

            {isLoading && (
                <div className="flex justify-center items-center space-x-2 text-gray-600">
                    <Icon path={ICONS.spinner} className="animate-spin w-6 h-6" />
                    <span>Fetching data...</span>
                </div>
            )}

            {isFetched && (
                <div className="bg-green-50 p-4 rounded-lg text-green-800">
                    <p className="font-semibold">Medical Certificate Fetched Successfully!</p>
                    <p className="text-sm">Status: {data.medicalStatus} (Issued: {data.medicalDate})</p>
                </div>
            )}
        </div>
    );
};


const LicenceDetailsStep = ({ data, onChange }) => (
    <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Licence Category</h3>
        <p className="text-sm text-gray-500 mb-4">Select the class of vehicles you wish to apply for. You may select multiple categories.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <CheckboxCard id="A1" label="A1" description="Light Motor Cycle" data={data} onChange={onChange} />
            <CheckboxCard id="A" label="A" description="Motor Cycle" data={data} onChange={onChange} />
            <CheckboxCard id="B1" label="B1" description="Motor Tricycle" data={data} onChange={onChange} />
            <CheckboxCard id="B" label="B" description="Light Motor Car" data={data} onChange={onChange} />
            <CheckboxCard id="C1" label="C1" description="Light Motor Lorry" data={data} onChange={onChange} />
            <CheckboxCard id="C" label="C" description="Heavy Motor Lorry" data={data} onChange={onChange} />
        </div>
    </div>
);

const CheckboxCard = ({ id, label, description, data, onChange }) => (
    <label htmlFor={id} className={`relative flex flex-col p-4 border rounded-lg cursor-pointer ${data[id] ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'}`}>
        <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-600">{label}</span>
            <input id={id} name={id} type="checkbox" checked={data[id] || false} onChange={onChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        </div>
        <div className="mt-2 text-sm text-gray-600">{description}</div>
    </label>
);



const UserProfile = ({ onSubmitToSLUDI }) => {
    // Correctly defined status object
    const status = {
        LOADING: "LOADING",
        LOADED: "LOADED",
        ERROR: "ERROR",
        AUTHENTICATING: "AUTHENTICATING"
    };

    // --- CORRECTION 1: Added a state variable to hold the current status ---
    const [currentStatus, setStatus] = useState(status.LOADING);

    const [searchParams] = useSearchParams(); // Renamed for clarity to follow convention
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Handle login API integration
    const getUserDetails = async (authcode) => {
        // --- CORRECTION 2: Set status to AUTHENTICATING before API call ---
        setStatus(status.AUTHENTICATING);
        setError(null);
        setUserInfo(null);

        try {
            const endpoint = `http://localhost:8888/delegate/fetchUserInfo?code=${authcode}`;
            const response = await axios.get(endpoint, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // --- CORRECTION 3: Changed 'var' to 'const' ---
            const userInfoData = response.data;

            setUserInfo(userInfoData);
            setStatus(status.LOADED);

        } catch (errormsg) {
            setError({ errorCode: errormsg.code || "API_FETCH_FAILED", errorMsg: errormsg.message });
            setStatus(status.ERROR);
        }
    };

    useEffect(() => {
        const getQueryParams = () => {
            // --- CORRECTION 4: Used the state variable 'searchParams' to get values ---
            let authCode = searchParams.get("code");
            let errorCode = searchParams.get("error");
            let error_desc = searchParams.get("error_description");

            if (errorCode) {
                // --- CORRECTION 5: Handle the error from query params properly ---
                setError({
                    errorCode: errorCode,
                    errorMsg: error_desc || "An error occurred during authentication.",
                });
                setStatus(status.ERROR);
                return;
            }

            if (authCode) {
                getUserDetails(authCode);
            } else {
                setError({
                    errorCode: "AUTH_CODE_MISSING",
                    errorMsg: "Authentication code is missing from the URL.",
                });
                // --- CORRECTION 6: Used the correct status object ---
                setStatus(status.ERROR);
            }
        };

        getQueryParams();
    }, [searchParams]); // Dependency array updated to avoid missing dependency warning

    return (
        <div>
            {/* The header can show the name once loaded */}
            <div className='header'>Welcome {userInfo?.name}</div>

            {/* --- CORRECTION 7: Used the 'currentStatus' state for conditional rendering --- */}

            {currentStatus === status.LOADING && <div>Loading Please Wait...</div>}
            {currentStatus === status.AUTHENTICATING && <div>Authenticating and fetching user details...</div>}

            {currentStatus === status.LOADED && userInfo && (
                <div>
                    <div className="card">
                        <img src={userInfo?.picture} alt="User profile" style={{ width: "100%" }} />
                        <div className='color-black mt-5 mb-10'>{userInfo?.email}</div>
                        <div className="color-black mb-10">
                            Date of Birth: <span className="title color-black">{userInfo?.birthdate}</span>
                        </div>
                        <div>
                            Phone: <span>{userInfo?.phone_number}</span>
                        </div>
                    </div>
                </div>
            )}

            {currentStatus === status.ERROR && (
                <div>
                    <h3>Oops! An error occurred.</h3>
                    <p>Please try again after some time.</p>
                    {/* Optionally display the error message for debugging */}
                    {error && <pre style={{ color: 'red' }}><code>Error Code: {error.errorCode}<br />{error.errorMsg}</code></pre>}
                </div>
            )}
        </div>
    );
};