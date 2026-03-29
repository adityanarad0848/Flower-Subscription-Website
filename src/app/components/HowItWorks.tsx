import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Link, useNavigate } from "react-router";
import { ArrowLeft,
  Package, 
  Truck, 
  Smile, 
  Calendar,
  Shield,
  Leaf,
  Clock,
  MapPin 
} from "lucide-react";

export function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    {
      number: "01",
      icon: Package,
      title: "Choose Your Plan",
      description: "Select from our flexible subscription plans that fit your lifestyle and budget. Whether you want daily blooms or weekly deliveries, we've got you covered.",
    },
    {
      number: "02",
      icon: Calendar,
      title: "Set Your Preferences",
      description: "Tell us your favorite flowers, colors, and delivery schedule. You can update your preferences anytime through your account.",
    },
    {
      number: "03",
      icon: Truck,
      title: "We Deliver Fresh Flowers",
      description: "Our team handpicks and arranges your flowers each morning. We deliver them fresh to your door at your preferred time.",
    },
    {
      number: "04",
      icon: Smile,
      title: "Enjoy & Repeat",
      description: "Brighten your space with beautiful blooms. Your subscription continues automatically, and you can pause or modify anytime.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Freshness Guaranteed",
      description: "All flowers are sourced daily and delivered within hours of being cut.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Sustainable packaging and locally sourced flowers when possible.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Skip, pause, or modify your deliveries anytime with no penalty.",
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "We deliver to most areas with morning, afternoon, or evening slots.",
    },
  ];

  return (
    <div className="py-12 md:py-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 -ml-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          How It Works
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Fresh flowers delivered to your door in four simple steps
        </p>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-pink-100">
                      {step.number}
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 mb-4">
                    <step.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-pink-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Customers Love Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to quality, sustainability, and making your experience exceptional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 mb-4">
                    <benefit.icon className="w-7 h-7 text-pink-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Can I pause my subscription?</h3>
              <p className="text-sm text-gray-600">
                Yes! You can pause, skip, or cancel your subscription anytime from your account dashboard. No fees or penalties apply.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">What if I'm not home for delivery?</h3>
              <p className="text-sm text-gray-600">
                We'll leave your flowers in a safe location you specify, or you can arrange for a neighbor to receive them. You can also reschedule deliveries in advance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">How fresh are the flowers?</h3>
              <p className="text-sm text-gray-600">
                All our flowers are sourced daily from local growers when possible and delivered within hours of being cut. We guarantee freshness for at least 7 days with proper care.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Do you offer gift subscriptions?</h3>
              <p className="text-sm text-gray-600">
                Absolutely! Gift subscriptions are perfect for birthdays, anniversaries, or just to show someone you care. Contact us to set up a gift subscription.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
