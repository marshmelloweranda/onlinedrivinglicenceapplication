import React, { useState, useEffect } from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { CreditCardForm } from '../CreditCardForm';
import { ProcessingScreen } from '../ProcessingScreen';
import { ResultScreen } from '../ResultScreen';
import { usePayment } from '../../hooks/usePayment'
// Type imports removed: import { PaymentRequest } from './types/payment';
import { QRPaymentForm } from '../QRForm';

// Type alias converted to comment for reference
// type AppState = 'method-selection' | 'payment-form' | 'processing' | 'result';

function PaymentAppPage() {
  const [currentState, setCurrentState] = useState('method-selection');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { currentTransaction, isProcessing, initializePayment, processPayment, resetPayment } = usePayment();

  // Initialize payment from URL parameters (simulating redirect from merchant)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount') || '99.99');
    const currency = urlParams.get('currency') || 'LKR';
    const merchantName = urlParams.get('merchant') || 'Department of Motor Trafic';
    const merchantId = urlParams.get('merchantId') || 'DMT';
    const orderId = urlParams.get('orderId') || `ORDER-${Date.now()}`;
    const returnUrl = urlParams.get('returnUrl') || 'https://demo-store.com/success';
    const cancelUrl = urlParams.get('cancelUrl') || 'https://demo-store.com/cancel';

    // Structure inferred from usage (equivalent to PaymentRequest)
    const paymentRequest = {
      amount,
      currency,
      merchantName,
      merchantId,
      orderId,
      returnUrl,
      cancelUrl
    };

    initializePayment(paymentRequest);
  }, [initializePayment]);

  const handleMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setCurrentState('payment-form');
  };

  const handlePaymentSubmit = async (paymentData) => {
    setCurrentState('processing');
    
    try {
      // paymentData is CreditCardForm | any
      const result = await processPayment(selectedPaymentMethod, paymentData);
      setCurrentState('result');
    } catch (error) {
      console.error('Payment processing error:', error);
      setCurrentState('result');
    }
  };

  const handleReturnToMerchant = () => {
    if (currentTransaction) {
      const returnUrl = currentTransaction.status === 'success' 
        ? `https://demo-store.com/success?transactionId=${currentTransaction.id}&status=success`
        : `https://demo-store.com/cancel?transactionId=${currentTransaction.id}&status=failed`;
      
      // In a real implementation, this would redirect to the merchant's return URL
      alert(`Redirecting to: ${returnUrl}`);
      
      // Reset for demo purposes
      resetPayment();
      setCurrentState('method-selection');
      setSelectedPaymentMethod('');
    }
  };

  const handleBackToMethods = () => {
    setCurrentState('method-selection');
    setSelectedPaymentMethod('');
  };

  if (!currentTransaction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-36 h-auto rounded-lg flex items-center justify-center">
                {/* <Shield className="text-white" size={20} /> */}
                <img src='../../../public.assets/logo/gov-pay-logo.svg'/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Government Gateway</h1>
                <p className="text-xs text-gray-500">Powered by 256-bit SSL encryption</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Globe size={14} />
                <span>Secure</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Transaction Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Merchant:</span>
                <p className="font-medium">{currentTransaction.merchantName}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-bold text-xl text-blue-600">
                  {currentTransaction.currency} {currentTransaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-medium">{currentTransaction.orderId}</p>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-medium">
                  {new Date(currentTransaction.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Back Button */}
          {currentState === 'payment-form' && (
            <button
              onClick={handleBackToMethods}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to payment methods</span>
            </button>
          )}

          {/* Dynamic Content */}
          {currentState === 'method-selection' && (
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={handleMethodSelect}
            />
          )}

          {currentState === 'payment-form' && selectedPaymentMethod === 'card' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Card Payment</h3>
              <CreditCardForm
                onSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
              />
            </div>
          )}
          {currentState === 'payment-form' && selectedPaymentMethod === 'qrpay' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">QR Payment</h3>
              <QRPaymentForm currentTransaction={currentTransaction} onSubmit={handlePaymentSubmit} isProcessing={isProcessing} />
              
            </div>
          )}

          {currentState === 'payment-form' && selectedPaymentMethod !== 'card' && selectedPaymentMethod !== 'qrpay' && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-6">
                <p className="text-lg font-medium capitalize mb-2">
                  {selectedPaymentMethod.replace('-', ' ')} Payment
                </p>
                <p>This payment method is coming soon!</p>
              </div>
              <button
                onClick={handleBackToMethods}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Choose Different Method
              </button>
            </div>
          )}

          {currentState === 'processing' && (
            <ProcessingScreen transaction={currentTransaction} />
          )}

          {currentState === 'result' && (
            <ResultScreen
              transaction={currentTransaction}
              onReturnToMerchant={handleReturnToMerchant}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span>🔒 SSL Secured</span>
            <span>•</span>
            <span>PCI Compliant</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
          <p>SecurePay Gateway - Your trusted payment processor</p>
        </footer>
      </main>
    </div>
  );
}

export default PaymentAppPage;