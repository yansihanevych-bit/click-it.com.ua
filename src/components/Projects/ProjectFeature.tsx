import { Link } from 'react-router';
import type { Project } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { Picture } from '@/components/ui/Picture';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './ProjectFeature.module.css';

export type FeatureLayout = 'full' | 'right' | 'left' | 'center';
export const LAYOUT_CYCLE: FeatureLayout[] = ['full', 'right', 'left', 'center'];

/**
 * Presentation-first project block. Four editorial layouts create rhythm;
 * the screenshot sits in a browser frame (70–80% of the block), with a second UI fragment layered on top.
 */
export function ProjectFeature({ project, index, layout, headingLevel = 3 }: { project: Project; index: number; layout: FeatureLayout; headingLevel?: 2 | 3 }) {
  const lang = useLang();
  const { t } = useT(['projects', 'common']);
  const H = `h${headingLevel}` as 'h3';
  const name = t(`items.${project.slug}.name`);
  const summary = t(`items.${project.slug}.summary`);
  const to = href(lang, 'projects', project.slug);
  const fragment = project.gallery[0];
  const sizes = layout === 'full' || layout === 'center' ? '(max-width: 900px) 100vw, 1200px' : '(max-width: 900px) 100vw, 60vw';

  return (
    <article className={`${s.feature} ${s[layout]}`}>
      <Link to={to} viewTransition className={s.link} data-cursor="view">
        <div className={s.visual}>
          <div className={s.frame} data-reveal="image" style={{ viewTransitionName: `project-${project.slug}` }}>
            <div className={s.bar} aria-hidden="true"><i /><i /><i /><span>{name}</span></div>
            <div className={s.shot}>
              <Picture name={project.image} alt={`${name} — ${summary}`} ratio={project.ratio} sizes={sizes} />
            </div>
            <span className={s.overlay} aria-hidden="true"><span className={s.pill}>{t('common:cta.viewProject')} <ArrowIcon size={10} /></span></span>
          </div>
          {fragment && (
            <div className={s.fragment} data-parallax="0.12" aria-hidden="true">
              <div className={s.fragInner}><Picture name={fragment} alt="" ratio={project.ratio} sizes="360px" /></div>
            </div>
          )}
          <span className={s.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className={s.meta}>
          <div className={s.nameRow}>
            <H className={s.name}>{name}</H>
            <span className={s.arrow} aria-hidden="true"><ArrowIcon size={16} /></span>
          </div>
          <p className={s.summary}>{summary}</p>
          <ul className={s.tags} aria-label={t('labels.services')}>
            <li className={s.industry}>{t(`industries.${project.industry}`)}</li>
            {project.work.map((w) => <li key={w}>{t(`work.${w}`)}</li>)}
          </ul>
          <span className={s.cta}>{t('common:cta.viewProject')} <ArrowIcon size={10} /></span>
        </div>
      </Link>
    </article>
  );
}
