import type { ListingDetails } from '../api/listingDetails';
import { Icon, Rating } from './Icon';

export function SellerCard({ l }: { l: ListingDetails }) {
  const s = l.seller, i = l.sellerInfo;
  return (
    <section className="seller-card">
      <div className="group__head">
        <i className="avatar avatar--lg">{s.name[0]}</i>
        <div>
          <strong>{s.name}</strong><br />
          <small>{i.program}</small><br />
          <Rating value={s.rating} suffix={<small>({i.deals} сделок • {i.reviewsCount} отзывов)</small>} />
        </div>
      </div>
      <div className="seller-card__ok"><b className="iconline"><Icon name="shield" size={16} />Корпоративная почта подтверждена</b><br /><small>Аккаунт {i.emailMasked} проверен службой кампуса</small></div>
      <div className="seller-card__info"><b>{l.dorm.split(' (')[0]}:</b> {i.address}<br /><small>На ТПУ Маркете с {i.since}</small></div>
      <div className="buybox__row"><button className="btn btn--ghost">VK Профиль</button><button className="btn btn--ghost">MAX чат</button></div>
    </section>
  );
}