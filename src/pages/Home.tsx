import { Hero } from '@/components/Hero'
import { Portfolio } from '@/components/Portfolio'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <About />
      <Contact />
    </>
  )
}
