export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-parchment">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-sm overflow-hidden border border-sand">
          <img src="/about.png" alt="Rithi Vilas" className="w-full h-full object-cover" style={{ objectPosition: '39% center' }} />
        </div>
        <div>
          <h2 className="font-serif text-4xl text-espresso mb-6">About</h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            Rithi Vilas is more than just a name—it's a piece of our story.
            Created by combining the nicknames of two sisters, Rithicaa and Vilasini, it represents both our
            bond and our shared love for creating, learning, and expressing ourselves through art.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            As artists, designers, and aspiring engineers, we enjoy bringing ideas to life through both traditional
            and digital art. From hand-drawn sketches to digital illustrations, every piece is created with care
            and curiosity.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            We believe art is about telling stories, celebrating creativity, and finding beauty in the little things.
            Thank you for being a part of our journey.
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
