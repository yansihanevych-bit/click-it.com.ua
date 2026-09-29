import { useRef, useState, type DragEvent, type FormEvent } from 'react';
import { Link } from 'react-router';
import { SITE } from '@/config/site';
import { href, useLang, useT } from '@/hooks/useLang';
import { Button } from '@/components/ui/Button';
import { track } from '@/analytics';
import { BUDGETS, BUDGET_LABELS, FILE_TYPES, MAX_FILES, MAX_FILE_BYTES, fileExt } from '../../../api/_uploads';
import s from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = 'name' | 'phone' | 'email' | 'message' | 'budget' | 'files' | 'consent';
type Uploaded = { url: string; name: string };

const ACCEPT = Object.keys(FILE_TYPES).map((e) => `.${e}`).join(',');
const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);
/** Keep the original name readable but safe for a storage path. */
const safeName = (n: string) => n.normalize('NFKD').replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').slice(-80) || 'file';

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
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const next = [...files];
    const problems: string[] = [];
    for (const f of Array.from(list)) {
      if (!FILE_TYPES[fileExt(f.name)]) { problems.push(t('form.errors.fileType', { name: f.name })); continue; }
      if (f.size > MAX_FILE_BYTES) { problems.push(t('form.errors.fileSize', { name: f.name })); continue; }
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      if (next.length >= MAX_FILES) { problems.push(t('form.errors.fileCount', { count: MAX_FILES })); break; }
      next.push(f);
    }
    setFiles(next);
    setErrors((x) => ({ ...x, files: problems.length ? problems.join(' ') : undefined }));
    if (fileInput.current) fileInput.current.value = '';
  };
  const onDrop = (ev: DragEvent<HTMLDivElement>) => { ev.preventDefault(); setDragging(false); addFiles(ev.dataTransfer.files); };

  /** Uploads straight to Vercel Blob (the SDK is loaded only when someone actually attaches files). */
  async function uploadFiles(): Promise<Uploaded[]> {
    if (!files.length) return [];
    const { upload } = await import('@vercel/blob/client');
    const stamp = new Date().toISOString().slice(0, 10);
    return Promise.all(files.map(async (f) => {
      const blob = await upload(`contact/${stamp}/${safeName(f.name)}`, f, {
        access: 'public', handleUploadUrl: '/api/upload', contentType: FILE_TYPES[fileExt(f.name)],
      });
      return { url: blob.url, name: f.name };
    }));
  }

  const validate = (d: Record<string, string>, consent: boolean) => {
    const e: Partial<Record<Field, string>> = {};
    if ((d.name || '').trim().length < 2) e.name = t('form.errors.name');
    if (!PHONE_RE.test((d.phone || '').trim())) e.phone = t('form.errors.phone');
    if (!EMAIL_RE.test((d.email || '').trim())) e.email = t('form.errors.email');
    if ((d.message || '').length > 2000) e.message = t('form.errors.message');
    if (!(BUDGETS as readonly string[]).includes(d.budget || '')) e.budget = t('form.errors.budget');
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
    let uploaded: Uploaded[] = [];
    if (files.length) {
      setUploading(true);
      try { uploaded = await uploadFiles(); } catch {
        setUploading(false);
        setServerError(t('form.errors.upload'));
        setStatus('error');
        return;
      }
      setUploading(false);
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent, lang, files: uploaded, elapsed: Date.now() - startedAt.current, page: window.location.pathname }),
      });
      if (res.status === 429) { setServerError(t('form.errors.rate')); setStatus('error'); return; }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      // Conversion for GA4 / Google Ads (configured in GTM on the `generate_lead` event)
      track('generate_lead', { form_id: idPrefix, language: lang, page_path: window.location.pathname });
      formRef.current?.reset();
      setFiles([]);
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

  const field = (name: 'name' | 'phone' | 'email' | 'message', type: string, autoComplete: string, required = true) => {
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
      <fieldset className={s.budget} data-invalid={errors.budget ? '' : undefined} aria-describedby={errors.budget ? `${idPrefix}-budget-err` : undefined}>
        <legend className={s.legend}>
          {t('form.budget')}<span aria-hidden="true"> *</span><span className="visually-hidden"> ({t('form.required')})</span>
        </legend>
        <div className={s.chips}>
          {BUDGETS.map((b) => (
            <label key={b} className={s.chip}>
              <input type="radio" name="budget" value={b} required onChange={() => errors.budget && setErrors((x) => ({ ...x, budget: undefined }))} />
              <span>{BUDGET_LABELS[b].replace(' USD', '')}<small>USD</small></span>
            </label>
          ))}
        </div>
        {errors.budget && <p id={`${idPrefix}-budget-err`} className={s.error}>{errors.budget}</p>}
      </fieldset>
      <div className={s.filesField}>
        <p className={s.legend} id={`${idPrefix}-files-label`}>{t('form.files')}</p>
        <div
          className={[s.drop, dragging && s.dropActive].filter(Boolean).join(' ')}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
          onDrop={onDrop}
        >
          <svg className={s.dropIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v5h16v-5" /></svg>
          <p>
            {t('form.filesDrop')}{' '}
            <label htmlFor={`${idPrefix}-files`} className={s.browse}>{t('form.filesBrowse')}</label>
          </p>
          <small id={`${idPrefix}-files-hint`}>{t('form.filesHint')}</small>
          <input
            ref={fileInput} id={`${idPrefix}-files`} type="file" multiple accept={ACCEPT} className="visually-hidden"
            aria-labelledby={`${idPrefix}-files-label`} aria-describedby={`${idPrefix}-files-hint${errors.files ? ` ${idPrefix}-files-err` : ''}`}
            onChange={(e) => addFiles(e.currentTarget.files)}
          />
        </div>
        {files.length > 0 && (
          <ul className={s.fileList}>
            {files.map((f, i) => (
              <li key={`${f.name}-${f.size}`}>
                <span className={s.fileExt}>{fileExt(f.name)}</span>
                <span className={s.fileName}>{f.name}</span>
                <small>{fmtSize(f.size)}</small>
                <button type="button" className={s.fileRemove} aria-label={t('form.filesRemove', { name: f.name })} onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}>×</button>
              </li>
            ))}
          </ul>
        )}
        {errors.files && <p id={`${idPrefix}-files-err`} className={s.error} role="alert">{errors.files}</p>}
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
        {status === 'sending' ? (uploading ? t('form.uploading') : t('form.sending')) : t('form.submit')}
      </Button>
    </form>
  );
}
