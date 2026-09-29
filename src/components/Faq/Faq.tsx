import { useT } from '@/hooks/useLang';
import { Accordion } from '@/components/ui/Accordion';
import s from './Faq.module.css';

export function Faq({ items, eyebrow, title }: { items: { q: string; a: string }[]; eyebrow: string; title: string }) {
  useT();
  return (
    <section className="section sheet sheet-white" aria-labelledby="faq-title">
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <p className={`t-caption ${s.eyebrow}`}><span className="chapter" aria-hidden="true" />{eyebrow}</p>
          <h2 id="faq-title" className="t-h2" data-reveal>{title}</h2>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
