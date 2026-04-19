const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// PayUmoney credentials from environment variables
const MERCHANT_KEY = process.env.MERCHANT_KEY || 'YOUR_MERCHANT_KEY';
const MERCHANT_SALT = process.env.MERCHANT_SALT || 'YOUR_MERCHANT_SALT';
const MERCHANT_ID = process.env.MERCHANT_ID || 'YOUR_MERCHANT_ID';

// Generate payment hash
app.post('/api/payment/generate-hash', (req, res) => {
  try {
    const { txnId, amount, productInfo, firstName, email, phone } = req.body;

    if (!txnId || !amount || !productInfo || !firstName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashString = `${MERCHANT_KEY}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${MERCHANT_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.json({
      success: true,
      hash: hash,
      merchantKey: MERCHANT_KEY,
      merchantId: MERCHANT_ID
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    res.status(500).json({ error: 'Failed to generate hash' });
  }
});

// Payment success callback
app.post('/api/payment/success', (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

    const verifyHashString = `${MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${MERCHANT_KEY}`;
    const verifyHash = crypto.createHash('sha512').update(verifyHashString).digest('hex');

    if (hash === verifyHash) {
      console.log('Payment successful:', txnid);
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        transactionId: txnid
      });
    } else {
      console.log('Hash mismatch - possible tampering');
      res.status(400).json({ error: 'Invalid hash' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Payment failure callback
app.post('/api/payment/failure', (req, res) => {
  try {
    const { txnid, status } = req.body;
    console.log('Payment failed:', txnid, status);
    
    res.json({
      success: false,
      message: 'Payment failed',
      transactionId: txnid
    });
  } catch (error) {
    console.error('Payment failure handler error:', error);
    res.status(500).json({ error: 'Failed to process payment failure' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PayUmoney backend server running on port ${PORT}`);
});
