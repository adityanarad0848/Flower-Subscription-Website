import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button onClick={() => navigate('/')} className="mr-4 text-gray-600 hover:text-orange-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-orange-600">Mornify</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: May 15, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using Mornify's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700">
              Mornify provides a flower subscription service that delivers fresh flowers to your doorstep on a daily, weekly, or monthly basis. We reserve the right to modify or discontinue services at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Subscription Plans</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Subscriptions are billed in advance based on your selected plan</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided for unused subscription days</li>
              <li>Prices are subject to change with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Delivery</h2>
            <p className="text-gray-700 mb-4">
              We strive to deliver flowers at your preferred time. However, delivery times may vary due to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Weather conditions</li>
              <li>Traffic and road conditions</li>
              <li>Availability of delivery personnel</li>
              <li>Incorrect or incomplete address information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Quality Guarantee</h2>
            <p className="text-gray-700">
              We guarantee the freshness and quality of our flowers. If you're not satisfied with your delivery, please contact us within 24 hours for a replacement or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All payments must be made in advance</li>
              <li>We accept credit/debit cards, UPI, and net banking</li>
              <li>Failed payments may result in service suspension</li>
              <li>All prices are in Indian Rupees (INR)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cancellation and Refunds</h2>
            <p className="text-gray-700 mb-4">
              You may cancel your subscription at any time. Refund policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Full refund for unused subscription days</li>
              <li>Refunds processed within 7-10 business days</li>
              <li>No refund for delivered orders</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate delivery information</li>
              <li>Be available to receive deliveries</li>
              <li>Notify us of any address changes</li>
              <li>Not misuse our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700">
              Mornify shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the subscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700">
              For questions about these Terms of Service, contact us at:
            </p>
            <p className="text-gray-700 mt-2">
              Email: support@mornify.in<br />
              Phone: +91 8770423329
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
