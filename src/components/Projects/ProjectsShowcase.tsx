import { PROJECTS } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from './ProjectCard';
import s from './Projects.module.css';

export function ProjectsShowcase() {
  const lang = useLang();
  const { t } = useT(['home', 'common']);
  const featured = PROJECTS.filter((p) => p.featured);
  return (
    <section className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader id="projects-title" eyebrow={t('projects.eyebrow')} title={t('projects.title')} lead={t('projects.lead')} split />
        <div className={s.showcase}>
          {featured.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} size={i === 0 || i === 3 ? 'l' : 'm'} />)}
        </div>
        <div className={s.more}><Button to={href(lang, 'projects')} variant="dark">{t('common:cta.allProjects')}</Button></div>
      </div>
    </section>
  );
}
