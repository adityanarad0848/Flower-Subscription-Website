import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the flower delivery service work?",
      answer: "We deliver fresh puja flowers to your doorstep every morning. You can choose between one-time purchases or subscribe for daily/weekly/monthly deliveries. Our delivery person will also collect your old flowers for composting."
    },
    {
      question: "What time will my flowers be delivered?",
      answer: "Flowers are delivered between 6 AM to 9 AM every morning to ensure maximum freshness for your puja."
    },
    {
      question: "Can I pause my subscription?",
      answer: "Yes! You can pause your subscription anytime from the 'My Subscriptions' page. Simply select the dates you want to skip."
    },
    {
      question: "What areas do you deliver to?",
      answer: "We currently serve all areas in Pune including Pimpri-Chinchwad, Kharadi, Viman Nagar, Hinjewadi, Wakad, Baner, Aundh, and more. We're expanding to Mumbai and Bangalore soon!"
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 7-day free trial for new subscribers. You can try our service risk-free for a week."
    },
    {
      question: "What happens to the old flowers?",
      answer: "We collect your old flowers during delivery and compost them, making our service 100% eco-friendly and zero waste."
    },
    {
      question: "Can I change my delivery address?",
      answer: "Yes, you can manage multiple addresses and change your delivery location anytime from the 'Manage Addresses' section."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Wallets through Razorpay."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from the 'My Subscriptions' page. No questions asked!"
    },
    {
      question: "Are the flowers fresh?",
      answer: "Absolutely! We source flowers daily from local markets and deliver them within hours to ensure maximum freshness."
    }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about our service</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="mb-6">Our support team is here to help you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@evrydayy.com"
              className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+919876543210"
              className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
