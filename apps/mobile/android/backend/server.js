const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// PayUmoney credentials from environment variables
const MERCHANT_KEY = process.env.MERCHANT_KEY || 'YOUR_MERCHANT_KEY';
const MERCHANT_SALT = process.env.MERCHANT_SALT || 'YOUR_MERCHANT_SALT';
const MERCHANT_ID = process.env.MERCHANT_ID || 'YOUR_MERCHANT_ID';

// Gupshup API credentials
const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY;
const GUPSHUP_APP_NAME = process.env.GUPSHUP_APP_NAME;

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

// Gupshup WhatsApp OTP endpoints
app.post('/api/otp/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !phoneNumber.startsWith('+91')) {
      return res.status(400).json({ error: 'Valid Indian phone number required (+91XXXXXXXXXX)' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = { otp, expiresAt };

    // Send WhatsApp OTP via Gupshup using approved template
    const response = await axios.post(
      'https://api.gupshup.io/wa/api/v1/template/msg',
      new URLSearchParams({
        channel: 'whatsapp',
        source: '917834811114',
        destination: phoneNumber.replace('+', ''),
        'template': JSON.stringify({
          id: 'mornify_otp',
          params: [otp]
        })
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': GUPSHUP_API_KEY
        }
      }
    );

    console.log('OTP sent via Gupshup WhatsApp:', phoneNumber, otp, response.data);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Gupshup WhatsApp OTP send error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send OTP', details: error.response?.data });
  }
});

app.post('/api/otp/verify', (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone and OTP required' });
    }

    const stored = global.otpStore?.[phoneNumber];
    if (!stored) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > stored.expiresAt) {
      delete global.otpStore[phoneNumber];
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    delete global.otpStore[phoneNumber];
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
