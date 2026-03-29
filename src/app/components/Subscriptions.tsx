import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth';
import { supabase } from '../../lib/supabase';

export function Subscriptions() {
  const { user } = useAuth();
  const [pausedDates, setPausedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (user) loadPausedDates();
  }, [user]);

  const loadPausedDates = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('paused_deliveries')
      .select('pause_date')
      .eq('user_id', user.id)
      .gte('pause_date', new Date().toISOString().split('T')[0]);
    setPausedDates((data || []).map(d => d.pause_date));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const toggleDate = (dateStr: string) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleSave = async () => {
    if (!user || selectedDates.length === 0) return;
    await supabase.from('paused_deliveries').delete().eq('user_id', user.id).in('pause_date', selectedDates);
    const records = selectedDates.map(date => ({ user_id: user.id, pause_date: date }));
    await supabase.from('paused_deliveries').insert(records);
    setSelectedDates([]);
    loadPausedDates();
    alert('Delivery paused for selected dates!');
  };

  const plans = [
    {
      name: "Divine Essentials",
      price: "₹666",
      period: "per month",
      popular: false,
      description: "Perfect for daily puja with fresh flowers every morning",
      features: [
        "Fresh flowers delivered DAILY (7 days)",
        "100g premium flower mix per delivery",
        "Free delivery in serviceable areas",
        "Pause delivery anytime",
        "Eco-friendly packaging",
        "WhatsApp order updates",
      ],
    },
    {
      name: "Devotee's Choice",
      price: "₹899",
      period: "per month",
      popular: true,
      description: "Most loved plan - Premium flowers with exclusive benefits",
      features: [
        "Fresh flowers delivered DAILY (7 days)",
        "150g premium flower mix per delivery (50% MORE)",
        "FREE Priority delivery slot (6-8 AM)",
        "Pause/Skip delivery anytime",
        "Premium eco-friendly packaging",
        "Dedicated customer support on WhatsApp",
        "Festival special flowers included FREE",
        "Exclusive seasonal varieties",
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

      {/* Pause Delivery Calendar Section - MOVED HERE */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <button
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full text-center mb-8 hover:opacity-80 transition-opacity"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4 hover:bg-orange-200 transition-colors">
            <CalendarIcon className="w-7 h-7 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Manage Your Deliveries</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            {calendarOpen ? 'Click to close calendar' : 'Click to open calendar and pause delivery dates'}
          </p>
        </button>

        {calendarOpen && (
          <div className="animate-in slide-in-from-top duration-300">
            {!user ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 mb-6">Please login to manage your delivery schedule</p>
                  <Button
                    onClick={() => window.location.href = '/auth'}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                  >
                    Login to Continue
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="px-4 py-2 hover:bg-gray-100 rounded-lg font-semibold text-gray-700"
                    >
                      ← Prev
                    </button>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="px-4 py-2 hover:bg-gray-100 rounded-lg font-semibold text-gray-700"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                        const today = new Date().toISOString().split('T')[0];
                        const days = [];

                        // Empty cells
                        for (let i = 0; i < startingDayOfWeek; i++) {
                          days.push(<div key={`empty-${i}`} />);
                        }

                        // Days
                        for (let i = 1; i <= daysInMonth; i++) {
                          const dateStr = formatDate(year, month, i);
                          const isPast = dateStr < today;
                          const isPaused = pausedDates.includes(dateStr);
                          const isSelected = selectedDates.includes(dateStr);

                          days.push(
                            <button
                              key={i}
                              onClick={() => !isPast && toggleDate(dateStr)}
                              disabled={isPast}
                              className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                                isPast
                                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                  : isSelected
                                  ? 'bg-orange-500 text-white shadow-md scale-105'
                                  : isPaused
                                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                  : 'bg-white text-gray-900 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        return days;
                      })()}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 justify-center mb-6 pb-6 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-orange-500" />
                      <span className="text-sm text-gray-600">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-red-100 border-2 border-red-300" />
                      <span className="text-sm text-gray-600">Paused</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-white border-2 border-gray-200" />
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>

                  {/* Save button */}
                  {selectedDates.length > 0 && (
                    <Button
                      onClick={handleSave}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-6 text-base"
                    >
                      Pause Delivery for {selectedDates.length} {selectedDates.length === 1 ? 'Day' : 'Days'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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