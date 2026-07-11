import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-sand">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl text-espresso tracking-wide">
          Rithi Vilas
        </Link>
        <div className="flex gap-8 text-sm tracking-wide uppercase text-charcoal/70">
          <a href="/#portfolio" className="hover:text-terracotta transition-colors">Portfolio</a>
          <a href="/#about" className="hover:text-terracotta transition-colors">About</a>
          <a href="/#contact" className="hover:text-terracotta transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  )
}
