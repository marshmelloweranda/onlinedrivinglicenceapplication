import React, { useEffect, useState } from 'react';
import { Shield, Clock } from 'lucide-react';
// Type import removed: import { Transaction } from '../types/payment';

// Interface converted to function props destructuring
export const ProcessingScreen = ({ transaction }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-12">
      <div className="mb-8">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-6 flex items-center justify-center">
            <Shield className="text-blue-600" size={24} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Payment{dots}
        </h2>
        <p className="text-gray-600 mb-6">
          Please wait while we securely process your transaction
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-auto max-w-md">
          <div className="flex items-center justify-center space-x-2 text-blue-700 mb-3">
            <Clock size={16} />
            <span className="text-sm font-medium">Transaction Details</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                {transaction.currency} {transaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Merchant:</span>
              <span className="font-medium">{transaction.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{transaction.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs">{transaction.id}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p className="flex items-center justify-center space-x-2 mb-2">
          <Shield size={14} />
          <span>Your payment is secured with 256-bit SSL encryption</span>
        </p>
        <p>Do not refresh or close this page</p>
      </div>
    </div>
  );
};