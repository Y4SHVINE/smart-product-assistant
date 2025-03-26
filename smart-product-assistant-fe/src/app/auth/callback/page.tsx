'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (user) {
          dispatch(setUser(user));
          router.push('/');
        }
      } catch (error) {
        console.error('Error during email confirmation:', error);
        router.push('/auth/signin');
      }
    };

    handleEmailConfirmation();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Confirming your email...</h2>
        <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
} 