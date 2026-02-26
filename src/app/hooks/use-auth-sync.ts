// hooks/use-auth-sync.ts
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '../store/auth-store';
import type { User, UserRole } from '../lib/types';

export const useAuthSync = () => {
  const { data: session, status } = useSession();
  const { setUser, setTokens, logout } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth sync - status:', status);
      console.log('Auth sync - session:', session);
    }
    
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role as UserRole,
        avatar: session.user.avatar === null ? undefined : session.user.avatar,
        status: 'ACTIVE',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUser(user);

      if (session.accessToken && session.refreshToken) {
        setTokens(session.accessToken, session.refreshToken);
      }
      
      hasInitialized.current = true;
    } else if (status === 'unauthenticated' && hasInitialized.current) {
      // Only logout if we were previously authenticated
      logout();
      hasInitialized.current = false;
    }
  }, [session, status, setUser, setTokens, logout]);

  return { session, status };
};