import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

async function processTokens(accessToken: string, refreshToken: string, navigate: (path: string) => void) {
  const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error || !data.session) {
    console.error('Session error:', error);
    navigate('/auth/phone');
    return;
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', data.session.user.id)
    .single();
    
  if (!profile) {
    await supabase.from('user_profiles').insert({
      user_id: data.session.user.id,
      full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || '',
      phone: data.session.user.phone || '',
      address: ''
    });
    await supabase.from('user_wallets').insert({ user_id: data.session.user.id, balance: 0 });
  }
  
  if (Capacitor.isNativePlatform()) await Browser.close();
  
  sessionStorage.setItem('splash_shown', '1');
  localStorage.setItem('splash_shown', '1');
  
  // Check if user has addresses
  const { data: addresses } = await supabase
    .from('user_addresses')
    .select('id')
    .eq('user_id', data.session.user.id)
    .limit(1);

  if (!addresses || addresses.length === 0) {
    navigate('/address-map?from=auth', { replace: true });
  } else {
    navigate('/', { replace: true });
  }
}

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const searchParams = new URLSearchParams(location.search);
    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      processTokens(accessToken, refreshToken, navigate);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Session exists, check profile and redirect
          processTokens(session.access_token, session.refresh_token, navigate);
        } else {
          navigate('/auth/phone');
        }
      });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
