import React from 'react';
import { CreditCard, Smartphone, Building, Wallet ,QrCode} from 'lucide-react';
// Type import removed: import { PaymentMethod } from '../types/payment';

// Interface converted to function props destructuring
export const PaymentMethodSelector = ({
  selectedMethod,
  onMethodSelect
}) => {
  // paymentMethods is defined here instead of relying on an imported type
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'qrpay',
      name: 'QR Pay',
      icon: 'qr-code',
      description: 'Pay with your Backing App',
      enabled: true
    },
    {
      id: 'casa-payments',
      name: 'Direct Bank Payment',
      icon: 'building',
      description: 'CASA payment ( Current Account and Savings Account )',
      enabled: true
    },
    {
      id: 'digital-wallet',
      name: 'Digital Wallet',
      icon: 'smartphone',
      description: 'E-Locker',
      enabled: false
    }
  ];

  const iconComponents = {
    'credit-card': CreditCard,
    'wallet': Wallet,
    'building': Building,
    'smartphone': Smartphone,
    'qr-code':QrCode
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
      
      {paymentMethods.map((method) => {
        // IconComponent type assertion removed
        const IconComponent = iconComponents[method.icon];
        const isSelected = selectedMethod === method.id;
        
        return (
          <button
            key={method.id}
            onClick={() => method.enabled && onMethodSelect(method.id)}
            disabled={!method.enabled}
            className={`
              w-full p-4 border-2 rounded-lg transition-all duration-200 text-left
              ${isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : method.enabled 
                  ? 'border-gray-200 hover:border-gray-300 bg-white' 
                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                p-2 rounded-full
                ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
              `}>
                <IconComponent size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  {!method.enabled && (
                    <span className="text-xs text-gray-500">Coming Soon</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              
              <div className={`
                w-4 h-4 rounded-full border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
                }
              `}>
                {isSelected && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};