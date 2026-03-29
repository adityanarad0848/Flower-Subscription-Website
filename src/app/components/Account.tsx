import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AddressManager } from './AddressManager';
import { ManageDatesDialog } from './ManageDatesDialog';
import { format } from 'date-fns';
import { Package, Wallet as WalletIcon, User, ShoppingBag, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import PaymentHistory from './PaymentHistory';

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
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [activePlans, setActivePlans] = useState<ActivePlan[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [manageDatesOpen, setManageDatesOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  // Reload data when tab becomes visible (after placing order)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadUserData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadUserData = async () => {
    setDataLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setUser(user);
    
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(profileData);
    
    if (profileData) {
      setEditedProfile({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      });
    }
    
    // Load or create wallet
    const { data: walletData } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (walletData) {
      setWallet(walletData);
    } else {
      // Create wallet if doesn't exist
      const { data: newWallet } = await supabase
        .from('user_wallets')
        .insert({ user_id: user.id, balance: 0 })
        .select()
        .single();
      setWallet(newWallet || { balance: 0 });
    }
    
    const { data: plansData, error: plansError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false });
    
    if (plansError) {
      console.error('Error loading subscriptions:', plansError);
    }
    console.log('Loaded subscriptions:', plansData);
    setActivePlans(plansData || []);
    
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(ordersData || []);
    setDataLoading(false);
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
      .maybeSingle();
    
    if (walletData) {
      await supabase
        .from('user_wallets')
        .update({ balance: (walletData.balance || 0) + amount })
        .eq('id', walletData.id);
      
      await supabase.from('wallet_transactions').insert({
        wallet_id: walletData.id,
        amount,
        type: 'credit',
        description: 'Wallet top-up'
      });
    } else {
      // Create wallet
      const { data: newWallet } = await supabase
        .from('user_wallets')
        .insert({ user_id: user.id, balance: amount })
        .select()
        .single();
      
      if (newWallet) {
        await supabase.from('wallet_transactions').insert({
          wallet_id: newWallet.id,
          amount,
          type: 'credit',
          description: 'Wallet top-up'
        });
      }
    }
    
    await loadUserData();
    setAddAmount('');
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

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        full_name: editedProfile.full_name,
        phone: editedProfile.phone,
        address: editedProfile.address,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      alert('Failed to update profile: ' + error.message);
    } else {
      await loadUserData();
      setEditMode(false);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (profile) {
      setEditedProfile({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 px-4 pt-6 pb-20">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-3 text-white hover:bg-white/20 -ml-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-2xl font-bold text-white">My Account</h1>
        <p className="text-white/90 text-sm mt-1">Manage your profile and orders</p>
      </div>

      {/* Content */}
      <div className="-mt-12 px-4 pb-32">
        {/* Tabs Card */}
        <Card className="mb-4 shadow-lg border-0">
          <CardContent className="p-2">
            <div className="grid grid-cols-6 gap-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <User className={`w-5 h-5 mb-1 ${activeTab === 'profile' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'profile' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'addresses' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <MapPin className={`w-5 h-5 mb-1 ${activeTab === 'addresses' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'addresses' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Address</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'orders' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <ShoppingBag className={`w-5 h-5 mb-1 ${activeTab === 'orders' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'orders' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <WalletIcon className={`w-5 h-5 mb-1 ${activeTab === 'wallet' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'wallet' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Wallet</span>
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'plans' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <Package className={`w-5 h-5 mb-1 ${activeTab === 'plans' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'plans' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Plans</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex flex-col items-center py-3 rounded-lg transition-all ${activeTab === 'payments' ? 'bg-gradient-to-br from-orange-50 to-pink-50' : ''}`}
              >
                <CreditCard className={`w-5 h-5 mb-1 ${activeTab === 'payments' ? 'text-orange-600' : 'text-gray-400'}`} />
                <span className={`text-xs ${activeTab === 'payments' ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>Payments</span>
              </button>
            </div>
          </CardContent>
        </Card>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {dataLoading ? (
            <Card>
              <CardContent className="p-4 space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                {!editMode && (
                  <Button
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedProfile.full_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-base text-gray-900">{profile?.full_name || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-base text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  {editMode ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-base text-gray-900">{profile?.phone || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  {editMode ? (
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your address"
                      rows={3}
                    />
                  ) : (
                    <p className="text-base text-gray-900">{profile?.address || 'Not set'}</p>
                  )}
                </div>
                
                {editMode && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )}
          {!editMode && (
            <Button onClick={handleLogout} variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50">
              Logout
            </Button>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && <AddressManager />}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Order</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No orders yet</p>
                <p className="text-gray-500 text-sm">Your order history will appear here</p>
              </div>
            ) : (
              <div>
                {(() => {
                  const recentOrder = orders[0]; // Get only the most recent order
                  return (
                    <div key={recentOrder.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{recentOrder.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600">{format(new Date(recentOrder.created_at), 'PPP')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">₹{recentOrder.total?.toFixed(2) || '0.00'}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            recentOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            recentOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {recentOrder.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Delivery: {format(new Date(recentOrder.delivery_date), 'PPP')}</p>
                      {recentOrder.items && (() => {
                        try {
                          const items = typeof recentOrder.items === 'string' ? JSON.parse(recentOrder.items) : recentOrder.items;
                          if (Array.isArray(items) && items.length > 0) {
                            return (
                              <p className="text-sm text-gray-600 mt-1">
                                {items.map((item: any) => `${item.name} x${item.quantity}`).join(', ')}
                              </p>
                            );
                          }
                        } catch (e) {
                          console.error('Error parsing items:', e);
                        }
                        return null;
                      })()}
                    </div>
                  );
                })()}
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
              <p className="text-4xl font-bold">₹{(wallet?.balance || 0).toFixed(0)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && <PaymentHistory />}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <Card>
          <CardHeader>
            <CardTitle>Active Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            {activePlans.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No active plans</p>
                <p className="text-gray-500 text-sm">Subscribe to a plan to see it here</p>
              </div>
            ) : (
              <div>
                {(() => {
                  const recentPlan = activePlans[0]; // Get only the most recent plan
                  return (
                    <div key={recentPlan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{recentPlan.product_name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{recentPlan.duration === 'week' ? '1 Week Free Trial' : 'Monthly Subscription'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          recentPlan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {recentPlan.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Start Date & Time</p>
                          <p className="font-semibold">{format(new Date(recentPlan.start_date), 'PPP')}</p>
                          <p className="text-xs text-gray-500">{format(new Date(recentPlan.start_date), 'p')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">End Date</p>
                          <p className="font-semibold">{format(new Date(recentPlan.end_date), 'PP')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold text-orange-600">₹{recentPlan.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedPlanId(recentPlan.id);
                            setManageDatesOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Manage Dates
                        </Button>
                        <Button
                          onClick={() => togglePause(recentPlan.id, recentPlan.status)}
                          variant={recentPlan.status === 'active' ? 'destructive' : 'default'}
                          size="sm"
                          className="flex-1"
                        >
                          {recentPlan.status === 'active' ? 'Pause Plan' : 'Resume Plan'}
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>

      {/* Manage Dates Dialog */}
      {user && selectedPlanId && (() => {
        const plan = activePlans.find(p => p.id === selectedPlanId);
        if (!plan) return null;
        
        // Calculate days based on start and end date for accurate calculation
        const startDate = new Date(plan.start_date);
        const endDate = new Date(plan.end_date);
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const days = daysDiff > 0 ? daysDiff : (plan.duration === 'week' ? 2 : 30);
        
        // Calculate price per day - if plan.price is 0, use product price from database
        let pricePerDay = 0;
        if (plan.price > 0) {
          pricePerDay = plan.price / days;
        } else {
          // Fallback: Get product price from database
          // For now use ₹20 as default, but this should be fetched from products table
          pricePerDay = 20;
        }
        
        console.log('=== PRICE CALCULATION ===');
        console.log('Plan:', plan);
        console.log('Start date:', plan.start_date);
        console.log('End date:', plan.end_date);
        console.log('Days difference:', daysDiff);
        console.log('Total price:', plan.price);
        console.log('Duration:', plan.duration);
        console.log('Days:', days);
        console.log('Price per day:', pricePerDay);
        
        return (
          <ManageDatesDialog
            open={manageDatesOpen}
            onClose={() => {
              setManageDatesOpen(false);
              loadUserData();
            }}
            subscriptionId={selectedPlanId}
            userId={user.id}
            endDate={plan.end_date}
            pricePerDay={pricePerDay}
            duration={plan.duration as 'week' | 'month'}
          />
        );
      })()}
    </div>
  );
}
