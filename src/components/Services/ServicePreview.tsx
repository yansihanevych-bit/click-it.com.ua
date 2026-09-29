import { BrandMark } from '@/components/ui/ArrowIcon';
import s from './ServicePreview.module.css';

/**
 * Small, language-neutral "scenes" that illustrate each service.
 * Development services use real Click IT case screenshots; marketing & design use UI mockups.
 */
const Shot = ({ name, className }: { name: string; className?: string }) => (
  <img className={className} src={`/images/projects/${name}-640.webp`} alt="" width={640} height={455} loading="lazy" decoding="async" />
);
const Browser = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={[s.browser, className].filter(Boolean).join(' ')}>
    <div className={s.bar}><i /><i /><i /></div>
    {children}
  </div>
);

export function ServicePreview({ slug }: { slug: string }) {
  switch (slug) {
    case 'web-development':
      return (<div className={s.scene}><Browser className={s.main}><Shot name="avangard" /></Browser><div className={`${s.tag} ${s.tagTR}`}>&lt;/&gt; React · CMS</div></div>);
    case 'ecommerce':
      return (
        <div className={s.scene}>
          <Browser className={s.main}><Shot name="oseque" /></Browser>
          <div className={`${s.card} ${s.cart}`}>
            <span className={s.cartIcon}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4h2l2.4 11h11L21 7H6.2" /><circle cx="9" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></svg></span>
            <div><b>+1</b><i style={{ width: '70%' }} /><i style={{ width: '45%' }} /></div>
            <span className={s.pill}>Checkout</span>
          </div>
        </div>
      );
    case 'landing-page':
      return (
        <div className={s.scene}>
          <div className={s.phone}><Shot name="family" /></div>
          <div className={`${s.card} ${s.conv}`}><small>Conversion</small><b>CTA ↗</b><div className={s.spark}><i style={{ height: '30%' }} /><i style={{ height: '45%' }} /><i style={{ height: '40%' }} /><i style={{ height: '70%' }} /><i style={{ height: '92%' }} /></div></div>
        </div>
      );
    case 'corporate-websites':
      return (<div className={s.scene}><Browser className={s.main}><Shot name="mcorp" /></Browser><div className={`${s.tag} ${s.tagBL}`}>UA · PL · EN</div></div>);
    case 'tilda':
      return (
        <div className={s.scene}>
          <Browser className={s.main}><Shot name="whitewood" /></Browser>
          <div className={`${s.card} ${s.layers}`}>
            <small>Zero Block</small>
            {['Header', 'Hero', 'Gallery', 'Form'].map((l, i) => <span key={l} className={i === 1 ? s.layerOn : undefined}>{l}</span>)}
          </div>
        </div>
      );
    case 'seo':
      return (
        <div className={s.scene}>
          <div className={s.serp}>
            <div className={s.search}><span className={s.g}>G</span><i /><span className={s.loupe}>⌕</span></div>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={[s.result, n === 1 && s.resultTop].filter(Boolean).join(' ')}>
                <span className={s.pos}>{n}</span>
                <div><em>{n === 1 ? 'click-it.com.ua' : 'example.com'}</em><i style={{ width: n === 1 ? '80%' : `${70 - n * 8}%` }} /><i style={{ width: '55%' }} /></div>
              </div>
            ))}
          </div>
          <div className={`${s.card} ${s.rank}`}><small>Top-3</small><b>↑ 12</b></div>
        </div>
      );
    case 'google-ads':
      return (
        <div className={s.scene}>
          <div className={s.serp}>
            <div className={s.search}><span className={s.g}>G</span><i /><span className={s.loupe}>⌕</span></div>
            <div className={`${s.result} ${s.ad}`}><div><em><b className={s.adBadge}>Ad</b> click-it.com.ua</em><i style={{ width: '85%' }} /><i style={{ width: '60%' }} /><div className={s.sitelinks}><span /><span /><span /></div></div></div>
            <div className={s.result}><div><em>example.com</em><i style={{ width: '60%' }} /></div></div>
          </div>
          <div className={`${s.card} ${s.kpi}`}><div><small>CTR</small><b>8.4%</b></div><div><small>CPC</small><b>↓</b></div></div>
        </div>
      );
    case 'smm':
      return (
        <div className={s.scene}>
          <div className={`${s.phone} ${s.feed}`}>
            <div className={s.profile}><span /><i /><i /></div>
            <div className={s.gridPosts}>
              {['avangard', 'oseque', 'family', 'crazybox', 'whitewood', 'mcorp'].map((n) => <Shot key={n} name={n} />)}
            </div>
          </div>
          <div className={`${s.card} ${s.likes}`}>♥ <b>+2.4k</b></div>
        </div>
      );
    case 'email-marketing':
      return (
        <div className={s.scene}>
          <div className={s.mail}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={[s.mailRow, i === 0 && s.mailNew].filter(Boolean).join(' ')}>
                <span className={s.avatar}>{i === 0 ? <BrandMark size={22} /> : null}</span>
                <div><i style={{ width: i === 0 ? '60%' : '45%' }} /><i style={{ width: i === 0 ? '85%' : '70%' }} /></div>
              </div>
            ))}
          </div>
          <div className={`${s.card} ${s.kpi}`}><div><small>Open</small><b>41%</b></div><div><small>Flow</small><b>3→</b></div></div>
        </div>
      );
    case 'design':
      return (
        <div className={s.scene}>
          <div className={`${s.board} ${s.b1}`}><i className={s.wHero} /><i /><i /><div className={s.wGrid}><span /><span /><span /></div></div>
          <div className={`${s.board} ${s.b2}`}><Shot name="oseque" /></div>
          <div className={`${s.card} ${s.swatch}`}><span style={{ background: '#59ADFF' }} /><span style={{ background: '#4E7296' }} /><span style={{ background: '#C7D2E9' }} /><span style={{ background: '#000' }} /></div>
        </div>
      );
    case 'branding':
      return (
        <div className={s.scene}>
          <div className={s.brandBoard}>
            <div className={s.brandMark}><BrandMark size={96} /></div>
            <div className={s.palette}>
              {[['#59ADFF', '59ADFF'], ['#4E7296', '4E7296'], ['#C7D2E9', 'C7D2E9'], ['#000000', '000000']].map(([c, h]) => (
                <div key={h}><span style={{ background: c }} /><small>#{h}</small></div>
              ))}
            </div>
            <div className={s.type}><b>Aa</b><small>Manrope · 800 / 450</small></div>
          </div>
        </div>
      );
    case 'usability-audit':
      return (
        <div className={s.scene}>
          <Browser className={s.main}>
            <div className={s.heatWrap}>
              <Shot name="qoopiqoopi" />
              <span className={s.heat} style={{ left: '22%', top: '30%' }} />
              <span className={s.heat} style={{ left: '64%', top: '58%', width: '26%' }} />
              <span className={s.pin} style={{ left: '30%', top: '24%' }}>1</span>
              <span className={s.pin} style={{ left: '70%', top: '52%' }}>2</span>
              <span className={s.pin} style={{ left: '48%', top: '78%' }}>3</span>
            </div>
          </Browser>
        </div>
      );
    default:
      return null;
  }
}
