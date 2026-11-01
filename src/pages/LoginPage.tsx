import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthError } from '../api/auth';
import { Icon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { validateLogin, validatePassword } from '../utils/auth';

const FEATURES = [
  { icon: 'shield', text: 'Вход только для студентов и сотрудников ТПУ' },
  { icon: 'pin', text: 'Передача вещей прямо в вашем общежитии' },
  { icon: 'rubleCoin', text: 'Оплата при встрече — без предоплат и комиссий' },
] as const;

export default function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to={from} replace />;

  const idErr = touched ? validateLogin(id) : null;
  const pwErr = touched ? validatePassword(password) : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (validateLogin(id) || validatePassword(password)) return;
    setBusy(true);
    try {
      await login(id.trim(), password, remember);
      nav(from, { replace: true });
    } catch (err) {
      setError(err instanceof AuthError && err.kind === 'invalid'
        ? 'Неверный логин или пароль'
        : 'Сервис авторизации ТПУ временно недоступен. Попробуйте позже.');
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <aside className="auth__brand">
        <div className="logo logo--inv"><span className="logo__mark"><Icon name="swap" size={20} /></span><span className="logo__text"><b>СТУДОБМЕН</b><small>Маркетплейс общежитий ТПУ</small></span></div>
        <h1>Вещи, которые нужны соседям по общежитию</h1>
        <p>Продавайте то, чем больше не пользуетесь, и находите нужное рядом — на своём этаже или в соседнем корпусе.</p>
        <ul className="auth__ticks">
          {FEATURES.map((f) => <li key={f.text}><Icon name={f.icon} size={20} />{f.text}</li>)}
        </ul>
      </aside>

      <main className="auth__main">
        <form className="auth__card" onSubmit={submit} noValidate>
          <div>
            <h2>Вход через аккаунт ТПУ</h2>
            <p className="muted">Используйте логин и пароль учётной записи университета</p>
          </div>

          {error && <p className="auth__err" role="alert"><Icon name="alert" size={18} />{error}</p>}

          <label className="field">Логин или почта @tpu.ru
            <span className="input">
              <Icon name="user" size={18} />
              <input value={id} onChange={(e) => setId(e.target.value)} onBlur={() => setTouched(true)}
                autoComplete="username" autoFocus inputMode="email" placeholder="ivanov@tpu.ru"
                aria-invalid={!!idErr} aria-describedby={idErr ? 'login-err' : undefined} />
            </span>
            {idErr && <small id="login-err" className="field__err">{idErr}</small>}
          </label>

          <label className="field">Пароль
            <span className="input">
              <Icon name="lock" size={18} />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)} autoComplete="current-password"
                aria-invalid={!!pwErr} aria-describedby={pwErr ? 'pw-err' : undefined} />
              <button type="button" className="input__btn" onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Скрыть пароль' : 'Показать пароль'} aria-pressed={showPw}>
                <Icon name={showPw ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </span>
            {pwErr && <small id="pw-err" className="field__err">{pwErr}</small>}
          </label>

          <label className="check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Запомнить меня на этом устройстве</label>

          <button className="btn btn--green btn--lg" type="submit" disabled={busy}>
            {busy ? 'Проверяем…' : <>Войти <Icon name="arrowRight" size={18} /></>}
          </button>

          <div className="auth__foot">
            <a href="https://help.tpu.ru" target="_blank" rel="noreferrer">Забыли пароль? Помощь ТПУ</a>
          </div>
          <p className="muted auth__hint"><small>Пароль не сохраняется в браузере и используется только для входа.</small></p>
        </form>
      </main>
    </div>
  );
}
