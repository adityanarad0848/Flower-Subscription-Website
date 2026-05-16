import { registerPlugin } from '@capacitor/core';

export interface RazorpayPlugin {
  open(options: RazorpayOptions): Promise<RazorpayResponse>;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  prefill_contact: string;
  prefill_email: string;
  prefill_name: string;
}

export interface RazorpayResponse {
  success: boolean;
  payment_id?: string;
  order_id?: string;
  signature?: string;
  error_code?: string;
  error_description?: string;
}

const RazorpayNative = registerPlugin<RazorpayPlugin>('RazorpayNative');

export default RazorpayNative;
