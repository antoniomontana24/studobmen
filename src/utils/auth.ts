import type { User } from '../types';

const KEY = 'studobmen.session';
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const stores = (): Storage[] => {
  try { return [localStorage, sessionStorage]; } catch { return []; }
};

export function loadSession(): User | null {
  for (const s of stores()) {
    try {
      const r = JSON.parse(s.getItem(KEY) ?? 'null');
      if (r && typeof r.id === 'string') return r as User;
    } catch {}
  }
  return null;
}

export function saveSession(u: User, remember = true) {
  clearSession();
  try { (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(u)); } catch { /* storage недоступен */ }
}

export function clearSession() {
  for (const s of stores()) { try { s.removeItem(KEY); } catch { /* noop */ } }
}


export const LOGIN_RE = /^[A-Za-z0-9]+$/;
export function validateLogin(v: string): string | null {
  if (!v) return 'Введите логин';
  if (!LOGIN_RE.test(v)) return 'Только латинские буквы (a–z) и цифры (0–9): без пробелов, кириллицы и спецсимволов';
  if (v.length < 3) return 'Минимум 3 символа';
  return null;
}
export const validatePassword = (v: string) => (v.length >= 4 ? null : 'Минимум 4 символа');
