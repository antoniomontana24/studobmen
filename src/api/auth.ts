import { CURRENT_USER } from '../data/mock';
import type { User } from '../types';
import { delay, validateLogin } from '../utils/auth';

export class AuthError extends Error {
  constructor(public kind: 'invalid' | 'unavailable') {
    super(kind);
  }
}

/**
 * ЗАГЛУШКА. Настоящая проверка логина/пароля ТПУ должна выполняться на сервере (backend),
 * а не в браузере: фронтенд только отправляет данные и получает профиль.
 *
 * Замените тело функции на запрос к вашему backend:
 *
 *   const res = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     credentials: 'include',            // сессия — в httpOnly-cookie, выставляет сервер
 *     body: JSON.stringify({ login, password }),
 *   });
 *   if (res.status === 401) throw new AuthError('invalid');
 *   if (!res.ok) throw new AuthError('unavailable');
 *   return (await res.json()) as User;
 */
export async function loginWithTpu(login: string, password: string): Promise<User> {
  await delay(600);
  // Повторная проверка формата — на backend она обязательна: проверку в браузере можно обойти
  if (validateLogin(login) || !password) throw new AuthError('invalid');
  return { ...CURRENT_USER, id: login, email: `${login}@tpu.ru` };
}
