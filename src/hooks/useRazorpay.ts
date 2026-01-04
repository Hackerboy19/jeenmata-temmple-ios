import { useEffect } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

/**
 * ✅ Detect ONLY iOS devices (iPhone / iPad / iPod)
 * This guarantees Safari redirect
 */
const isIOSDevice = (): boolean => {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayProps {
  amount: number;
  paymentFor: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  metadata?: any;
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
}

export const useRazorpay = () => {
  const { toast } = useToast();

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async ({
    amount,
    paymentFor,
    userDetails,
    metadata,
    onSuccess,
    onFailure,
  }: UseRazorpayProps) => {
    try {
      // Check if user is logged in (token exists)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to continue with payment');
      }

      // 1️⃣ iOS → Use Payment Link (Direct Safari redirect)
      if (isIOSDevice()) {
        console.log('🍎 iOS device detected, creating payment link...');
        console.log('Payment details:', { amount, paymentFor, userDetails });
        
        sessionStorage.setItem(
          'pending_payment',
          JSON.stringify({
            paymentFor,
            userDetails,
            metadata,
          })
        );

        toast({
          title: 'Creating Payment Link',
          description: 'Please wait...',
        });

        // Create payment link
        try {
          const linkResponse = await api.payments.createPaymentLink(
            amount,
            paymentFor,
            userDetails,
            metadata
          );

          console.log('✅ Payment link response:', linkResponse);

          if (!linkResponse.success || !linkResponse.data) {
            throw new Error(linkResponse.message || 'Failed to create payment link');
          }

          toast({
            title: 'Redirecting to Payment',
            description: 'Opening secure payment page…',
          });

          // Small delay to show toast
          setTimeout(() => {
            console.log('🔗 Redirecting to:', linkResponse.data.paymentLinkUrl);
            window.location.href = linkResponse.data.paymentLinkUrl;
          }, 500);
          
          return;
        } catch (linkError: any) {
          console.error('❌ Payment link error:', linkError);
          
          // Check if it's an auth error
          if (linkError.message?.includes('authorized') || linkError.message?.includes('login')) {
            throw new Error('Please login to continue with payment');
          }
          
          throw new Error(linkError.message || 'Failed to create payment link. Please try again.');
        }
      }

      // 2️⃣ Non-iOS → Create order and use Razorpay popup
      const orderResponse = await api.payments.createOrder(
        amount,
        paymentFor,
        userDetails,
        metadata
      );

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Failed to create payment order');
      }

      const { orderId, amount: orderAmount, currency, key } =
        orderResponse.data;

      // 3️⃣ Non-iOS → Razorpay popup
      const options: RazorpayOptions = {
        key,
        amount: orderAmount,
        currency,
        name: 'Jeen Mata Temple Trust',
        description: `Payment for ${paymentFor}`,
        order_id: orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#DBAA38',
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await api.payments.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              toast({
                title: 'Payment Successful 🎉',
                description: 'Your payment was completed successfully.',
              });
              onSuccess(verifyResponse.data);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            toast({
              title: 'Payment Verification Failed',
              description: error.message,
              variant: 'destructive',
            });
            onFailure?.(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment.',
              variant: 'destructive',
            });
            onFailure?.(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: 'Payment Error',
        description: error.message || 'Unable to initiate payment',
        variant: 'destructive',
      });
      onFailure?.(error);
    }
  };

  return { initiatePayment };
};
