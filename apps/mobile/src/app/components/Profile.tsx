import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Camera, Phone, Mail, MapPin, Edit2, Loader } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/phone');
        return;
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: addressData } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      setProfile({
        ...profileData,
        email: user.email,
        user_id: user.id,
      });
      setName(profileData?.name || '');
      setPhone(profileData?.phone?.replace('+91', '') || '');
      setAddresses(addressData || []);
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setPhoneError('');
    
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      const response = await fetch('http://192.168.1.11:3000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setOtpSent(true);
    } catch (err: any) {
      setPhoneError(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    setPhoneError('');
    
    if (otp.length !== 6) {
      setPhoneError('Please enter the 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      
      const verifyResponse = await fetch('http://192.168.1.11:3000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone, otp })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'Invalid OTP');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_profiles').upsert({
        user_id: user.id,
        phone: fullPhone,
        updated_at: new Date().toISOString(),
      });

      setProfile({ ...profile, phone: fullPhone });
      setEditingPhone(false);
      setOtpSent(false);
      setOtp('');
    } catch (err: any) {
      setPhoneError(err.message || 'Failed to verify OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_profiles').upsert({
        user_id: user.id,
        name: name.trim(),
        updated_at: new Date().toISOString(),
      });

      setProfile({ ...profile, name: name.trim() });
      setEditingName(false);
    } catch (err) {
      console.error('Error updating name:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth/phone');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1 -ml-1 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-6 py-8 text-center border-b border-gray-100">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
            {(() => {
              try {
                if (profile?.name) {
                  return (profile.name.charAt(0) || 'U').toUpperCase();
                }
                return '👤';
              } catch (e) {
                return '👤';
              }
            })()}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {editingName ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-1 border-2 border-orange-500 rounded-lg text-center font-semibold focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleUpdateName}
              className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm font-semibold"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.name || 'Guest User'}
            </h2>
            <button
              onClick={() => setEditingName(true)}
              className="p-1 text-orange-500 hover:bg-orange-50 rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white mt-3 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
        
        {profile?.phone ? (
          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
            </div>
            <button
              onClick={() => setEditingPhone(true)}
              className="text-xs font-semibold text-orange-500"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-sm text-gray-400">Not added</p>
            </div>
            <button
              onClick={() => setEditingPhone(true)}
              className="text-xs font-semibold text-orange-500"
            >
              Add
            </button>
          </div>
        )}

        {profile?.email && (
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-white mt-3 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">Saved Addresses</h3>
          <button
            onClick={() => navigate('/address-map')}
            className="text-xs font-semibold text-orange-500"
          >
            + Add New
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                    {addr.is_default && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {addr.address_line1}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No saved addresses</p>
            <button
              onClick={() => navigate('/address-map')}
              className="text-xs font-semibold text-orange-500"
            >
              + Add your first address
            </button>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <div className="px-4 py-6">
        <button
          onClick={handleSignOut}
          className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Phone Edit Modal */}
      {editingPhone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {otpSent ? 'Verify Phone Number' : 'Update Phone Number'}
            </h3>

            {phoneError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {phoneError}
              </div>
            )}

            {!otpSent ? (
              <>
                <div className="flex gap-3 mb-4">
                  <div className="w-16 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🇮🇳</span>
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-semibold text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) setPhone(value);
                      }}
                      placeholder="Enter Phone Number"
                      className="w-full h-12 pl-14 pr-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      disabled={otpLoading}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setPhoneError('');
                      setPhone(profile?.phone?.replace('+91', '') || '');
                    }}
                    className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendOtp}
                    disabled={otpLoading || phone.length !== 10}
                    className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {otpLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">OTP sent to +91{phone}</p>
                <input
                  type="tel"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) setOtp(value);
                  }}
                  placeholder="Enter 6-digit OTP"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-gray-900 text-center text-xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-orange-500 mb-4"
                  disabled={otpLoading}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setPhoneError('');
                    }}
                    className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm"
                  >
                    Change Number
                  </button>
                  <button
                    onClick={handleVerifyPhone}
                    disabled={otpLoading || otp.length !== 6}
                    className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {otpLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
