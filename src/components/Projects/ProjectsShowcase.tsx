import { PROJECTS } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { SplitText } from '@/components/ui/SplitText';
import { Button } from '@/components/ui/Button';
import { ProjectFeature } from './ProjectFeature';
import s from './Projects.module.css';

export function ProjectsShowcase() {
  const lang = useLang();
  const { t } = useT(['home', 'common']);
  const featured = PROJECTS.filter((p) => p.featured);
  return (
    <section className={`section sheet sheet-white ${s.section}`} aria-labelledby="projects-title">
      <div className="container">
        <header className={s.head}>
          <div>
            <p className={`t-caption ${s.eyebrow}`}><span className="chapter" aria-hidden="true" />{t('projects.eyebrow')}</p>
            <SplitText id="projects-title" className="t-mega" squareEnd lines={t('projects.titleLines', { returnObjects: true }) as string[]} />
          </div>
          <div className={s.headAside} data-reveal>
            <span className={s.count}>({String(PROJECTS.length).padStart(2, '0')})</span>
            <p className="t-lead">{t('projects.lead')}</p>
          </div>
        </header>
        <div className={s.stack}>
          {featured.map((p, i) => <ProjectFeature key={p.slug} project={p} index={i} />)}
        </div>
        <div className={s.more}><Button to={href(lang, 'projects')} variant="dark">{t('common:cta.allProjects')}</Button></div>
      </div>
    </section>
  );
}
