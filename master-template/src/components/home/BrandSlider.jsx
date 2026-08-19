import brands from '../../data/brands.json'

/**
 * Infinite marquee of brand names — pure CSS animation.
 */
export default function BrandSlider() {
  const doubled = [...brands, ...brands]

  return (
    <section className="border-y border-line bg-surface/50 py-10">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {doubled.map((b, i) => (
            <span
              key={`${b.id}-${i}`}
              className="whitespace-nowrap font-display text-2xl text-ink/60 transition hover:text-ink"
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
