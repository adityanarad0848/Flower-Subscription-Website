import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (Capacitor.isNativePlatform()) {
          await Browser.close();
        }
        navigate('/');
      }
    });

    // Also check existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });

    return () => subscription.unsubscribe();
  }, []);

  return <div className="flex items-center justify-center min-h-screen">Signing you in...</div>;
}
