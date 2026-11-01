import type { ReactNode } from 'react';
import type { NotificationType } from '../types';

/**
 * Минималистичные линейные иконки (24×24, stroke = currentColor).
 * Цвет иконки задаётся CSS-свойством color родителя, размер — пропсом size.
 * Чтобы добавить иконку — допишите ключ в PATHS, имя появится в типе IconName автоматически.
 */
const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  heart: <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.3 3.4 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6" /></>,
  bell: <><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  message: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  send: <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M8.5 12l2.5 2.5 4.5-4.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  package: <><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  star: <path d="M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.5l-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.5z" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  logOut: <path d="M15 17l5-5-5-5M20 12H9M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1M9.9 9.9a3 3 0 0 0 4.2 4.2" />,
  swap: <path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
  building: <path d="M4 21V5l8-2 8 2v16M9 21v-4h6v4M8 8h2M14 8h2M8 12h2M14 12h2" />,
  gift: <path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></>,
  rubleCoin: <><circle cx="12" cy="12" r="9" /><path d="M10 17V7h3a2.5 2.5 0 0 1 0 5h-3M8.5 14h5.5" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  /** Залитая иконка (например, активное сердечко или звезда рейтинга) */
  filled?: boolean;
  className?: string;
}

export function Icon({ name, size = 18, filled = false, className = '' }: IconProps) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Иконки типов уведомлений — одни и те же в колокольчике и на странице уведомлений */
export const NOTIFICATION_ICON: Record<NotificationType, IconName> = {
  message: 'message',
  booking: 'clock',
  purchase: 'check',
  moderation: 'shield',
  system: 'bell',
};

/** Заглушка вместо фото товара */
export function Placeholder({ size = 40 }: { size?: number }) {
  return <span className="ph" aria-hidden="true"><Icon name="package" size={size} /></span>;
}

/** Рейтинг: жёлтая звезда из палитры ТПУ + число */
export function Rating({ value, suffix }: { value: number; suffix?: ReactNode }) {
  return (
    <span className="rating">
      <Icon name="star" size={13} filled />
      {value.toFixed(1)}{suffix && <> {suffix}</>}
    </span>
  );
}

/** Пять звёзд для отзывов */
export function Stars({ value }: { value: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => <Icon key={n} name="star" size={14} filled={n <= value} className={n <= value ? '' : 'icon--off'} />)}
    </span>
  );
}
