import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { SITE } from '@/config/site';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import s from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = 'name' | 'phone' | 'email' | 'message' | 'consent';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()\-]{8,19}$/;

export function ContactForm({ idPrefix = 'cf' }: { idPrefix?: string }) {
  const lang = useLang();
  const { t } = useT();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [serverError, setServerError] = useState('');
  const startedAt = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (d: Record<string, string>, consent: boolean) => {
    const e: Partial<Record<Field, string>> = {};
    if ((d.name || '').trim().length < 2) e.name = t('form.errors.name');
    if (!PHONE_RE.test((d.phone || '').trim())) e.phone = t('form.errors.phone');
    if (!EMAIL_RE.test((d.email || '').trim())) e.email = t('form.errors.email');
    if ((d.message || '').length > 2000) e.message = t('form.errors.message');
    if (!consent) e.consent = t('form.errors.consent');
    return e;
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    const consent = fd.get('consent') === 'on';
    const e = validate(data, consent);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent, lang, elapsed: Date.now() - startedAt.current, page: window.location.pathname }),
      });
      if (res.status === 429) { setServerError(t('form.errors.rate')); setStatus('error'); return; }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      formRef.current?.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={s.success} role="status" aria-live="polite">
        <span className={s.check} aria-hidden="true">
          <svg viewBox="0 0 52 52"><path d="M14 27l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" /></svg>
        </span>
        <h3 className="t-h2">{t('form.successTitle')}</h3>
        <p className="t-lead">{t('form.successText')}</p>
        <button type="button" className={s.again} onClick={() => { startedAt.current = Date.now(); setStatus('idle'); }}>{t('form.again')}</button>
      </div>
    );
  }

  const field = (name: Exclude<Field, 'consent'>, type: string, autoComplete: string, required = true) => {
    const id = `${idPrefix}-${name}`;
    const err = errors[name];
    const common = {
      id, name, autoComplete, required,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${id}-err` : undefined,
      placeholder: ' ',
      className: s.input,
      onInput: () => err && setErrors((x) => ({ ...x, [name]: undefined })),
    };
    return (
      <div className={[s.field, name === 'message' && s.full].filter(Boolean).join(' ')}>
        {name === 'message'
          ? <textarea {...common} rows={4} maxLength={2000} placeholder={t('form.messagePlaceholder')} />
          : <input {...common} type={type} inputMode={name === 'phone' ? 'tel' : undefined} maxLength={name === 'email' ? 120 : 80} />}
        <label htmlFor={id} className={s.label}>
          {t(`form.${name}`)}{required && <span aria-hidden="true"> *</span>}
          {required && <span className="visually-hidden"> ({t('form.required')})</span>}
        </label>
        {err && <p id={`${id}-err`} className={s.error}>{err}</p>}
      </div>
    );
  };

  return (
    <form ref={formRef} className={s.form} onSubmit={onSubmit} noValidate aria-busy={status === 'sending'}>
      <div className={s.grid}>
        {field('name', 'text', 'name')}
        {field('phone', 'tel', 'tel')}
        {field('email', 'email', 'email')}
        {field('message', 'text', 'off', false)}
      </div>
      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it */}
      <div className={s.hp} aria-hidden="true">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input id={`${idPrefix}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={s.consent}>
        <input id={`${idPrefix}-consent`} name="consent" type="checkbox" defaultChecked aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${idPrefix}-consent-err` : undefined} />
        <label htmlFor={`${idPrefix}-consent`}>
          {t('form.consent')} <Link to={href(lang, 'privacy')}>{t('form.consentLink')}</Link>
        </label>
        {errors.consent && <p id={`${idPrefix}-consent-err`} className={s.error}>{errors.consent}</p>}
      </div>
      {status === 'error' && (
        <div className={s.alert} role="alert">
          <strong>{t('form.errorTitle')}</strong>
          <span>{serverError || <>{t('form.errorText')} <a href={`tel:${SITE.phones[0].href}`}>{SITE.phones[0].display}</a></>}</span>
        </div>
      )}
      <Button type="submit" variant="dark" block disabled={status === 'sending'} magnetic={false}>
        {status === 'sending' ? t('form.sending') : t('form.submit')}
      </Button>
    </form>
  );
}
