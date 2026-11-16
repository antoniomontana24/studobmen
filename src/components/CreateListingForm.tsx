import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, DORMS } from '../data/mock';
import { fileToDataUrl } from '../utils/image';
import { Icon } from './Icon';
import { useListingsData } from '../context/ListingsContext';
import type { Condition, Listing, NewListingInput, OfferType, Status } from '../types';

const OFFERS: [OfferType, string][] = [['sale', 'Продажа'], ['rent', 'Аренда'], ['free', 'Даром']];
const CONDS: [Condition, string][] = [['new', 'Новое'], ['excellent', 'Отличное'], ['good', 'Хорошее'], ['parts', 'Удовлетворит.']];

const MAX_PHOTOS = 8;
const MAX_MB = 5;

interface Props { initial?: Listing }

export function CreateListingForm({ initial }: Props) {
  const ctx = useListingsData();
  const nav = useNavigate();
  const editing = !!initial;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [offerType, setOfferType] = useState<OfferType>(initial?.offerType ?? 'sale');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [condition, setCondition] = useState<Condition>(initial?.condition ?? 'good');
  const [dorm, setDorm] = useState(initial?.dorm ?? DORMS[0]);
  const [images, setImages] = useState<string[]>(initial?.images ?? (initial?.image ? [initial.image] : []));
  const [photoMsg, setPhotoMsg] = useState<string | null>(null);
  const [busyPhotos, setBusyPhotos] = useState(false);
  const [checked, setChecked] = useState(false); // «пройдено AI»

  // Несколько файлов за раз. Каждый проверяем и превращаем в сжатый data-URL (см. utils/image.ts):
  // blob-ссылки не переживают перезагрузку страницы, из-за чего фото «пропадали» из каталога.
  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files ?? []);
    e.target.value = ''; // чтобы один и тот же файл можно было выбрать повторно
    const notes: string[] = [];
    let valid = files.filter((f) => {
      if (!f.type.startsWith('image/')) { notes.push(`«${f.name}» — не изображение`); return false; }
      if (f.size > MAX_MB * 1024 * 1024) { notes.push(`«${f.name}» больше ${MAX_MB} МБ`); return false; }
      return true;
    });
    const room = MAX_PHOTOS - images.length;
    if (valid.length > room) notes.push(`Можно загрузить не более ${MAX_PHOTOS} фото`);
    valid = valid.slice(0, Math.max(room, 0));
    setBusyPhotos(true);
    const urls: string[] = [];
    for (const f of valid) {
      try { urls.push(await fileToDataUrl(f)); }
      catch { notes.push(`не удалось обработать «${f.name}»`); }
    }
    setBusyPhotos(false);
    setImages((cur) => [...cur, ...urls].slice(0, MAX_PHOTOS));
    setPhotoMsg(notes.length ? notes.join('. ') + '.' : null);
  };

  const removePhoto = (idx: number) => {
    setImages((cur) => cur.filter((_, i) => i !== idx));
    setPhotoMsg(null);
  };

  const submit = (status: Status) => {
    const input: NewListingInput = {
      title: title.trim() || 'Без названия',
      description: description.trim(),
      price: offerType === 'free' ? 0 : price,
      offerType, condition, category, dorm, status,
      image: images[0], images,
    };
    if (editing && initial) ctx.update(initial.id, input);
    else ctx.add(input);
    setChecked(true);
    setTimeout(() => nav('/profile'), 1200); // даём увидеть баннер проверки
  };

  return (
    <section className="panel form">
      <div className="card__row"><h2>{editing ? 'Редактирование объявления' : 'Новое объявление'}</h2>
        <span className="tag">Шаг 1 из 1</span></div>

      <label className="field">Название товара или услуги*
        <input value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} placeholder="Учебник по физике (Иродов) + методичка ТПУ" />
        <small className="muted">{title.length}/80</small>
      </label>

      <label className="field">Описание
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Состояние, комплектация, почему отдаёте…" />
      </label>

      <div className="form__grid">
        <label className="field">Категория*
          <select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="field">Локация передачи*
          <select value={dorm} onChange={(e) => setDorm(e.target.value)}>{DORMS.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
      </div>

      <fieldset className="field"><legend>Тип предложения</legend>
        <div className="chips">{OFFERS.map(([v, l]) => (
          <label key={v} className={offerType === v ? 'chip-btn is-active' : 'chip-btn'}>
            <input type="radio" name="offer" checked={offerType === v} onChange={() => setOfferType(v)} /> {l}
          </label>))}
        </div>
      </fieldset>

      <div className="form__grid">
        <label className="field">Стоимость (₽)*
          <input type="number" min={0} disabled={offerType === 'free'} value={offerType === 'free' ? 0 : price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
          {offerType === 'free' && <small className="muted">Для «Даром» цена 0 ₽</small>}
        </label>
        <fieldset className="field"><legend>Состояние вещи</legend>
          <div className="chips">{CONDS.map(([v, l]) => (
            <label key={v} className={condition === v ? 'chip-btn is-active' : 'chip-btn'}>
              <input type="radio" name="cond" checked={condition === v} onChange={() => setCondition(v)} /> {l}
            </label>))}
          </div>
        </fieldset>
      </div>

      <div className="field">Фотографии товара
        <div className="photos">
          {images.map((src, n) => (
            <figure className="photos__item" key={`${n}-${src.length}`}>
              <img src={src} alt={`Фото ${n + 1}`} />
              {n === 0 && <span className="photos__cover">Обложка</span>}
              <button type="button" className="photos__rm" onClick={() => removePhoto(n)} aria-label={`Удалить фото ${n + 1}`}><Icon name="x" size={14} /></button>
            </figure>
          ))}
          {images.length < MAX_PHOTOS && (
            <label className="photos__add">
              <input type="file" accept="image/*" multiple className="sr-only" onChange={onFiles} disabled={busyPhotos} />
              <Icon name="plus" size={22} />
              <span>{busyPhotos ? 'Обработка…' : 'Добавить фото'}</span>
            </label>
          )}
        </div>
        <small className="muted">{images.length}/{MAX_PHOTOS} · можно выбрать сразу несколько файлов, первое фото станет обложкой</small>
        {photoMsg && <small className="field__err" role="alert">{photoMsg}</small>}
      </div>

      {checked && (
        <div className="ai-ok"><b>МГНОВЕННО · AI‑проверка ТПУ пройдена успешно</b>
          <small>Текст корректен, запрещённые предметы и нарушения распорядка не обнаружены.</small></div>
      )}

      <div className="form__actions">
        <button className="btn btn--outline" onClick={() => nav(-1)}>Отмена</button>
        <button className="btn btn--outline" disabled={checked} onClick={() => submit('draft')}>Сохранить черновик</button>
        <button className="btn btn--green" disabled={checked} onClick={() => submit('moderation')}>Опубликовать в кампусе</button>
      </div>
    </section>
  );
}