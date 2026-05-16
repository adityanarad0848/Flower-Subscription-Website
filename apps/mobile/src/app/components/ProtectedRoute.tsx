import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in - redirect to phone auth
        navigate('/auth/phone', { replace: true });
        return;
      }

      // Check if user has verified phone
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile?.phone) {
        // No phone verified - redirect to phone auth
        navigate('/auth/phone', { replace: true });
        return;
      }

      // Check if user has address
      const { data: addresses } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!addresses || addresses.length === 0) {
        // No address - redirect to add address
        navigate('/address-map?from=auth', { replace: true });
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth/phone', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
