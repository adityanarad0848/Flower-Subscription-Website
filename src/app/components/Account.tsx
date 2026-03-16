import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AddressManager } from './AddressManager';
import { format } from 'date-fns';
import { Package, Wallet as WalletIcon, User, ShoppingBag, MapPin } from 'lucide-react';

interface UserProfile {
  full_name: string;
  phone: string;
  address: string;
}

interface Wallet {
  balance: number;
}

interface ActivePlan {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  paused_at: string | null;
  product_name: string;
  price: number;
  duration: string;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  delivery_date: string;
  items: any[];
}

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [activePlans, setActivePlans] = useState<ActivePlan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUser(user);
    
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(profileData);
    
    const { data: walletData } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setWallet(walletData);
    
    const { data: plansData } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false });
    setActivePlans(plansData || []);
    
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(ordersData || []);
  };

  const addMoney = async () => {
    const amount = parseFloat(addAmount);
    if (amount < 500 || amount > 2000) {
      alert('Amount must be between Rs.500 and Rs.2000');
      return;
    }
    
    setLoading(true);
    const { data: walletData } = await supabase
      .from('user_wallets')
      .select('id, balance')
      .eq('user_id', user.id)
      .single();
    
    if (walletData) {
      await supabase
        .from('user_wallets')
        .update({ balance: walletData.balance + amount })
        .eq('id', walletData.id);
      
      await supabase.from('wallet_transactions').insert({
        wallet_id: walletData.id,
        amount,
        type: 'credit',
        description: 'Wallet top-up'
      });
      
      await loadUserData();
      setAddAmount('');
    }
    setLoading(false);
  };

  const togglePause = async (planId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const paused_at = newStatus === 'paused' ? new Date().toISOString() : null;
    
    await supabase
      .from('user_subscriptions')
      .update({ status: newStatus, paused_at })
      .eq('id', planId);
    
    await loadUserData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!user) return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Please login</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-white">Account</h1>
      </div>

      {/* Content */}
      <div className="-mt-12 px-4 pb-6">
        {/* Tabs Card */}
        <Card className="mb-4 shadow-lg">
          <CardContent className="p-2">
            <div className="grid grid-cols-5 gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-orange-50' : ''}`}
              >
                <User className={`w-5 h-5 mb-1 ${activeTab === 'profile' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'profile' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex flex-col items-center py-3 rounded-lg transition-colors ${activeTab === 'addresses' ? 'bg-orange-50' : ''}`}
              >
                <MapPin className={`w-5 h-5 mb-1 ${activeTab === 'addresses' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'addresses' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Address</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex flex-col items-center py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-orange-50' : ''}`}
              >
                <ShoppingBag className={`w-5 h-5 mb-1 ${activeTab === 'orders' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'orders' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex flex-col items-center py-3 rounded-lg transition-colors ${activeTab === 'wallet' ? 'bg-orange-50' : ''}`}
              >
                <WalletIcon className={`w-5 h-5 mb-1 ${activeTab === 'wallet' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'wallet' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Wallet</span>
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`flex flex-col items-center py-3 rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-orange-50' : ''}`}
              >
                <Package className={`w-5 h-5 mb-1 ${activeTab === 'plans' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'plans' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Plans</span>
              </button>
            </div>
          </CardContent>
        </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="text-base text-gray-900">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-base text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-base text-gray-900">{profile?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-base text-gray-900">{profile?.address || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50">Logout</Button>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && <AddressManager />}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">{format(new Date(order.created_at), 'PPP')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">₹{order.total?.toFixed(2) || '0.00'}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Delivery: {format(new Date(order.delivery_date), 'PPP')}</p>
                    {order.items && order.items.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items.map((item: any) => `${item.name} x${item.quantity}`).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-orange-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <p className="text-4xl font-bold">₹{wallet?.balance || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-3">
              <Input
                type="number"
                placeholder="Enter amount (500-2000)"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="500"
                max="2000"
                className="h-12 text-base"
              />
              <Button onClick={addMoney} disabled={loading} className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium">Add Money</Button>
              <p className="text-xs text-gray-500 text-center">Min: ₹500 | Max: ₹2000</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <Card>
          <CardHeader>
            <CardTitle>Active Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {activePlans.length === 0 ? (
              <p className="text-gray-600">No active plans</p>
            ) : (
              <div className="space-y-3">
                {activePlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{plan.product_name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{plan.duration}ly Subscription</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-semibold">{format(new Date(plan.start_date), 'PP')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">End Date</p>
                        <p className="font-semibold">{format(new Date(plan.end_date), 'PP')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-semibold text-orange-600">₹{plan.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => togglePause(plan.id, plan.status)}
                      variant={plan.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                    >
                      {plan.status === 'active' ? 'Pause Plan' : 'Resume Plan'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
