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
    </section>
  );
}