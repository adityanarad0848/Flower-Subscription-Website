import { Capacitor } from '@capacitor/core';
import RazorpayNative from './razorpay-native-plugin';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number; // in paise (multiply by 100)
  currency: string;
  name: string;
  description: string;
  orderId?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, any>;
}

export class RazorpayService {
  private loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async initiatePayment(options: RazorpayOptions): Promise<{
    success: boolean;
    paymentId?: string;
    orderId?: string;
    signature?: string;
    message?: string;
  }> {
    console.log('═══════════════════════════════════════════════════');
    console.log('[Razorpay Service] 🚀 PAYMENT INITIATED');
    console.log('═══════════════════════════════════════════════════');
    console.log('[Razorpay Service] Platform:', Capacitor.getPlatform());
    console.log('[Razorpay Service] Is Native Platform:', Capacitor.isNativePlatform());
    console.log('[Razorpay Service] Razorpay Key ID:', RAZORPAY_KEY_ID ? '✓ Present' : '✗ MISSING');
    console.log('[Razorpay Service] Payment Options:', {
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      orderId: options.orderId,
      notes: options.notes
    });
    
    if (Capacitor.isNativePlatform()) {
      console.log('[Razorpay Service] ✓ Using NATIVE Android SDK');
      
      try {
        const pluginOptions = {
          key: RAZORPAY_KEY_ID,
          amount: options.amount,
          currency: options.currency,
          name: options.name,
          description: options.description,
          prefill_contact: options.prefill.contact,
          prefill_email: options.prefill.email,
          prefill_name: options.prefill.name,
        };
        
        console.log('[Razorpay Service] 📤 Calling RazorpayNative.open() with options:', pluginOptions);
        console.log('[Razorpay Service] ⏳ Waiting for native plugin response...');
        
        const result = await RazorpayNative.open(pluginOptions);
        
        console.log('───────────────────────────────────────────────────');
        console.log('[Razorpay Service] 📥 Native Plugin Response Received');
        console.log('[Razorpay Service] Result:', JSON.stringify(result, null, 2));
        console.log('───────────────────────────────────────────────────');
        
        if (result.success) {
          console.log('[Razorpay Service] ✅ PAYMENT SUCCESS');
          console.log('[Razorpay Service] Payment ID:', result.payment_id);
          console.log('[Razorpay Service] Order ID:', result.order_id);
          console.log('[Razorpay Service] Signature:', result.signature ? '✓ Present' : '✗ Missing');
          return {
            success: true,
            paymentId: result.payment_id,
            orderId: result.order_id,
            signature: result.signature,
          };
        } else {
          console.log('[Razorpay Service] ❌ PAYMENT FAILED');
          console.log('[Razorpay Service] Error Code:', result.error_code);
          console.log('[Razorpay Service] Error Description:', result.error_description);
          
          // Format error message
          let errorMessage = result.error_description || 'Payment failed';
          if (errorMessage === 'undefined' || !errorMessage) {
            errorMessage = 'Payment cancelled';
          }
          
          return {
            success: false,
            message: errorMessage,
          };
        }
      } catch (error: any) {
        console.log('═══════════════════════════════════════════════════');
        console.error('[Razorpay Service] 💥 EXCEPTION CAUGHT');
        console.error('[Razorpay Service] Error Type:', error.constructor.name);
        console.error('[Razorpay Service] Error Message:', error.message);
        console.error('[Razorpay Service] Error Stack:', error.stack);
        console.error('[Razorpay Service] Full Error Object:', JSON.stringify(error, null, 2));
        console.log('═══════════════════════════════════════════════════');
        return {
          success: false,
          message: `Native plugin error: ${error.message}`,
        };
      }
    }
    
    // Should never reach here on Android
    console.error('[Razorpay Service] ⚠️ WARNING: Not on native platform!');
    console.error('[Razorpay Service] This should not happen on Android app');
    return {
      success: false,
      message: 'Native payment not available. Please use the Android app.',
    };
  }
}
