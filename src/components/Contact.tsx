import { Mail, ExternalLink } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-4xl text-espresso mb-4">Get in Touch</h2>
        <p className="text-charcoal/60 mb-10">
          Interested in a commission or collaboration? Reach out below.
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="mailto:hello@example.com"
            className="flex items-center gap-2 px-6 py-3 border border-charcoal/20 rounded-sm text-sm hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <Mail size={16} />
            Email
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-charcoal/20 rounded-sm text-sm hover:border-terracotta hover:text-terracotta transition-colors"
          >
            <ExternalLink size={16} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
