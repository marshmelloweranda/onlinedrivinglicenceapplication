import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
// Type import removed: import { CreditCardForm as CreditCardFormType } from '../types/payment';
import { 
  validateCardNumber, 
  validateExpiryDate, 
  validateCVV, 
  formatCardNumber, 
  formatExpiryDate,
  getCardType 
} from '../utils/validation';

// Interface converted to function props destructuring
export const CreditCardForm = ({
  onSubmit,
  isProcessing
}) => {
  // Initial state structure is inferred from usage
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'cardNumber':
        if (!value) error = 'Card number is required';
        else if (!validateCardNumber(value)) error = 'Invalid card number';
        break;
      case 'expiryDate':
        if (!value) error = 'Expiry date is required';
        else if (!validateExpiryDate(value)) error = 'Invalid expiry date';
        break;
      case 'cvv':
        if (!value) error = 'CVV is required';
        else if (!validateCVV(value)) error = 'Invalid CVV';
        break;
      case 'cardholderName':
        if (!value.trim()) error = 'Cardholder name is required';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const allFieldsValid = Object.keys(formData).every(field => 
      validateField(field, formData[field])
    );
    
    // The commented-out code for setTouched is unnecessary for a JS conversion.

    if (allFieldsValid) {
      onSubmit(formData);
    }
  };

  const cardType = getCardType(formData.cardNumber);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <CreditCard size={32} />
            <span className="text-sm font-medium uppercase">
              {cardType !== 'unknown' ? cardType : 'Card'}
            </span>
          </div>
          
          <div className="font-mono text-lg tracking-wider mb-4">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 mb-1">CARDHOLDER</div>
              <div className="font-medium uppercase">
                {formData.cardholderName || 'YOUR NAME'}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-75 mb-1">EXPIRES</div>
              <div className="font-mono">
                {formData.expiryDate || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            onBlur={() => handleBlur('cardNumber')}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
              ${errors.cardNumber && touched.cardNumber 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
              }
            `}
            disabled={isProcessing}
          />
          {errors.cardNumber && touched.cardNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              onBlur={() => handleBlur('expiryDate')}
              placeholder="MM/YY"
              maxLength={5}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                ${errors.expiryDate && touched.expiryDate 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
                }
              `}
              disabled={isProcessing}
            />
            {errors.expiryDate && touched.expiryDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                onBlur={() => handleBlur('cvv')}
                placeholder="123"
                maxLength={4}
                className={`
                  w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  ${errors.cvv && touched.cvv 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                  }
                `}
                disabled={isProcessing}
              />
              <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.cvv && touched.cvv && (
              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            onBlur={() => handleBlur('cardholderName')}
            placeholder="John Doe"
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors uppercase
              ${errors.cardholderName && touched.cardholderName 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
              }
            `}
            disabled={isProcessing}
          />
          {errors.cardholderName && touched.cardholderName && (
            <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock size={18} />
            <span>Pay Securely</span>
          </>
        )}
      </button>
    </form>
  );
};