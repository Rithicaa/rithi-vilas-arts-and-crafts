import { useParams, Link } from 'react-router-dom'
import { portfolioBooks } from '@/lib/data'
import { ArrowLeft } from 'lucide-react'
import type { ArtworkItem } from '@/lib/data'

function FlipCard({ item }: { item: ArtworkItem }) {
  return (
    <div className="group perspective-[1000px]">
      <div className="relative w-full aspect-[3/4] transition-transform duration-500 transform-3d group-hover:rotate-y-180">
        {/* Front - Image */}
        <div className="absolute inset-0 backface-hidden rounded-sm overflow-hidden shadow-md border-4 border-white rotate-[-1deg] group-hover:rotate-0 transition-transform">
          <div className="w-full h-full bg-sand flex items-center justify-center">
            <span className="text-charcoal/30 text-xs text-center px-2">{item.title}<br />placeholder</span>
          </div>
        </div>
        {/* Back - Details */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-sm bg-espresso text-cream p-5 flex flex-col justify-center shadow-md">
          <h4 className="font-serif text-lg mb-3">{item.title}</h4>
          <div className="w-8 h-px bg-gold mb-3" />
          <p className="text-cream/70 text-xs mb-2">
            <span className="text-gold">Artist:</span> {item.author}
          </p>
          <p className="text-cream/70 text-xs mb-2">
            <span className="text-gold">Date:</span> {item.date}
          </p>
          <p className="text-cream/60 text-xs leading-relaxed mt-2">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export function BookPage() {
  const { bookId } = useParams()
  const book = portfolioBooks.find((b) => b.id === bookId)

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Book not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-terracotta transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Book page container */}
        <div className="bg-parchment rounded-sm shadow-xl p-8 md:p-12 border border-sand relative">
          {/* Page texture lines */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-terracotta/20" />

          <div className="pl-6">
            <h1 className="font-serif text-4xl text-espresso mb-2">{book.title}</h1>
            <p className="text-charcoal/50 text-sm mb-10 uppercase tracking-wider">
              Collection by Rithi Vilas
            </p>

            {/* Artwork grid - cards "stuck" on the page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {book.items.map((item) => (
                <FlipCard key={item.id} item={item} />
              ))}
            </div>

            <p className="text-center text-charcoal/30 text-xs mt-12 italic">
              Hover over a piece to see details
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
