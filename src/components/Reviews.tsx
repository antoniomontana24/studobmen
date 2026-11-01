import type { Review } from '../api/listingDetails';
import { Icon, Stars } from './Icon';

export function Reviews({ seller, rating, reviews }: { seller: string; rating: number; reviews: Review[] }) {
  if (!reviews.length) return null;
  return (
    <section className="panel">
      <div className="card__row">
        <div><h2>Отзывы о сделках с {seller.split(' ')[0]}</h2><small>Репутация продавца в кампусе ТПУ</small></div>
        <span className="tag tag--free iconline"><Icon name="star" size={13} filled />{rating.toFixed(1)}</span>
      </div>
      {reviews.map((r) => (
        <article key={r.id} className="review">
          <div className="card__row"><span><b>{r.author}</b> <small>{r.unit}</small></span><Stars value={r.stars} /></div>
          <p>{r.text}</p>
          <small>{r.when} • {r.subject}</small>
        </article>
      ))}
    </section>
  );
}