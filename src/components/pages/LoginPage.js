import React, { useState, useEffect } from 'react';
import { useExternalScript } from '../../hooks/useExternalScript';
import clientDetails from "../../constants/clientDetails";
import FormInput from '../FormInput';
import Icon, { ICONS } from '../Icon';

const LoginPage = ({ onLogin, onSLUDILogin }) => {
    const [nic, setNic] = useState('');
    const [password, setPassword] = useState('');
    const signInButtonScript = "/plugins/sign-in-button-plugin.js";
    const state = useExternalScript(signInButtonScript);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nic) onLogin(nic);
    }

    let claims = {};
    try {
        claims = JSON.parse(decodeURIComponent(clientDetails.userProfileClaims));
    } catch (error) {
        console.error("Failed to parse userProfileClaims from clientDetails:", error);
    }

    const oidcConfig = {
        authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
        redirect_uri: clientDetails.redirect_uri_userprofile,
        client_id: clientDetails.clientId,
        scope: clientDetails.scopeUserProfile,
        nonce: clientDetails.nonce,
        state: clientDetails.state,
        acr_values: clientDetails.acr_values,
        claims_locales: clientDetails.claims_locales,
        display: clientDetails.display,
        prompt: clientDetails.prompt,
        max_age: clientDetails.max_age,
        ui_locales: "en",
        claims: claims,
    };

    useEffect(() => {
        const renderButton = () => {
            if (window.SignInWithEsignetButton) {
                window.SignInWithEsignetButton.init({
                    oidcConfig: oidcConfig,
                    buttonConfig: {
                        customStyle: {
                            labelSpanStyle: { display: 'inline-block', 'font-size': '0.875rem', 'font-weight': '600', 'line-height': '1.25rem', 'vertical-align': 'middle' },
                            logoDivStyle: { alignItems: 'center', background: 'white', border: '1px solid #0E3572', 'border-radius': '18px', display: 'inline-block', height: '30px', position: 'absolute', right: '8px', verticalAlign: 'middle', width: '30px' },
                            logoImgStyle: { height: '29px', 'object-fit': 'contain', width: '29px' },
                            outerDivStyleStandard: { 'align-items': 'center', background: '#0E3572', border: '1px solid #0E3572', 'border-radius': '0.375rem', color: 'white', display: 'flex', padding: '0.625rem 1.25rem', position: 'relative', 'text-decoration': 'none', width: '250px' }
                        },
                        labelText: 'Sign in with SLUDI',
                    },
                    signInElement: document.getElementById('sign-in-with-esignet'),
                });
            }
        }
        if (state === 'ready') {
            renderButton();
        }
    }, [state, oidcConfig]);

    // Add effect to handle SLUDI callback directly
    useEffect(() => {
        const handleSLUDICallback = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                console.error('SLUDI Authentication Error:', error);
                return;
            }

            if (code) {
                // Fetch user info directly and proceed to application
                fetchUserInfo(code);
            }
        };

        const fetchUserInfo = async (authCode) => {
            try {
                const endpoint = `http://localhost:8888/delegate/fetchUserInfo`;
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
                    onSLUDILogin(userInfo);
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (err) {
                console.error("SLUDI API Fetch Error:", err);
            }
        };

        // Check if this is a callback from SLUDI
        if (window.location.search.includes('code=') || window.location.search.includes('error=')) {
            handleSLUDICallback();
        }
    }, [onSLUDILogin]);

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
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>
                <div>
                    <div id="sign-in-with-esignet" style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        {state === 'loading' && <p>Loading Login Button...</p>}
                        {state === 'error' && <p>Error loading login button.</p>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;