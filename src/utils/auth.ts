import type { User } from '../types';

const KEY = 'studobmen.session';
export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const stores = (): Storage[] => {
  try { return [localStorage, sessionStorage]; } catch { return []; }
};

/** Сессия хранится только как профиль пользователя. Пароль нигде не сохраняется. */
export function loadSession(): User | null {
  for (const s of stores()) {
    try {
      const r = JSON.parse(s.getItem(KEY) ?? 'null');
      if (r && typeof r.id === 'string') return r as User;
    } catch { /* повреждённое значение — игнорируем */ }
  }
  return null;
}

/** remember = true → localStorage (переживёт закрытие браузера), иначе sessionStorage (только вкладка) */
export function saveSession(u: User, remember = true) {
  clearSession();
  try { (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(u)); } catch { /* storage недоступен */ }
}

export function clearSession() {
  for (const s of stores()) { try { s.removeItem(KEY); } catch { /* noop */ } }
}

export const validateLogin = (v: string) =>
  v.trim().length >= 3 ? null : 'Введите логин ТПУ или корпоративную почту @tpu.ru';
export const validatePassword = (v: string) => (v.length >= 4 ? null : 'Минимум 4 символа');
