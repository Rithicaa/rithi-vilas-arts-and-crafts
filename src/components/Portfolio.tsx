import { Link } from 'react-router-dom'
import { portfolioBooks } from '@/lib/data'

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl text-espresso text-center mb-4">Portfolio</h2>
        <p className="text-center text-charcoal/60 mb-16 max-w-md mx-auto">
          Select a collection to explore
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {portfolioBooks.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="group block"
            >
              <div className="aspect-[3/4] bg-sand rounded-sm overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 relative">
                {/* Placeholder cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-espresso/80 to-charcoal/90 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-0.5 bg-gold mb-6" />
                  <h3 className="font-serif text-2xl text-cream text-center">{book.title}</h3>
                  <div className="w-16 h-0.5 bg-gold mt-6" />
                  <p className="text-cream/50 text-xs uppercase tracking-widest mt-8">Rithi Vilas</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
