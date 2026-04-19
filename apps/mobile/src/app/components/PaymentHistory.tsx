import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Loader, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  order_id: string;
  payment_id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('id, payment_id, total, status, payment_method, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      completed: 'default',
      failed: 'destructive',
      pending: 'secondary',
      confirmed: 'default',
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No payment history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
      
      <div className="space-y-3">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        Order #{payment.id.slice(0, 8)}
                      </p>
                      <Badge variant={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {payment.payment_method.toUpperCase()}
                    </p>
                    {payment.payment_id && (
                      <p className="text-xs text-gray-500">
                        Payment ID: {payment.payment_id}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">
                    ₹{payment.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
