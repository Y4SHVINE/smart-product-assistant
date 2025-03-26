'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser, setLoading } from '@/store/slices/authSlice';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(setLoading(true));

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          // Refresh the session to ensure it's valid
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            throw refreshError;
          }

          if (refreshedSession) {
            dispatch(setUser(refreshedSession.user));
          } else {
            dispatch(setUser(null));
          }
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error('Error getting session:', error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        dispatch(setUser(session?.user || null));
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null));
        router.push('/auth/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router]);

  return <>{children}</>;
} 