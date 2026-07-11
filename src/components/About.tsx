export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-parchment">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Placeholder portrait */}
        <div className="aspect-square bg-sand rounded-sm flex items-center justify-center border border-sand">
          <span className="text-charcoal/30 text-sm">Portrait placeholder</span>
        </div>
        <div>
          <h2 className="font-serif text-4xl text-espresso mb-6">About</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Rithi Vilas is a multidisciplinary artist and designer working across traditional 
            and digital mediums. With a foundation in classical sketching and a passion for 
            modern tools, each piece bridges the handmade and the digital.
          </p>
          <p className="text-charcoal/70 leading-relaxed">
            Inspired by mid-century aesthetics, natural forms, and architectural geometry — 
            this portfolio is a living collection of creative exploration.
          </p>
        </div>
      </div>
    </section>
  )
}
