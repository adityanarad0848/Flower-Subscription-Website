import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

async function processTokens(accessToken: string, refreshToken: string, navigate: (path: string) => void) {
  const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error || !data.session) return;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', data.session.user.id)
    .single();
  if (!profile) {
    await supabase.from('user_profiles').insert({
      user_id: data.session.user.id,
      full_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || '',
      phone: data.session.user.phone || '',
      address: ''
    });
    await supabase.from('user_wallets').insert({ user_id: data.session.user.id, balance: 0 });
  }
  if (Capacitor.isNativePlatform()) await Browser.close();
  sessionStorage.setItem('splash_shown', '1');
  localStorage.setItem('splash_shown', '1');
  navigate('/');
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
      supabase.auth.getSession().then(({ data: { session } }) => navigate(session ? '/' : '/auth'));
    }
  }, [location, navigate]);

  return <div className="flex items-center justify-center min-h-screen">Signing you in...</div>;
}
