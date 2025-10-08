import React from 'react';
// Type import removed: import { Transaction } from '../types/payment';

// Interface converted to function props destructuring
export const QRPaymentForm = ({
  onSubmit, // Not used in the current implementation but kept in props
  isProcessing, // Not used in the current implementation but kept in props
  currentTransaction
}) => {

  // Generate QR code on component mount and when amount changes
  // Unused useEffect and useRef removed

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">QR Code Payment</h1>
        <p className="opacity-90">Scan to pay quickly and securely</p>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-1">Amount to pay</div>
          <div className="text-3xl font-bold">${currentTransaction.amount}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 text-center">
          <div 
            className="inline-block bg-white p-2 rounded-md border border-gray-200 mb-3"
            >
              <img src='https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png'/>
            </div>
          <p className="text-gray-600 text-sm">Scan this QR code with your banking app</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">How to pay with QR:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Open your mobile banking app</li>
            <li>Select "Scan QR Code" option</li>
            <li>Point your camera at the QR code</li>
            <li>Confirm the payment details</li>
            <li>Authorize the payment</li>
          </ol>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-6 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-amber-700 text-sm">This is a test QR code. No actual payment will be processed.</div>
        </div>
        
       
  
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Supported payment methods</h3>
          <div className="flex justify-center space-x-4">
            <div className="w-12 h-8 border border-gray-200 rounded-md flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H21C22.1046 19 23 18.1046 23 17V7C23 5.89543 22.1046 5 21 5Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10H23" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-12 h-8 border border-gray-200 rounded-md flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-12 h-8 border border-gray-200 rounded-md flex items-center justify-center bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-xs text-gray-500">Secure payment • Your data is protected</p>
      </div>
    </div>
  );
};