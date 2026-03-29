import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar as CalendarIcon, Pause, Play, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/context/auth';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function ActiveSubscriptions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pausedDates, setPausedDates] = useState<string[]>([]);
  const [rescheduledDates, setRescheduledDates] = useState<{[key: string]: string}>({});
  const [selectedPauseDates, setSelectedPauseDates] = useState<string[]>([]);
  const [rescheduleMode, setRescheduleMode] = useState<{from: string | null, to: string | null}>({from: null, to: null});
  const [skipCount, setSkipCount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadSubscriptions();
  }, [user]);

  useEffect(() => {
    if (selectedSubscription) {
      loadPausedDates();
    }
  }, [selectedSubscription]);

  const loadSubscriptions = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    setSubscriptions(data || []);
    if (data && data.length > 0) {
      setSelectedSubscription(data[0]);
    }
    setLoading(false);
  };

  const loadPausedDates = async () => {
    if (!user || !selectedSubscription) return;
    
    const { data: paused } = await supabase
      .from('subscription_paused_dates')
      .select('*')
      .eq('subscription_id', selectedSubscription.id)
      .gte('pause_date', new Date().toISOString().split('T')[0]);
    
    const pausedList = (paused || []).map(p => p.pause_date);
    const rescheduledMap: {[key: string]: string} = {};
    
    (paused || []).forEach(p => {
      if (p.rescheduled_to) {
        rescheduledMap[p.pause_date] = p.rescheduled_to;
      }
    });
    
    setPausedDates(pausedList);
    setRescheduledDates(rescheduledMap);
    setSkipCount(pausedList.length);
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

  const isWithinSubscription = (dateStr: string) => {
    if (!selectedSubscription) return false;
    const date = new Date(dateStr);
    const start = new Date(selectedSubscription.start_date);
    const end = new Date(selectedSubscription.end_date);
    return date >= start && date <= end;
  };

  const isWithin15DaysBracket = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 15;
  };

  const handleDateClick = (dateStr: string) => {
    if (!isWithinSubscription(dateStr)) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (dateStr < today) return;

    // Reschedule mode
    if (rescheduleMode.from) {
      if (!isWithin15DaysBracket(rescheduleMode.from, dateStr)) {
        alert('Rescheduled date must be within 15 days of original date');
        return;
      }
      setRescheduleMode({ from: rescheduleMode.from, to: dateStr });
      return;
    }

    // Pause mode
    if (selectedPauseDates.includes(dateStr)) {
      setSelectedPauseDates(selectedPauseDates.filter(d => d !== dateStr));
    } else {
      if (skipCount + selectedPauseDates.length >= 5) {
        alert('Maximum 5 dates can be paused');
        return;
      }
      setSelectedPauseDates([...selectedPauseDates, dateStr]);
    }
  };

  const handlePauseDates = async () => {
    if (!user || !selectedSubscription || selectedPauseDates.length === 0) return;

    const records = selectedPauseDates.map(date => ({
      subscription_id: selectedSubscription.id,
      user_id: user.id,
      pause_date: date,
    }));

    await supabase.from('subscription_paused_dates').insert(records);
    setSelectedPauseDates([]);
    loadPausedDates();
    alert('Dates paused successfully!');
  };

  const handleResumeDates = async () => {
    if (!user || !selectedSubscription || selectedPauseDates.length === 0) return;

    await supabase
      .from('subscription_paused_dates')
      .delete()
      .eq('subscription_id', selectedSubscription.id)
      .in('pause_date', selectedPauseDates);

    setSelectedPauseDates([]);
    loadPausedDates();
    alert('Dates resumed successfully!');
  };

  const startReschedule = (dateStr: string) => {
    setRescheduleMode({ from: dateStr, to: null });
  };

  const confirmReschedule = async () => {
    if (!user || !selectedSubscription || !rescheduleMode.from || !rescheduleMode.to) return;

    await supabase
      .from('subscription_paused_dates')
      .update({ rescheduled_to: rescheduleMode.to })
      .eq('subscription_id', selectedSubscription.id)
      .eq('pause_date', rescheduleMode.from);

    setRescheduleMode({ from: null, to: null });
    loadPausedDates();
    alert('Date rescheduled successfully!');
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button onClick={() => navigate('/account')} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Button>
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscriptions</h2>
            <p className="text-gray-600 mb-6">You don't have any active subscriptions yet.</p>
            <Button onClick={() => navigate('/')} className="bg-orange-600 hover:bg-orange-700">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => navigate('/account')} variant="ghost" className="mb-3 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Subscriptions</h1>
          <p className="text-gray-600 text-sm mt-1">Pause or reschedule your deliveries</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription List */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-bold text-gray-900 mb-3">Active Subscriptions</h2>
                <div className="space-y-2">
                  {subscriptions.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubscription(sub)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedSubscription?.id === sub.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900">{sub.product_name}</p>
                      <p className="text-xs text-gray-600">
                        {sub.duration === 'week' ? 'Weekly' : 'Monthly'} • ₹{sub.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Pause & Reschedule Rules</p>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li>• Maximum 5 dates can be paused</li>
                  <li>• Reschedule within 15 days bracket</li>
                  <li>• Changes apply to future dates only</li>
                  <li>• Paused dates: {skipCount}/5 used</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 md:p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="px-3 py-1.5 hover:bg-gray-100 rounded-lg font-semibold text-sm text-gray-700"
                  >
                    ← Prev
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="px-3 py-1.5 hover:bg-gray-100 rounded-lg font-semibold text-sm text-gray-700"
                  >
                    Next →
                  </button>
                </div>

                {/* Reschedule Mode Banner */}
                {rescheduleMode.from && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Rescheduling: {rescheduleMode.from}
                    </p>
                    <p className="text-xs text-blue-700 mb-2">
                      {rescheduleMode.to ? `New date: ${rescheduleMode.to}` : 'Select a new date within 15 days'}
                    </p>
                    <div className="flex gap-2">
                      {rescheduleMode.to && (
                        <Button size="sm" onClick={confirmReschedule} className="text-xs">
                          Confirm Reschedule
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRescheduleMode({ from: null, to: null })}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Calendar Grid */}
                <div className="mb-4">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = formatDate(year, month, day);
                      const isPast = dateStr < today;
                      const isPaused = pausedDates.includes(dateStr);
                      const isRescheduled = rescheduledDates[dateStr];
                      const isSelected = selectedPauseDates.includes(dateStr);
                      const isWithinSub = isWithinSubscription(dateStr);
                      const isRescheduleTarget = rescheduleMode.to === dateStr;

                      let bgColor = 'bg-white border-2 border-gray-200';
                      let textColor = 'text-gray-900';
                      let cursor = 'cursor-pointer hover:border-orange-300';

                      if (isPast || !isWithinSub) {
                        bgColor = 'bg-gray-50';
                        textColor = 'text-gray-300';
                        cursor = 'cursor-not-allowed';
                      } else if (isRescheduleTarget) {
                        bgColor = 'bg-blue-500 border-blue-600';
                        textColor = 'text-white';
                      } else if (isSelected) {
                        bgColor = 'bg-orange-500 border-orange-600';
                        textColor = 'text-white';
                      } else if (isRescheduled) {
                        bgColor = 'bg-green-100 border-green-400';
                        textColor = 'text-green-800';
                      } else if (isPaused) {
                        bgColor = 'bg-red-100 border-red-400';
                        textColor = 'text-red-800';
                      }

                      return (
                        <div key={day} className="relative">
                          <button
                            onClick={() => handleDateClick(dateStr)}
                            disabled={isPast || !isWithinSub}
                            className={`w-full aspect-square rounded-lg text-sm font-medium transition-all ${bgColor} ${textColor} ${cursor}`}
                          >
                            {day}
                          </button>
                          {isRescheduled && (
                            <button
                              onClick={() => startReschedule(dateStr)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[8px] flex items-center justify-center"
                              title="Reschedule"
                            >
                              ↻
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-orange-500" />
                    <span className="text-gray-600">Selected to Pause</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-400" />
                    <span className="text-gray-600">Paused</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-400" />
                    <span className="text-gray-600">Rescheduled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-blue-500" />
                    <span className="text-gray-600">New Date</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {selectedPauseDates.length > 0 && (
                    <>
                      <Button
                        onClick={handlePauseDates}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause {selectedPauseDates.length} Date{selectedPauseDates.length > 1 ? 's' : ''}
                      </Button>
                      <Button
                        onClick={handleResumeDates}
                        variant="outline"
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
