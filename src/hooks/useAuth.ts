import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, []);

  const handleQuickLogin = async () => {
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'advocate@lawxygen.com', password: 'Lawyer@123' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      if (data.user) setUser(data.user);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return { user, authLoading, authError, handleQuickLogin, handleLogout };
}
