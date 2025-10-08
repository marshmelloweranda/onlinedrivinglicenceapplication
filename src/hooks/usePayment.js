import { useState, useCallback } from 'react';
// Types are removed as they are not needed in JS
// import { Transaction, PaymentRequest, CreditCardForm } from '../types/payment';

export const usePayment = () => {
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // request is PaymentRequest
  const initializePayment = useCallback((request) => {
    const transaction = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: request.amount,
      currency: request.currency,
      merchantName: request.merchantName,
      merchantId: request.merchantId,
      orderId: request.orderId,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    setCurrentTransaction(transaction);
    return transaction;
  }, []);

  // paymentData is CreditCardForm | any
  const processPayment = useCallback(async (
    paymentMethod,
    paymentData
  ) => {
    if (!currentTransaction) {
      throw new Error('No active transaction');
    }

    setIsProcessing(true);
    setCurrentTransaction(prev => prev ? { ...prev, status: 'processing' } : null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock success/failure logic (80% success rate)
    const isSuccess = Math.random() > 0.2;
    
    const finalStatus = isSuccess ? 'success' : 'failed';
    setCurrentTransaction(prev => prev ? { ...prev, status: finalStatus } : null);
    setIsProcessing(false);

    return {
      success: isSuccess,
      transactionId: currentTransaction.id
    };
  }, [currentTransaction]);

  const resetPayment = useCallback(() => {
    setCurrentTransaction(null);
    setIsProcessing(false);
  }, []);

  return {
    currentTransaction,
    isProcessing,
    initializePayment,
    processPayment,
    resetPayment
  };
};