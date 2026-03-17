import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Added signOut
import { useAuthStore } from '../store/auth-store';
import type { User, UserRole } from '../lib/types';

export const useAuthSync = () => {
  const { data: session, status } = useSession();
  const { setUser, setTokens, logout } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    // 1. CHECK FOR REFRESH ERRORS (AUTOMATIC LOGOUT)
    if (session?.error === "RefreshAccessTokenError") {
      console.warn("Session expired detected. Logging out...");
      logout(); // Clear Zustand store
      signOut({ callbackUrl: '/login?error=SessionExpired' }); // Clear NextAuth session
      return;
    }

    // 2. HANDLE AUTHENTICATED STATE
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
    } 
    
    // 3. HANDLE EXPLICIT UNAUTHENTICATED STATE
    else if (status === 'unauthenticated' && hasInitialized.current) {
      logout();
      hasInitialized.current = false;
    }
  }, [session, status, setUser, setTokens, logout]);

  return { session, status };
};