import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment details from URL params
        const razorpay_payment_id = searchParams.get('razorpay_payment_id');
        const razorpay_payment_link_id = searchParams.get('razorpay_payment_link_id');
        const razorpay_payment_link_reference_id = searchParams.get('razorpay_payment_link_reference_id');
        const razorpay_payment_link_status = searchParams.get('razorpay_payment_link_status');
        const razorpay_signature = searchParams.get('razorpay_signature');

        // Get pending payment info from sessionStorage
        const pendingPaymentStr = sessionStorage.getItem('pending_payment');
        
        if (!razorpay_payment_id) {
          throw new Error('Payment details missing');
        }

        // Check if payment was cancelled or failed
        if (razorpay_payment_link_status && razorpay_payment_link_status !== 'paid') {
          throw new Error(`Payment ${razorpay_payment_link_status}`);
        }

        // For payment links, verify using payment link ID and payment ID
        const verifyResponse = await api.payments.verifyPayment({
          razorpay_order_id: razorpay_payment_link_id || '',
          razorpay_payment_id,
          razorpay_signature: razorpay_signature || '',
        });

        if (verifyResponse.success) {
          setStatus('success');
          setMessage('Payment completed successfully! 🎉');
          
          // Clear pending payment
          sessionStorage.removeItem('pending_payment');
          
          toast({
            title: 'Payment Successful',
            description: 'Your payment has been processed successfully.',
          });

          // Parse pending payment for redirect
          if (pendingPaymentStr) {
            const pendingPayment = JSON.parse(pendingPaymentStr);
            
            // Redirect based on payment type
            setTimeout(() => {
              if (pendingPayment.paymentFor.includes('membership')) {
                navigate('/memberships');
              } else if (pendingPayment.paymentFor.includes('donation')) {
                navigate('/donations');
              } else if (pendingPayment.paymentFor.includes('booking')) {
                navigate('/my-bookings');
              } else {
                navigate('/');
              }
            }, 2000);
          } else {
            setTimeout(() => navigate('/'), 2000);
          }
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error.message || 'Payment verification failed');
        
        toast({
          title: 'Payment Failed',
          description: error.message || 'Unable to verify your payment',
          variant: 'destructive',
        });

        // Clear pending payment
        sessionStorage.removeItem('pending_payment');
        
        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-amber-600 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting you...</p>
            </>
          )}
          
          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting you back...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
