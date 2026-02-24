// hooks/use-auth-sync.ts
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '../store/auth-store';
import type { User, UserRole } from '../lib/types';

export const useAuthSync = () => {
  const { data: session, status } = useSession();
  const { setUser, setTokens, logout } = useAuthStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    console.log('Auth sync - status:', status);
    console.log('Auth sync - session:', session);
    
    // Don't do anything while loading
    if (status === 'loading') {
      console.log('Auth sync - still loading...');
      return;
    }

    // If we have a session, sync it
    if (status === 'authenticated' && session?.user) {
      console.log('Auth sync - syncing authenticated user');
      
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
        console.log('Auth sync - setting tokens');
        setTokens(session.accessToken, session.refreshToken);
      }
      
      hasSynced.current = true;
    } 
    // Only logout if we were previously authenticated and now we're not
    else if (status === 'unauthenticated' && hasSynced.current) {
      console.log('Auth sync - session lost, logging out');
      logout();
      hasSynced.current = false;
    }
  }, [session, status, setUser, setTokens, logout]);

  return { session, status };
};