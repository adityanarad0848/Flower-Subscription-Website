import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

export function Subscriptions() {
  const plans = [
    {
      name: "Daily Delights",
      price: "₹1,999",
      period: "per month",
      popular: false,
      description: "Perfect for daily puja with fresh flowers every morning",
      features: [
        "Fresh puja flowers delivered daily",
        "Rotating seasonal varieties",
        "Free delivery",
        "Cancel anytime",
        "Eco-friendly packaging",
      ],
    },
    {
      name: "Weekly Wonders",
      price: "₹899",
      period: "per month",
      popular: true,
      description: "Our most popular plan for regular devotees",
      features: [
        "Fresh flowers twice a week",
        "Curated puja selections",
        "Free delivery",
        "Skip or pause anytime",
        "Eco-friendly packaging",
        "Priority customer support",
      ],
    },
    {
      name: "Weekend Bliss",
      price: "₹499",
      period: "per month",
      popular: false,
      description: "Ideal for weekend pujas and special occasions",
      features: [
        "Fresh flowers every Friday",
        "Traditional flower mix",
        "Free delivery",
        "Cancel anytime",
        "Eco-friendly packaging",
      ],
    },
  ];

  return (
    <div className="py-12 md:py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Choose Your Subscription Plan
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Flexible plans to fit your lifestyle. All plans include free delivery and can be paused or canceled anytime.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-orange-500 border-2 shadow-xl"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ or Guarantee Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">100% Satisfaction Guarantee</h3>
            <p className="text-gray-600 mb-6">
              Not happy with your flowers? We'll replace them or refund your money. No questions asked.
              We're committed to bringing divine blessings to your everyday rituals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">Contact Support</Button>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">View FAQ</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}