import { Link } from 'react-router-dom';
import type { Listing } from '../types';
import { timeAgo } from '../utils/date';
import { money } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useChat } from '../context/ChatContext';
import { Icon, Placeholder, Rating } from './Icon';

function Actions({ l }: { l: Listing }) {
  const cart = useCart();
  const chat = useChat();
  const inCart = cart.has(l.id);

  if (l.status === 'reserved')
    return <button className="btn btn--outline btn--wide"><Icon name="bell" size={16} />Сообщить, если бронь спадёт</button>;

  const addLabel = l.offerType === 'free' ? 'Забрать даром' : l.status === 'bookable' ? 'Забронировать' : 'Купить';

  // Одна кнопка переключается: добавить ↔ убрать, прямо из каталога
  const toggle = inCart ? (
    <button
      className={`btn btn--remove ${l.offerType === 'free' ? 'btn--wide' : ''}`}
      onClick={() => cart.remove(l.id)}
      aria-label={`Убрать из корзины: ${l.title}`}
      title="Убрать из корзины"
    >
      <Icon name="x" size={16} />{l.offerType === 'free' ? 'Убрать из корзины' : 'Убрать'}
    </button>
  ) : (
    <button className={`btn btn--green ${l.offerType === 'free' ? 'btn--wide' : ''}`} onClick={() => cart.add(l)}>
      <Icon name={l.offerType === 'free' ? 'gift' : 'cart'} size={16} />{addLabel}
    </button>
  );

  if (l.offerType === 'free') return toggle;
  return (
    <>
      <button className="btn btn--dark" onClick={() => chat.openForListing(l)}><Icon name="message" size={16} />Написать</button>
      {toggle}
    </>
  );
}

export function ListingCard({ l }: { l: Listing }) {
  const favorites = useFavorites();
  const cart = useCart();
  const inFav = favorites.has(l.id);
  const inCart = cart.has(l.id);

  return (
    <article className={`card ${inCart ? 'is-incart' : ''}`}>
      <div className="card__img">
        <Link to={`/listing/${l.id}`} className="card__imglink" aria-label={l.title}>
          {l.image ? <img src={l.image} alt="" loading="lazy" /> : <Placeholder />}
        </Link>
        <span className="chip">{l.dorm}</span>
        {inCart && <span className="chip chip--cart"><Icon name="check" size={13} />В корзине</span>}
        <button
          className={`heart ${inFav ? 'is-active' : ''}`}
          aria-label={inFav ? 'Убрать из избранного' : 'В избранное'}
          aria-pressed={inFav}
          onClick={() => favorites.toggle(l)}
        >
          <Icon name="heart" size={16} filled={inFav} />
        </button>
      </div>
      <div className="card__body">
        <div className="card__row">
          <strong className="price">{l.price === 0 ? '0 ₽' : money(l.price)}</strong>
          {l.offerType === 'free' && <span className="tag tag--free">Бесплатно</span>}
          <time>{timeAgo(l.createdAt)}</time>
        </div>
        <h3 className="card__title"><Link to={`/listing/${l.id}`} className="plain">{l.title}</Link></h3>
        <p className="card__desc">{l.description}</p>
        <div className="card__row">
          <span className="seller">
            <i className="avatar">{l.seller.name[0]}</i>
            {l.seller.name} <Rating value={l.seller.rating} suffix={<small>({l.seller.reviews})</small>} />
          </span>
          <span className="tag">{l.seller.institute}</span>
        </div>
        <div className="card__actions"><Actions l={l} /></div>
      </div>
    </article>
  );
}
