import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { useAuth } from '@/app/context/auth';
import { supabase } from '../../lib/supabase';

export default function PauseDelivery() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pausedDates, setPausedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    loadPausedDates();
  }, [user]);

  const loadPausedDates = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('paused_deliveries')
      .select('pause_date')
      .eq('user_id', user.id)
      .gte('pause_date', new Date().toISOString().split('T')[0]);
    setPausedDates((data || []).map(d => d.pause_date));
    setLoading(false);
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
    
    // Get subscription details to calculate daily price
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, product_id, products(price)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const dailyPrice = subscriptions?.products?.price || 0;
    const refundAmount = dailyPrice * selectedDates.length;

    // Delete old selections
    await supabase
      .from('paused_deliveries')
      .delete()
      .eq('user_id', user.id)
      .in('pause_date', selectedDates);

    // Insert new paused dates
    const records = selectedDates.map(date => ({
      user_id: user.id,
      pause_date: date,
    }));
    
    await supabase.from('paused_deliveries').insert(records);

    // Add refund to wallet
    if (refundAmount > 0) {
      // Get current wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        // Update existing wallet
        await supabase
          .from('wallets')
          .update({ balance: wallet.balance + refundAmount })
          .eq('user_id', user.id);
      } else {
        // Create new wallet
        await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: refundAmount });
      }

      // Add transaction record
      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        amount: refundAmount,
        type: 'credit',
        description: `Refund for ${selectedDates.length} paused delivery day(s)`,
      });
    }
    
    alert(`Delivery paused for ${selectedDates.length} day(s)! ₹${refundAmount.toFixed(2)} added to your wallet.`);
    navigate(-1);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Pause Delivery</h1>
        </div>
        {selectedDates.length > 0 && (
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-orange-600"
          >
            Save ({selectedDates.length})
          </button>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Info card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Select dates</span> when you don't want flower delivery. Tap dates to pause, tap again to resume.
          </p>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ←
          </button>
          <h2 className="text-lg font-bold text-gray-900">
            {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            →
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(year, month, day);
              const isPast = dateStr < today;
              const isPaused = pausedDates.includes(dateStr);
              const isSelected = selectedDates.includes(dateStr);

              return (
                <button
                  key={day}
                  onClick={() => !isPast && toggleDate(dateStr)}
                  disabled={isPast}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-orange-500 text-white shadow-md'
                      : isPaused
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-50 text-gray-900 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Legend</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500" />
            <span className="text-sm text-gray-700">Selected to pause</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100 border border-red-300" />
            <span className="text-sm text-gray-700">Already paused</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-50 border border-gray-200" />
            <span className="text-sm text-gray-700">Active delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
