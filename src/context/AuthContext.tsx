import { createContext, useContext, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { loginWithTpu } from '../api/auth';
import type { User } from '../types';
import { clearSession, loadSession, saveSession } from '../utils/auth';

interface AuthCtx {
  user: User | null;
  login: (login: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const value: AuthCtx = {
    user,
    login: async (login, password, remember) => {
      const u = await loginWithTpu(login, password);
      saveSession(u, remember);
      setUser(u);
    },
    logout: () => { clearSession(); setUser(null); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside <AuthProvider>');
  return c;
}

/** Для страниц за RequireAuth: пользователь гарантированно есть */
export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('useUser called without an authenticated user');
  return user;
}

/** Обёртка для маршрутов: без входа отправляет на /login и запоминает, куда вернуться */
export function RequireAuth() {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  return <Outlet />;
}
