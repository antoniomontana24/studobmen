import { useState } from 'react';
import { Placeholder } from './Icon';

export function Gallery({ images, dorm }: { images: string[]; dorm: string }) {
  const [i, setI] = useState(0);
  return (
    <section className="gallery">
      <div className="gallery__main">
        {images[i] ? (
          <>
            {/* размытая копия заполняет пустые поля, а само фото целиком вписано (contain) без обрезки и искажений */}
            <img className="gallery__blur" src={images[i]} alt="" aria-hidden="true" />
            <img className="gallery__img" src={images[i]} alt={`Фото ${i + 1} из ${images.length}`} />
          </>
        ) : <Placeholder size={64} />}
        <span className="chip">{dorm}</span>
        {images.length > 0 && <span className="gallery__count">{images.length} фото</span>}
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, n) => (
            <button key={src} className={n === i ? 'is-active' : ''} onClick={() => setI(n)} aria-label={`Фото ${n + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}