import React from 'react';
import { CheckCircle, XCircle, ArrowRight, Copy, ExternalLink } from 'lucide-react';
// Type import removed: import { Transaction } from '../types/payment';

// Interface converted to function props destructuring
export const ResultScreen = ({
  transaction,
  onReturnToMerchant // Not directly used in JSX but kept for completeness
}) => {
  const isSuccess = transaction.status === 'success';
  
  const copyTransactionId = () => {
    // navigator.clipboard is available in JS environments
    navigator.clipboard.writeText(transaction.id);
  };

  return (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className={`
          mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6
          ${isSuccess ? 'bg-green-100' : 'bg-red-100'}
        `}>
          {isSuccess ? (
            <CheckCircle className="text-green-600" size={40} />
          ) : (
            <XCircle className="text-red-600" size={40} />
          )}
        </div>
        
        <h2 className={`
          text-3xl font-bold mb-2
          ${isSuccess ? 'text-green-600' : 'text-red-600'}
        `}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        
        <p className="text-gray-600 text-lg">
          {isSuccess 
            ? 'Your payment has been processed successfully'
            : 'We were unable to process your payment'
          }
        </p>
      </div>

      <div className={`
        border rounded-lg p-6 mx-auto max-w-md mb-8
        ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
      `}>
        <h3 className="font-semibold text-gray-900 mb-4">Transaction Summary</h3>
        
        <div className="space-y-3 text-sm">
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
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {new Date(transaction.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-gray-600">Transaction ID:</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs">{transaction.id}</span>
              <button
                onClick={copyTransactionId}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Transaction ID"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`
              font-medium capitalize px-2 py-1 rounded-full text-xs
              ${isSuccess 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
              }
            `}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>

      {!isSuccess && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-auto max-w-md mb-8">
          <h4 className="font-medium text-yellow-800 mb-2">What you can do:</h4>
          <ul className="text-sm text-yellow-700 text-left space-y-1">
            <li>• Check your card details and try again</li>
            <li>• Ensure you have sufficient funds</li>
            <li>• Contact your bank if the issue persists</li>
            <li>• Try a different payment method</li>
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <button
          // onClick={onReturnToMerchant}
          className={`
            w-full max-w-md mx-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors
            ${isSuccess 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <ExternalLink size={18} />
         <a href="http://localhost:3009/dmt/confirmation"> <span>Return to {transaction.merchantName}</span></a>
          <ArrowRight size={18} />
        </button>
        
        {isSuccess && (
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You will receive a confirmation email shortly. Keep your transaction ID for your records.
          </p>
        )}
      </div>
    </div>
  );
};