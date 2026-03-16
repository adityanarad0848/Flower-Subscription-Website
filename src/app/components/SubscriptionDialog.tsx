import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { addWeeks, addMonths, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  product: any;
  duration: 'week' | 'month';
  onConfirm: (startDate: Date, endDate: Date) => void;
}

export function SubscriptionDialog({ open, onClose, product, duration, onConfirm }: SubscriptionDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (!open) {
      setDateRange(undefined);
    }
  }, [open]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      const endDate = duration === 'week' 
        ? addWeeks(range.from, 1).setDate(range.from.getDate() + 6) && new Date(range.from.getTime() + 6 * 24 * 60 * 60 * 1000)
        : new Date(range.from.getTime() + 29 * 24 * 60 * 60 * 1000);
      setDateRange({ from: range.from, to: endDate });
    } else {
      setDateRange(undefined);
    }
  };

  const handleConfirm = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    onConfirm(dateRange.from, dateRange.to);
    setDateRange(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Start Date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold">{product?.name}</p>
            <p className="text-xs text-gray-600">Duration: {duration === 'week' ? '1 Week' : '1 Month'}</p>
          </div>
          <div className="flex justify-center">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
              numberOfMonths={1}
            />
          </div>
          {dateRange?.from && dateRange?.to && (
            <div className="bg-orange-50 p-3 rounded text-sm border border-orange-200">
              <p><strong>Start:</strong> {format(dateRange.from, 'PPP')}</p>
              <p><strong>End:</strong> {format(dateRange.to, 'PPP')}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={() => setDateRange(undefined)}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!dateRange?.from}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
