export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-olive mb-4">Arts &amp; Crafts Portfolio</p>
        <h1 className="font-serif text-6xl md:text-8xl text-espresso leading-tight mb-6">
          Rithi Vilas
        </h1>
        <p className="text-lg text-charcoal/70 max-w-xl mx-auto leading-relaxed">
          A curated collection of sketches, digital art, CAD designs, and photography — 
          crafted with intention and inspired by the world around us.
        </p>
        <div className="mt-10">
          <a
            href="#portfolio"
            className="inline-block px-8 py-3 bg-terracotta text-cream rounded-sm text-sm uppercase tracking-wider hover:bg-rust transition-colors"
          >
            View Work
          </a>
        </div>
      </div>
    </section>
  )
}
