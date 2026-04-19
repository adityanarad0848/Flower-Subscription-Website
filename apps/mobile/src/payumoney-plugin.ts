import { registerPlugin } from '@capacitor/core';

export interface PayUMoneyPlugin {
  startPayment(options: PaymentOptions): Promise<PaymentResponse>;
}

export interface PaymentOptions {
  merchantKey: string;
  merchantId: string;
  txnId: string;
  amount: string;
  productInfo: string;
  firstName: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  isProduction?: boolean;
}

export interface PaymentResponse {
  status: 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  response?: string;
  message?: string;
}

const PayUMoney = registerPlugin<PayUMoneyPlugin>('PayUMoney');

export default PayUMoney;
