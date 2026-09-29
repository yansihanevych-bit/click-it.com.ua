/**
 * Responsive project image: AVIF → WebP, 640w/1200w, explicit dimensions (no CLS), lazy by default.
 * Source files: /public/images/projects/<name>-<w>.<ext>
 */
interface Props { name: string; alt: string; ratio: number; sizes?: string; priority?: boolean; className?: string }

export function Picture({ name, alt, ratio, sizes = '(max-width: 768px) 100vw, 50vw', priority, className }: Props) {
  const base = `/images/projects/${name}`;
  const set = (ext: string) => `${base}-640.${ext} 640w, ${base}-1200.${ext} 1200w`;
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${base}-1200.webp`}
        alt={alt}
        width={1200}
        height={Math.round(1200 / ratio)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
