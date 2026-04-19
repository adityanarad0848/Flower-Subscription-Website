import { FileText, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function TermsAndConditions() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Evrydayy Flowers. By accessing and using our service, you agree to be bound by these Terms and Conditions. Please read them carefully before using our platform.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Evrydayy Flowers provides fresh puja flower delivery services. Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Daily fresh flower delivery</li>
              <li>Subscription-based and one-time purchases</li>
              <li>Collection of old flowers for composting</li>
              <li>Zero-waste eco-friendly service</li>
            </ul>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
            <p className="text-gray-600 leading-relaxed mb-3">As a user, you agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Notify us of any unauthorized use of your account</li>
              <li>Provide accurate delivery address and contact information</li>
            </ul>
          </section>

          {/* Subscriptions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Subscriptions & Payments</h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>4.1 Subscription Plans:</strong> We offer weekly and monthly subscription plans. You can choose the plan that best suits your needs.</p>
              <p><strong>4.2 Free Trial:</strong> New users are eligible for a 7-day free trial. After the trial period, your subscription will automatically renew unless cancelled.</p>
              <p><strong>4.3 Payment:</strong> All payments are processed securely through Razorpay. We accept UPI, credit/debit cards, and net banking.</p>
              <p><strong>4.4 Cancellation:</strong> You may cancel your subscription at any time from your account dashboard. Cancellations take effect at the end of the current billing cycle.</p>
            </div>
          </section>

          {/* Delivery Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Delivery Policy</h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>5.1 Delivery Time:</strong> Flowers are delivered between 6:00 AM and 9:00 AM daily.</p>
              <p><strong>5.2 Service Areas:</strong> We currently serve Pune and surrounding areas. Check our website for the complete list of serviceable locations.</p>
              <p><strong>5.3 Delivery Charges:</strong> All deliveries are free of charge.</p>
              <p><strong>5.4 Failed Delivery:</strong> If delivery fails due to incorrect address or unavailability, we will attempt redelivery. Additional charges may apply for multiple failed attempts.</p>
            </div>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Refund & Cancellation Policy</h2>
            <div className="space-y-3 text-gray-600">
              <p><strong>6.1 Refunds:</strong> Refunds are processed within 5-7 business days to the original payment method.</p>
              <p><strong>6.2 Quality Issues:</strong> If you receive flowers that don't meet our quality standards, contact us within 24 hours for a refund or replacement.</p>
              <p><strong>6.3 Subscription Cancellation:</strong> You can cancel your subscription anytime. No refunds for partial months.</p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Privacy & Data Protection</h2>
            <p className="text-gray-600 leading-relaxed">
              We respect your privacy and are committed to protecting your personal data. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your information.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Evrydayy Flowers shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our service. Our total liability shall not exceed the amount paid by you for the service.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-600">
              <p><strong>Email:</strong> support@mornify.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Hours:</strong> Mon-Sat: 6 AM - 8 PM, Sunday: 6 AM - 12 PM</p>
            </div>
          </section>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />
            <div>
              <h3 className="font-bold text-orange-900 mb-2">Important Notice</h3>
              <p className="text-orange-800 text-sm">
                By using Evrydayy Flowers, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
