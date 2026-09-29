import { Link } from 'react-router';
import type { Project } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { Picture } from '@/components/ui/Picture';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './Projects.module.css';

export function ProjectCard({ project, index, size = 'm', headingLevel = 3 }: { project: Project; index: number; size?: 'l' | 'm'; headingLevel?: 2 | 3 }) {
  const lang = useLang();
  const { t } = useT(['projects', 'common']);
  const H = `h${headingLevel}` as 'h3';
  const name = t(`items.${project.slug}.name`);
  return (
    <article className={[s.card, size === 'l' && s.large].filter(Boolean).join(' ')} data-reveal style={{ ['--reveal-i' as string]: index % 2 }}>
      <Link to={href(lang, 'projects', project.slug)} className={s.link} data-cursor="view">
        <div className={s.media}>
          <Picture name={project.image} alt={`${name} — ${t(`items.${project.slug}.summary`)}`} ratio={project.ratio} sizes={size === 'l' ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 42vw'} />
          <span className={s.overlay} aria-hidden="true">
            <span className={s.pill}>{t('common:cta.viewProject')} <ArrowIcon size={10} /></span>
          </span>
          <span className={s.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className={s.meta}>
          <ul className={s.tags} aria-label={t('labels.services')}>
            <li>{t(`industries.${project.industry}`)}</li>
            {project.work.map((w) => <li key={w}>{t(`work.${w}`)}</li>)}
          </ul>
          <div className={s.row}>
            <H className={s.name}>{name}</H>
            <span className={s.arrow} aria-hidden="true"><ArrowIcon size={14} /></span>
          </div>
          <p className={s.summary}>{t(`items.${project.slug}.summary`)}</p>
        </div>
      </Link>
    </article>
  );
}
