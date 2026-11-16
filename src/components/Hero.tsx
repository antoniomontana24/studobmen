import { Icon } from './Icon';
import { CampusPhoto } from './CampusPhoto';

/**
 * Фото: public/hero-campus.jpg (рекомендуется 1920×800, до ~300 КБ, горизонтальное, главный объект — справа:
 * слева поверх фото лежит текст). Кнопка «Подать объявление» убрана — она есть в шапке сайта.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <CampusPhoto file="hero-campus.jpg" />
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
