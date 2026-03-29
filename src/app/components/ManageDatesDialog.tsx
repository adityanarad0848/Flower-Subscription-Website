import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Calendar, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ManageDatesDialogProps {
  open: boolean;
  onClose: () => void;
  subscriptionId: string;
  userId: string;
  endDate: string;
  pricePerDay: number;
  duration: 'week' | 'month';
}

export function ManageDatesDialog({ open, onClose, subscriptionId, userId, endDate, pricePerDay, duration }: ManageDatesDialogProps) {
  const [pausedDates, setPausedDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadPausedDates();
      setSelectedDates([]);
      setRangeStart(null);
      setRangeEnd(null);
    }
  }, [open, subscriptionId]);

  const loadPausedDates = async () => {
    const { data } = await supabase
      .from('subscription_paused_dates')
      .select('pause_date')
      .eq('subscription_id', subscriptionId)
      .eq('user_id', userId);
    
    setPausedDates((data || []).map(d => d.pause_date));
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const canGoPrevious = () => {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(currentMonth);
    firstDayOfCurrentMonth.setDate(1);
    const firstDayOfToday = new Date(today);
    firstDayOfToday.setDate(1);
    return firstDayOfCurrentMonth > firstDayOfToday;
  };

  const canGoNext = () => {
    const endDateObj = new Date(endDate);
    const lastDayOfCurrentMonth = new Date(currentMonth);
    lastDayOfCurrentMonth.setMonth(currentMonth.getMonth() + 1);
    lastDayOfCurrentMonth.setDate(0);
    return lastDayOfCurrentMonth < endDateObj;
  };

  const handleDateClick = (dateStr: string) => {
    if (pausedDates.includes(dateStr)) {
      // Already paused dates are locked
      return;
    }
    
    // Simple toggle - click to add/remove from selection
    if (selectedDates.includes(dateStr)) {
      // Remove from selection
      setSelectedDates(prev => prev.filter(d => d !== dateStr));
    } else {
      // Add to selection
      const maxPauseDays = duration === 'week' ? 2 : 15;
      if (selectedDates.length >= maxPauseDays) {
        alert(`⚠️ Maximum ${maxPauseDays} day${maxPauseDays > 1 ? 's' : ''} can be paused for ${duration === 'week' ? '7-day trial' : 'monthly plan'}`);
        return;
      }
      setSelectedDates(prev => [...prev, dateStr]);
    }
  };

  const extendSubscription = async (daysToAdd: number) => {
    const currentEndDate = new Date(endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(currentEndDate.getDate() + daysToAdd);
    
    await supabase
      .from('user_subscriptions')
      .update({ end_date: newEndDate.toISOString().split('T')[0] })
      .eq('id', subscriptionId);
  };

  const addToWallet = async (amount: number) => {
    try {
      console.log('Adding to wallet:', { userId, amount });
      
      // Get or create wallet
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallets')
        .select('id, balance')
        .eq('user_id', userId)
        .maybeSingle();
      
      console.log('Wallet data:', walletData, 'Error:', walletError);
      
      if (walletData) {
        // Update wallet balance
        const newBalance = (walletData.balance || 0) + amount;
        console.log('Updating wallet balance to:', newBalance);
        
        const { error: updateError } = await supabase
          .from('user_wallets')
          .update({ balance: newBalance })
          .eq('id', walletData.id);
        
        if (updateError) {
          console.error('Wallet update error:', updateError);
          throw updateError;
        }
        
        // Add transaction record
        const { error: txError } = await supabase.from('wallet_transactions').insert({
          wallet_id: walletData.id,
          amount,
          type: 'credit',
          description: `Refund for ${selectedDates.length} paused delivery day${selectedDates.length > 1 ? 's' : ''}`
        });
        
        if (txError) {
          console.error('Transaction insert error:', txError);
        }
        
        console.log('Wallet updated successfully');
      } else {
        // Create wallet if doesn't exist
        console.log('Creating new wallet with balance:', amount);
        
        const { data: newWallet, error: createError } = await supabase
          .from('user_wallets')
          .insert({ user_id: userId, balance: amount })
          .select()
          .single();
        
        if (createError) {
          console.error('Wallet creation error:', createError);
          throw createError;
        }
        
        console.log('New wallet created:', newWallet);
        
        if (newWallet) {
          const { error: txError } = await supabase.from('wallet_transactions').insert({
            wallet_id: newWallet.id,
            amount,
            type: 'credit',
            description: `Refund for ${selectedDates.length} paused delivery day${selectedDates.length > 1 ? 's' : ''}`
          });
          
          if (txError) {
            console.error('Transaction insert error:', txError);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Add to wallet error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (selectedDates.length === 0) return;
    
    setLoading(true);
    
    try {
      // Insert pause records
      const records = selectedDates.map(date => ({
        subscription_id: subscriptionId,
        user_id: userId,
        pause_date: date,
      }));
      
      await supabase.from('subscription_paused_dates').insert(records);
      
      // Calculate refund amount
      const refundAmount = selectedDates.length * pricePerDay;
      console.log('=== REFUND CALCULATION ===');
      console.log('Selected dates:', selectedDates.length);
      console.log('Price per day:', pricePerDay);
      console.log('Refund amount:', refundAmount);
      console.log('User ID:', userId);
      
      // Add refund to wallet
      const walletSuccess = await addToWallet(refundAmount);
      
      console.log('Wallet update success:', walletSuccess);
      
      setLoading(false);
      setSelectedDates([]);
      setRangeStart(null);
      setRangeEnd(null);
      loadPausedDates();
      
      alert(`✅ Success!\n\n${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''} paused successfully!\n\nCalculation:\n${selectedDates.length} days × ₹${pricePerDay.toFixed(2)} = ₹${refundAmount.toFixed(2)}\n\n💰 Refund: ₹${refundAmount.toFixed(2)}\nAdded to your wallet!\n\nCheck your wallet tab to see the balance. 🎉`);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update dates. Please try again.');
      setLoading(false);
    }
  };

  if (!open) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Manage Deliveries</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Select dates to pause • {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-3 mb-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-green-900 mb-1.5">💰 Instant Wallet Refund</p>
                <ul className="text-green-800 space-y-0.5 text-xs">
                  <li>✓ Click any date to mark as "No Delivery" (turns red)</li>
                  <li>✓ Click again to unmark</li>
                  <li>✓ Each day = ₹{pricePerDay.toFixed(2)}</li>
                  <li>✓ Max pause: {duration === 'week' ? '2 days' : '15 days'}</li>
                  <li className="text-red-700 font-semibold">⚠️ Paused dates are locked</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={goToPreviousMonth}
              disabled={!canGoPrevious()}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              ← Previous
            </Button>
            <span className="font-bold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              onClick={goToNextMonth}
              disabled={!canGoNext()}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Next →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {/* Calendar dates */}
            {(() => {
              const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
              const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
              const startPadding = firstDay.getDay();
              const daysInMonth = lastDay.getDate();
              const today = new Date().toISOString().split('T')[0];
              const endDateObj = new Date(endDate);
              
              const cells = [];
              
              // Empty cells before month starts
              for (let i = 0; i < startPadding; i++) {
                cells.push(<div key={`empty-${i}`} className="p-2" />);
              }
              
              // Actual dates
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dateObj = new Date(dateStr);
                const isPaused = pausedDates.includes(dateStr);
                const isSelected = selectedDates.includes(dateStr);
                const isToday = dateStr === today;
                const isPast = dateObj < new Date(today);
                const isBeyondEnd = dateObj > endDateObj;
                const isDisabled = isPast || isBeyondEnd;
                
                let bgColor = 'bg-white border-2 border-gray-200 hover:border-orange-300';
                let textColor = 'text-gray-900';
                let cursor = 'cursor-pointer';
                
                if (isDisabled && !isPaused) {
                  bgColor = 'bg-gray-100 border-2 border-gray-200';
                  textColor = 'text-gray-400';
                  cursor = 'cursor-not-allowed';
                } else if (isPaused) {
                  bgColor = 'bg-red-500 border-2 border-red-600';
                  textColor = 'text-white';
                  cursor = 'cursor-not-allowed';
                } else if (isSelected) {
                  bgColor = 'bg-red-500 border-2 border-red-600 shadow-md';
                  textColor = 'text-white';
                } else if (isToday) {
                  bgColor = 'bg-green-50 border-2 border-green-300 hover:border-green-400';
                }

                cells.push(
                  <button
                    key={dateStr}
                    onClick={() => !isDisabled && handleDateClick(dateStr)}
                    disabled={isDisabled || isPaused}
                    className={`p-2 rounded-xl text-center transition-all duration-200 ${bgColor} ${textColor} ${cursor} relative min-h-[60px] flex flex-col items-center justify-center`}
                  >
                    {isToday && !isPaused && !isDisabled && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    <div className="text-lg font-bold">
                      {day}
                    </div>
                    <div className="text-[9px] opacity-75 font-semibold mt-1">
                      {isPaused ? 'PAUSED' : isDisabled ? '' : `₹${pricePerDay.toFixed(0)}`}
                    </div>
                    {isPaused && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </button>
                );
              }
              
              return cells;
            })()}
          </div>

          {/* Selected Info */}
          {selectedDates.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900 text-lg">🚫 No Delivery:</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-red-600">{selectedDates.length}/{duration === 'week' ? 2 : 15}</span>
                  <button
                    onClick={() => {
                      setSelectedDates([]);
                      setRangeStart(null);
                      setRangeEnd(null);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">Days to pause:</span>
                  <span className="font-bold text-gray-900 text-lg">{selectedDates.length} days</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">Price per day:</span>
                  <span className="font-bold text-gray-900 text-lg">₹{pricePerDay.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-3 bg-green-100 rounded-lg border-2 border-green-400">
                  <div>
                    <span className="text-sm text-green-800 font-semibold">💰 Wallet Refund:</span>
                    <p className="text-xs text-green-700 mt-0.5">{selectedDates.length} days × ₹{pricePerDay.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-green-700 text-2xl">₹{(selectedDates.length * pricePerDay).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-600 text-center pt-1 bg-blue-50 py-2 rounded">
                  ✨ Refund will be added to your wallet instantly!
                </p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-gray-600">No Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-red-500 border-2 border-red-600" />
              <span className="text-gray-600">Already Paused (Locked)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-300" />
              <span className="text-gray-600">Today</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || selectedDates.length === 0}
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Saving...
                </span>
              ) : (
                `Confirm ${selectedDates.length > 0 ? `(${selectedDates.length})` : ''}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
