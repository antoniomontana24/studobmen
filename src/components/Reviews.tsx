import { useEffect, useState, type FormEvent } from 'react';
import { fetchUserReviews, submitReview } from '../api/reviews';
import type { Review } from '../api/listingDetails';
import { useUser } from '../context/AuthContext';
import { timeAgo } from '../utils/date';
import { Icon, Stars } from './Icon';

interface Props {
  listingId: number;
  listingTitle: string;
  seller: string;
  rating: number;
  reviews: Review[]; // отзывы, пришедшие вместе с объявлением
}

const MIN = 10, MAX = 500;
const LABELS = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];

export function Reviews({ listingId, listingTitle, seller, rating, reviews }: Props) {
  const user = useUser();
  const me = (() => { const [a, b] = user.name.split(' '); return b ? `${a} ${b[0]}.` : a; })();
  const [mine, setMine] = useState<Review[]>([]);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let off = false;
    fetchUserReviews(listingId).then((r) => !off && setMine(r)).catch(() => {});
    return () => { off = true; };
  }, [listingId]);

  const all = [...mine, ...reviews];
  const isOwner = user.name === seller;                       // свои объявления не оцениваем
  const already = mine.some((r) => r.author === me);          // один отзыв от пользователя на объявление
  const textErr = text.trim().length < MIN ? `Напишите хотя бы ${MIN} символов` : null;
  const starsErr = stars === 0 ? 'Поставьте оценку' : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true); setError(null);
    if (textErr || starsErr) return;
    setBusy(true);
    try {
      const r = await submitReview(listingId, {
        stars, text: text.trim(), author: me,
        unit: `${user.institute} • ${user.dorm}`, subject: listingTitle,
      });
      setMine((cur) => [r, ...cur]);
      setStars(0); setText(''); setTouched(false);
    } catch {
      setError('Не удалось отправить отзыв. Попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" aria-labelledby="reviews-title">
      <div className="card__row">
        <div><h2 id="reviews-title">Отзывы о сделках с {seller.split(' ')[0]}</h2><small>Репутация продавца в кампусе ТПУ</small></div>
        <span className="tag tag--free iconline"><Icon name="star" size={13} filled />{rating.toFixed(1)}</span>
      </div>

      {isOwner ? (
        <p className="muted"><small>Нельзя оставить отзыв на собственное объявление.</small></p>
      ) : already ? (
        <p className="muted"><small>Вы уже оставили отзыв на это объявление. Спасибо!</small></p>
      ) : (
        <form className="review-form" onSubmit={submit} noValidate>
          <b>Оставить отзыв</b>
          <div className="stars-input" role="radiogroup" aria-label="Оценка">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} role="radio" aria-checked={stars === n} aria-label={`${n} из 5 — ${LABELS[n - 1]}`}
                className={n <= stars ? 'is-on' : ''} onClick={() => setStars(n)}>
                <Icon name="star" size={26} filled={n <= stars} />
              </button>
            ))}
            <span className="muted">{stars ? LABELS[stars - 1] : 'Выберите оценку'}</span>
          </div>
          {touched && starsErr && <small className="field__err" role="alert">{starsErr}</small>}
          <label className="field">Ваш отзыв
            <textarea rows={3} maxLength={MAX} value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Как прошла сделка: совпало ли состояние с описанием, был ли продавец пунктуален…"
              aria-invalid={touched && !!textErr} />
            <small className="muted">{text.length}/{MAX}</small>
          </label>
          {touched && textErr && <small className="field__err" role="alert">{textErr}</small>}
          {error && <small className="field__err" role="alert">{error}</small>}
          <button className="btn btn--green" type="submit" disabled={busy} style={{ flex: 'none', justifySelf: 'start' }}>
            {busy ? 'Отправляем…' : 'Опубликовать отзыв'}
          </button>
        </form>
      )}

      {all.length === 0 && <p className="muted">Пока нет отзывов — станьте первым.</p>}
      {all.map((r) => (
        <article key={r.id} className="review">
          <div className="card__row"><span><b>{r.author}</b> <small>{r.unit}</small></span><Stars value={r.stars} /></div>
          <p>{r.text}</p>
          <small>{r.createdAt ? timeAgo(r.createdAt) : r.when} • {r.subject}</small>
        </article>
      ))}
    </section>
  );
}
