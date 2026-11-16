/**
 * Отзывы, оставленные пользователями.
 *
 * ЗАГЛУШКА на localStorage. Замена на backend:
 *   GET  /api/listings/:id/reviews            -> Review[]
 *   POST /api/listings/:id/reviews {stars,text} -> Review   (автора берёт сервер из сессии;
 *        сервер же должен проверять, что отзыв оставляет участник сделки, и не чаще одного раза)
 */
import type { Review } from './listingDetails';
import { delay } from '../utils/auth';

const KEY = 'studobmen.reviews';
type Store = Record<string, Review[]>;

const read = (): Store => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; } };

export async function fetchUserReviews(listingId: number): Promise<Review[]> {
  await delay(150);
  return read()[listingId] ?? [];
}

export interface NewReview { stars: number; text: string; author: string; unit: string; subject: string }

export async function submitReview(listingId: number, r: NewReview): Promise<Review> {
  await delay(400);
  const review: Review = { id: Date.now(), when: '', createdAt: Date.now(), ...r };
  const store = read();
  store[listingId] = [review, ...(store[listingId] ?? [])];
  localStorage.setItem(KEY, JSON.stringify(store));
  return review;
}
