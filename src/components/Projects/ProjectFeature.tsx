import { Link } from 'react-router';
import type { Composition, Project } from '@/data/projects';
import { href, useLang, useT } from '@/hooks/useLang';
import { Picture } from '@/components/ui/Picture';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import s from './ProjectFeature.module.css';

/** Text placement follows the composition, so consecutive cases never look alike. */
const LAYOUT: Record<Composition, 'full' | 'right' | 'left' | 'center'> = {
  stage: 'full',
  devices: 'right',
  lookbook: 'left',
  panorama: 'center',
};

/**
 * Presentation-first case block. Each case has its own art direction:
 *  stage    — dark stage, browser in perspective, oversized outline index
 *  devices  — desktop + phone, the key feature called out
 *  lookbook — tinted spread with layered, tilted screens
 *  panorama — cinematic wide crop
 */
export function ProjectFeature({ project, index, headingLevel = 3 }: { project: Project; index: number; headingLevel?: 2 | 3 }) {
  const lang = useLang();
  const { t } = useT(['projects', 'common']);
  const H = `h${headingLevel}` as 'h3';
  const c = project.composition;
  const layout = LAYOUT[c];
  const name = t(`items.${project.slug}.name`);
  const summary = t(`items.${project.slug}.summary`);
  const to = href(lang, 'projects', project.slug);
  const fragment = project.gallery[0];
  const num = String(index + 1).padStart(2, '0');
  const sizes = layout === 'full' || layout === 'center' ? '(max-width: 900px) 100vw, 1200px' : '(max-width: 900px) 100vw, 60vw';
  const feature = project.work.find((w) => w !== 'development' && w !== 'website') ?? project.work[0];

  return (
    <article className={`${s.feature} ${s[layout]} ${s[c]}`}>
      <Link to={to} viewTransition className={s.link} data-cursor="view">
        <div className={s.visual}>
          {(c === 'stage' || c === 'lookbook') && <div className={s.stageBg} aria-hidden="true" />}
          {c === 'stage' && <span className={s.bigNum} aria-hidden="true" data-parallax="0.08">{num}</span>}

          <div className={s.frameWrap}>
            <div className={s.frame} data-reveal="image" style={{ viewTransitionName: `project-${project.slug}` }}>
              <div className={s.bar} aria-hidden="true"><i /><i /><i /><span>{name}</span></div>
              <div className={s.shot}>
                <Picture name={project.image} alt={`${name} — ${summary}`} ratio={project.ratio} sizes={sizes} />
              </div>
              <span className={s.overlay} aria-hidden="true"><span className={s.pill}>{t('common:cta.viewProject')} <ArrowIcon size={10} /></span></span>
            </div>
          </div>

          {c === 'devices' && (
            <div className={s.phone} data-parallax="0.1" aria-hidden="true">
              <div className={s.phoneScreen}><Picture name={fragment || project.image} alt="" ratio={project.ratio} sizes="220px" /></div>
            </div>
          )}
          {c === 'devices' && (
            <span className={s.callout} aria-hidden="true"><i />{t(`work.${feature}`)}</span>
          )}
          {(c === 'stage' || c === 'lookbook' || c === 'panorama') && fragment && (
            <div className={s.fragment} data-parallax="0.12" aria-hidden="true">
              <div className={s.fragInner}><Picture name={fragment} alt="" ratio={project.ratio} sizes="360px" /></div>
            </div>
          )}
          {c === 'lookbook' && <span className={s.corner} aria-hidden="true"><ArrowIcon size={22} /></span>}
          {c !== 'stage' && <span className={s.index} aria-hidden="true">{num}</span>}
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
