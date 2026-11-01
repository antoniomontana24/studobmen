import { Icon, type IconName } from './Icon';

const RULES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'check', title: 'Тест техники', text: 'Проверяйте работоспособность электроприборов в холле у дежурного вахтера или в комнате.' },
  { icon: 'rubleCoin', title: 'Без предоплат', text: 'Передача денег (наличные или перевод через СБП) строго после личного визуального осмотра.' },
  { icon: 'shield', title: 'Соседский манибэк', text: 'Гарантия 3 дня на выявление скрытых дефектов электроники между верифицированными студентами.' },
];

export function SafetyRules() {
  return (
    <section className="safety">
      <h2 className="iconline"><Icon name="shield" size={18} />Регламент безопасных студенческих сделок ТПУ</h2>
      <div className="safety__grid">
        {RULES.map((r) => (
          <div className="safety__item" key={r.title}>
            <strong className="iconline"><Icon name={r.icon} size={16} />{r.title}</strong>
            <p className="muted">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}