import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  product: any;
  duration: 'week' | 'month';
  onConfirm: (startDate: Date, endDate: Date) => void;
}

export function SubscriptionDialog({ open, onClose, product, duration, onConfirm }: SubscriptionDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!open) {
      setStartDate(undefined);
      setCurrentMonth(new Date());
    }
  }, [open]);

  const handleDateSelect = (date: Date) => {
    setStartDate(date);
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

  const getEndDate = () => {
    if (!startDate) return undefined;
    const endDate = new Date(startDate);
    if (duration === 'week') {
      endDate.setDate(endDate.getDate() + 6); // 7 days total
    } else {
      endDate.setDate(endDate.getDate() + 29); // 30 days total
    }
    return endDate;
  };

  const getSelectedDates = () => {
    if (!startDate) return [];
    const dates: string[] = [];
    const current = new Date(startDate);
    const durationDays = duration === 'week' ? 7 : 30;
    
    for (let i = 0; i < durationDays; i++) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleConfirm = () => {
    if (!startDate) return;
    const endDate = getEndDate();
    if (endDate) {
      onConfirm(startDate, endDate);
    }
    setStartDate(undefined);
    onClose();
  };

  const weeklyPrice = 0; // Free trial
  const monthlyPrice = product?.price ? product.price * 30 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select Start Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pb-4">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {product?.image_url && (
              <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            )}
            <div>
              <p className="font-bold text-base">{product?.name}</p>
              <p className="text-sm text-gray-600">
                {duration === 'week' ? '1 Week Free Trial' : `1 Month - ₹${monthlyPrice.toFixed(0)}`}
              </p>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">Select Start Date:</p>
            <p className="text-xs text-gray-500 mb-3">
              Subscription will run for {duration === 'week' ? '7 consecutive days' : '30 consecutive days'}
            </p>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3 px-2">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-bold text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-lg p-3 bg-white">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                  const startPadding = firstDay.getDay();
                  const daysInMonth = lastDay.getDate();
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const selectedDates = getSelectedDates();
                  
                  const cells = [];
                  
                  // Empty cells before month starts
                  for (let i = 0; i < startPadding; i++) {
                    cells.push(<div key={`empty-${i}`} className="p-2" />);
                  }
                  
                  // Actual dates
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dateObj = new Date(dateStr);
                    const isSelected = selectedDates.includes(dateStr);
                    const isToday = dateStr === today.toISOString().split('T')[0];
                    const isPast = dateObj < today;
                    const isDisabled = isPast;
                    
                    let bgColor = 'bg-white hover:bg-gray-100';
                    let textColor = 'text-gray-900';
                    let cursor = 'cursor-pointer';
                    
                    if (isDisabled) {
                      bgColor = 'bg-gray-50';
                      textColor = 'text-gray-300';
                      cursor = 'cursor-not-allowed';
                    } else if (isSelected) {
                      bgColor = 'bg-gradient-to-br from-green-500 to-emerald-600';
                      textColor = 'text-white font-bold';
                    } else if (isToday) {
                      bgColor = 'bg-green-50 hover:bg-green-100';
                      textColor = 'text-green-600 font-semibold';
                    }

                    cells.push(
                      <button
                        key={dateStr}
                        onClick={() => !isDisabled && handleDateSelect(dateObj)}
                        disabled={isDisabled}
                        className={`p-2 rounded-lg text-sm transition-all ${bgColor} ${textColor} ${cursor} relative`}
                      >
                        {day}
                        {isToday && !isSelected && (
                          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  }
                  
                  return cells;
                })()}
              </div>
            </div>
            
            {startDate && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-600 font-semibold">📅</span>
                  <span className="text-gray-700">
                    Your subscription will be active from <span className="font-bold text-green-600">{format(startDate, 'MMM dd')}</span> to <span className="font-bold text-green-600">{format(getEndDate()!, 'MMM dd, yyyy')}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Date Summary */}
          {startDate && getEndDate() && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-xl border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Start Date:</span>
                <span className="text-sm font-bold text-gray-900">{format(startDate, 'PPP')}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">End Date:</span>
                <span className="text-sm font-bold text-gray-900">{format(getEndDate()!, 'PPP')}</span>
              </div>
              <div className="pt-3 border-t border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Duration:</span>
                  <span className="text-sm font-bold text-gray-900">{duration === 'week' ? '7 days' : '30 days'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-orange-600">
                    {duration === 'week' ? 'FREE' : `₹${monthlyPrice.toFixed(0)}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!startDate}
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
