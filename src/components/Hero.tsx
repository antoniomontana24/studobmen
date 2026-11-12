import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';


const PHOTO = `${import.meta.env.BASE_URL}hero-campus.jpg`;

function CampusArt() {
  return (
    <svg className="hero__art" viewBox="0 0 800 400" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <circle cx="610" cy="120" r="64" fill="#28BE46" />
      <g fill="#1b1b1b">
        <rect x="40" y="230" width="120" height="170" /><rect x="170" y="200" width="90" height="200" />
        <rect x="520" y="210" width="110" height="190" /><rect x="640" y="250" width="130" height="150" />
      </g>
      <g fill="#262626">
        <rect x="250" y="170" width="300" height="230" />
        <polygon points="250,170 400,110 550,170" />
        <rect x="383" y="60" width="34" height="60" /><polygon points="383,60 400,34 417,60" />
      </g>
      <g fill="#28BE46">
        {[280, 330, 380, 430, 480].map((x) => <rect key={x} x={x} y="200" width="18" height="200" />)}
      </g>
      <g fill="#FFB600">
        {[60, 100, 190, 540, 580, 660, 710].map((x) => <rect key={x} x={x} y="260" width="14" height="18" />)}
      </g>
      <rect y="396" width="800" height="4" fill="#28BE46" />
    </svg>
  );
}

export function Hero() {
  const [noPhoto, setNoPhoto] = useState(false);
  return (
    <section className="hero" aria-labelledby="hero-title">
      {noPhoto
        ? <CampusArt />
        : <img className="hero__img" src={PHOTO} alt="" onError={() => setNoPhoto(true)} />}
      <div className="hero__shade" />
      <div className="hero__body">
        <span className="hero__kicker">Томский политехнический университет</span>
        <h1 id="hero-title">Маркетплейс для жителей общежитий ТПУ</h1>
        <p>Покупайте, продавайте и отдавайте вещи соседям по кампусу — без комиссий и с оплатой при встрече.</p>
        <div className="hero__cta">
          <button className="btn btn--green" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
            Смотреть товары<Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
