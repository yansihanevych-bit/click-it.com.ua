import { Seo } from '@/seo/Seo';
import { absUrl } from '@/seo/head';
import { breadcrumbSchema } from '@/seo/schema';
import { href, useLang, useT } from '@/hooks/useLang';
import { PageHero } from '@/components/PageHero/PageHero';
import { Trust } from '@/components/Trust/Trust';
import { Stats } from '@/components/Stats/Stats';
import { Process } from '@/components/Process/Process';
import { CtaSection } from '@/components/CTA/CtaSection';
import { BrandMark } from '@/components/ui/ArrowIcon';
import s from './About.module.css';

export default function AboutPage() {
  const lang = useLang();
  const { t } = useT(['pages', 'common']);
  const story = t('about.story', { returnObjects: true }) as string[];
  const values = t('about.values', { returnObjects: true }) as { title: string; text: string }[];
  return (
    <>
      <Seo
        lang={lang}
        path="about"
        title={t('about.metaTitle')}
        description={t('about.metaDescription')}
        jsonLd={[breadcrumbSchema([
          { name: t('common:breadcrumbs.home'), url: absUrl(lang, '') },
          { name: t('about.h1'), url: absUrl(lang, 'about') },
        ])]}
      />
      <PageHero crumbs={[{ name: t('common:breadcrumbs.home'), to: href(lang) }, { name: t('about.h1') }]} title={t('about.h1')} lead={t('about.lead')} />
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="story-title">
        <div className={`container ${s.story}`}>
          <div className={s.mark} data-reveal="scale"><BrandMark size={200} /></div>
          <div>
            <h2 id="story-title" className="t-h2" data-reveal>{t('about.storyTitle')}</h2>
            {story.map((p, i) => <p key={i} className={s.p} data-reveal>{p}</p>)}
          </div>
        </div>
      </section>
      <Trust />
      <section className={`section ${s.values}`} aria-labelledby="values-title">
        <div className="container">
          <h2 id="values-title" className="t-h2" data-reveal>{t('about.valuesTitle')}</h2>
          <ol className={s.grid}>
            {values.map((v, i) => (
              <li key={i} className={s.value} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <span className={s.n}>{String(i + 1).padStart(2, '0')}/</span>
                <h3 className="t-h3">{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ol>
          <div className={s.full} data-reveal>
            <h2 className="t-h3">{t('about.fullCycleTitle')}</h2>
            <p>{t('about.fullCycle')}</p>
          </div>
        </div>
      </section>
      <Stats />
      <Process />
      <CtaSection />
    </>
  );
}
