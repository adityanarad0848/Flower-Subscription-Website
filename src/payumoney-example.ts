import PayUMoney from './payumoney-plugin';

const MERCHANT_KEY = import.meta.env.VITE_PAYU_MERCHANT_KEY;
const MERCHANT_SALT = import.meta.env.VITE_PAYU_MERCHANT_SALT;
const MERCHANT_ID  = import.meta.env.VITE_PAYU_MERCHANT_ID;

async function generateHash(str: string): Promise<string> {
  const msgBuffer  = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export class PaymentService {
  async initiatePayment(orderDetails: {
    amount: string;
    productInfo: string;
    firstName: string;
    email: string;
    phone: string;
  }) {
    const txnId      = 'TXN' + Date.now();
    const hashString = `${MERCHANT_KEY}|${txnId}|${orderDetails.amount}|${orderDetails.productInfo}|${orderDetails.firstName}|${orderDetails.email}|||||||||||${MERCHANT_SALT}`;
    const hash       = await generateHash(hashString);

    const result = await PayUMoney.startPayment({
      merchantKey:  MERCHANT_KEY,
      merchantId:   MERCHANT_ID,
      txnId,
      amount:       orderDetails.amount,
      productInfo:  orderDetails.productInfo,
      firstName:    orderDetails.firstName,
      email:        orderDetails.email,
      phone:        orderDetails.phone,
      surl:         'https://www.payumoney.com/mobileapp/payumoney/success.php',
      furl:         'https://www.payumoney.com/mobileapp/payumoney/failure.php',
      hash,
      isProduction: false,
    });

    if (result.status === 'success') {
      return { success: true,  transactionId: result.transactionId, message: 'Payment successful' };
    } else if (result.status === 'cancelled') {
      return { success: false, message: 'Payment cancelled by user' };
    } else {
      return { success: false, message: result.message || 'Payment failed' };
    }
  }
}
