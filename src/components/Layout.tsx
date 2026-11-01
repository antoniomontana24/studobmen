import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';
import { useFavorites } from '../context/FavoriteContext';
import { ChatWidget } from './ChatWidget';
import { Icon } from './Icon';
import { NotificationBell } from './NotificationsBell';

function Count({ n }: { n: number }) {
  return n > 0 ? <span className="count">{n > 99 ? '99+' : n}</span> : null;
}

export function Layout() {
  const { user, logout } = useAuth();
  const chat = useChat();
  const cart = useCart();
  const favorites = useFavorites();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();

  const onSearch = (v: string) =>
    pathname === '/' ? setParams(v ? { q: v } : {}, { replace: true }) : nav(`/?q=${encodeURIComponent(v)}`);

  const [first, second] = (user?.name ?? '').split(' ');
  const shortName = second ? `${first} ${second[0]}.` : first;

  return (
    <>
      <header className="header">
        <div className="wrap header__in">
          <Link className="logo" to="/">
            <span className="logo__mark"><Icon name="swap" size={20} /></span>
            <span className="logo__text"><b>СТУДОБМЕН</b><small>Маркетплейс общежитий ТПУ</small></span>
          </Link>

          <label className="search">
            <Icon name="search" size={18} />
            <input type="search" placeholder="Поиск вещей, книг, техники по кампусу…" aria-label="Поиск"
              value={params.get('q') ?? ''} onChange={(e) => onSearch(e.target.value)} />
          </label>

          <Link className="btn btn--green header__add" to="/profile/new"><Icon name="plus" size={18} /><span>Подать объявление</span></Link>

          <nav className="header__nav" aria-label="Основное меню">
            <NavLink className="iconbtn" to="/favorites" aria-label="Избранное" title="Избранное"><Icon name="heart" /><Count n={favorites.items.length} /></NavLink>
            <NavLink className="iconbtn" to="/cart" aria-label="Корзина" title="Корзина"><Icon name="cart" /><Count n={cart.items.length} /></NavLink>
            <NotificationBell />
            <NavLink className="iconbtn" to="/chats" aria-label="Сообщения" title="Сообщения"><Icon name="message" /><Count n={chat.unread} /></NavLink>
          </nav>

          <Link className="user" to="/profile" title="Личный кабинет">
            <span className="avatar">{first?.[0]}</span>
            <span className="user__name">{shortName}</span>
          </Link>
          <button className="iconbtn header__logout" onClick={logout} aria-label="Выйти" title="Выйти"><Icon name="logOut" /></button>
        </div>
      </header>

      <main className="wrap"><Outlet /></main>
      <ChatWidget />
      <footer className="footer">
        <div className="wrap">© 2026 ТПУ Маркет. Создано студентами Томского политехнического университета.</div>
      </footer>
    </>
  );
}
