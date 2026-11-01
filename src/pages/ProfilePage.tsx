import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useUser } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { useFavorites } from '../context/FavoriteContext';
import { useListingsData } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { MyListingsTab } from '../components/MyListingsTab';
import { OrdersTab } from '../components/OrdersTab';

type Tab = 'overview' | 'listings' | 'orders' | 'favorites' | 'settings';
const NAV: [Tab, string][] = [['overview', 'Главное'], ['listings', 'Мои объявления'], ['orders', 'Заказы и бронирования'], ['favorites', 'Избранное'], ['settings', 'Настройки профиля']];

export default function ProfilePage() {
  const user = useUser();
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const fav = useFavorites();
  const { mine } = useListingsData();
  const active = mine.filter((m) => m.status === 'available' || m.status === 'bookable').length;
  const holds = mine.filter((m) => m.status === 'reserved').length;

  return (
    <>
      <nav className="crumbs"><Link to="/">Каталог</Link> / Личный кабинет</nav>
      <div className="profile">
        <aside className="profile__nav">
          <div className="profile__me">
            <i className="avatar avatar--lg">{user.name[0]}</i>
            <div><strong>{user.name}</strong><br /><small>{user.institute} · {user.dorm}, комн. {user.room}</small></div>
          </div>
          <div className="profile__stats">
            <span><b>4.85</b><small>рейтинг</small></span>
            <span><b>14</b><small>сделок</small></span>
            <span><b>{active}</b><small>активных</small></span>
            <span><b>{holds}</b><small>бронь</small></span>
          </div>
          <nav>{NAV.map(([v, l]) => (
            <button key={v} className={tab === v ? 'is-active' : ''} onClick={() => setTab(v)}>
              {l}{v === 'favorites' && ` (${fav.items.length})`}{v === 'listings' && ` (${mine.length})`}
            </button>))}
          </nav>
          <Link className="btn btn--green" to="/profile/new"><Icon name="plus" size={18} />Подать объявление</Link>
          <button className="btn btn--outline" onClick={logout}><Icon name="logOut" size={16} />Выйти</button>
        </aside>

        <section className="profile__content">
          {tab === 'overview' && (
            <div className="panel">
              <h2>Обзор</h2>
              <p className="muted">Вход выполнен через аккаунт ТПУ · {user.name.split(' ')[0]} {user.name.split(' ')[1]?.[0]}., {user.institute}.</p>
              <div className="profile__quick">
                <button className="btn btn--ghost" onClick={() => setTab('listings')}>Мои объявления ({mine.length})</button>
                <button className="btn btn--ghost" onClick={() => setTab('orders')}>Заказы и брони</button>
                <button className="btn btn--ghost" onClick={() => setTab('favorites')}>Избранное ({fav.items.length})</button>
              </div>
            </div>
          )}
          {tab === 'listings' && <MyListingsTab />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'favorites' && (fav.items.length
            ? <div className="grid">{fav.items.map((l) => <ListingCard key={l.id} l={l} />)}</div>
            : <p className="state">В избранном пусто.</p>)}
          {tab === 'settings' && (
            <div className="panel form">
              <h2>Настройки профиля</h2>
              <label className="field">Имя<input defaultValue={user.name} /></label>
              <label className="field">Общежитие<select defaultValue={user.dorm}><option>{user.dorm}</option></select></label>
              <label className="field">Комната<input defaultValue={user.room} /></label>
              <button className="btn btn--green" onClick={() => alert('Сохранено (демо)')}>Сохранить</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}