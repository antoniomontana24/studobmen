import { useState } from 'react';

/**
 * Фоновая фотография кампуса из папки public/. Если файла нет — просто ничего не рисуем,
 * и виден тёмный фон контейнера (никаких иллюстраций-заглушек).
 */
export function CampusPhoto({ file, className = '' }: { file: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img className={`campus-photo ${className}`.trim()} src={`${import.meta.env.BASE_URL}${file}`} alt="" onError={() => setFailed(true)} />;
}
