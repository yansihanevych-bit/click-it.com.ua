import { Seo } from '@/seo/Seo';
import { faqSchema, organizationSchema, websiteSchema } from '@/seo/schema';
import { getLanguage } from '@/config/languages';
import { useLang, useT } from '@/hooks/useLang';
import { Hero } from '@/components/Hero/Hero';
import { Trust } from '@/components/Trust/Trust';
import { ServicesShowcase } from '@/components/Services/ServicesShowcase';
import { Approach } from '@/components/About/Approach';
import { ProjectsShowcase } from '@/components/Projects/ProjectsShowcase';
import { BusinessValue } from '@/components/Value/BusinessValue';
import { Process } from '@/components/Process/Process';
import { Stats } from '@/components/Stats/Stats';
import { Faq } from '@/components/Faq/Faq';
import { CtaSection } from '@/components/CTA/CtaSection';

export default function HomePage() {
  const lang = useLang();
  const { t } = useT('home');
  const faq = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  return (
    <>
      <Seo
        lang={lang}
        path=""
        title={t('meta.title')}
        description={t('meta.description')}
        jsonLd={[organizationSchema(lang, t('meta.description')), websiteSchema(lang, getLanguage(lang).hreflang), faqSchema(faq)]}
      />
      <Hero />
      <Trust />
      <ServicesShowcase />
      <Approach />
      <ProjectsShowcase />
      <BusinessValue />
      <Process />
      <Stats />
      <Faq items={faq} eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
      <CtaSection />
    </>
  );
}
