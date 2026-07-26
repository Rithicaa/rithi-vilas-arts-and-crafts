import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { portfolioBooks } from '@/lib/data'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ArtworkItem } from '@/lib/data'

function FlipCard({ item }: { item: ArtworkItem }) {
  const aspect = item.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'

  return (
    <div className="group perspective-[1000px]">
      <div className={`relative w-full ${aspect} transition-transform duration-500 transform-3d group-hover:rotate-y-180`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-sm overflow-hidden shadow-md border-2 border-white bg-white rotate-[-1deg] group-hover:rotate-0 transition-transform">
          {item.image ? (
            <>
              <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" style={{ transform: 'rotate(-25deg)', transformOrigin: 'center' }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute text-white/20 text-xs font-serif tracking-widest whitespace-nowrap"
                    style={{
                      top: `${(i % 4) * 28 - 10}%`,
                      left: `${Math.floor(i / 4) * 38 - 10}%`,
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    }}
                  >
                    Rithi Vilas
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-sand flex items-center justify-center">
              <span className="text-charcoal/30 text-xs text-center px-2">{item.title}<br />placeholder</span>
            </div>
          )}
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-sm bg-espresso text-cream p-5 flex flex-col justify-center shadow-md">
          <h4 className="font-serif text-lg mb-3">{item.title}</h4>
          <div className="w-8 h-px bg-gold mb-3" />
          <p className="text-cream/70 text-xs mb-2"><span className="text-gold">Artist:</span> {item.author}</p>
          <p className="text-cream/70 text-xs mb-2"><span className="text-gold">Date:</span> {item.date}</p>
          <p className="text-cream/60 text-xs leading-relaxed mt-2">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

function BookPageSpread({ items, pageNum, total }: { items: ArtworkItem[], pageNum: number, total: number }) {
  const isLandscape = items.length === 1 && items[0].orientation === 'landscape'
  return (
    <div className="bg-parchment rounded-sm shadow-xl border border-sand relative overflow-hidden">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-terracotta/20" />
      <div className="p-8 md:p-12 pl-10 md:pl-14">
        <div className={isLandscape ? 'max-w-xl mx-auto' : 'grid grid-cols-2 gap-8'}>
          {items.map((item) => (
            <FlipCard key={item.id} item={item} />
          ))}
          {!isLandscape && items.length === 1 ? <div /> : null}
        </div>
        <p className="text-center text-charcoal/30 text-xs mt-10 italic">
          Page {pageNum} of {total} — hover to reveal details
        </p>
      </div>
    </div>
  )
}

export function BookPage() {
  const { bookId } = useParams()
  const book = portfolioBooks.find((b) => b.id === bookId)
  const [page, setPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Book not found.</p>
      </div>
    )
  }

  const pages: ArtworkItem[][] = []
  let i = 0
  while (i < book.items.length) {
    const item = book.items[i]
    if (item.orientation === 'landscape') {
      pages.push([item])
      i++
    } else {
      const next = book.items[i + 1]
      if (next && next.orientation === 'portrait') {
        pages.push([item, next])
        i += 2
      } else {
        pages.push([item])
        i++
      }
    }
  }
  const totalPages = pages.length

  function navigate(dir: 'next' | 'prev') {
    if (flipping) return
    setDirection(dir)
    setFlipping(true)
    setTimeout(() => {
      setPage((p) => dir === 'next' ? p + 1 : p - 1)
      setFlipping(false)
    }, 350)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-terracotta transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>

        {/* Book title */}
        <div className="mb-6 pl-2">
          <h1 className="font-serif text-4xl text-espresso">{book.title}</h1>
          <p className="text-charcoal/50 text-sm uppercase tracking-wider mt-1">Collection by Rithi Vilas</p>
        </div>

        {/* Page with flip animation */}
        <div
          className="transition-all duration-350 ease-in-out"
          style={{
            opacity: flipping ? 0 : 1,
            transform: flipping
              ? `perspective(1200px) rotateY(${direction === 'next' ? '-15deg' : '15deg'})`
              : 'perspective(1200px) rotateY(0deg)',
            transformOrigin: direction === 'next' ? 'left center' : 'right center',
          }}
        >
          <BookPageSpread
            items={pages[page]}
            pageNum={page + 1}
            total={totalPages}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 px-1">
          <button
            onClick={() => navigate('prev')}
            disabled={page === 0 || flipping}
            className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-terracotta transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page dots */}
          <div className="flex gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (!flipping && i !== page) { setDirection(i > page ? 'next' : 'prev'); setFlipping(true); setTimeout(() => { setPage(i); setFlipping(false) }, 350) } }}
                className={`w-2 h-2 rounded-full transition-colors ${i === page ? 'bg-terracotta' : 'bg-charcoal/20 hover:bg-charcoal/40'}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate('next')}
            disabled={page === totalPages - 1 || flipping}
            className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-terracotta transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
