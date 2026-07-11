import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Home } from '@/pages/Home'
import { BookPage } from '@/pages/BookPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:bookId" element={<BookPage />} />
      </Routes>
      {/* Footer */}
      <footer className="py-8 text-center text-xs text-charcoal/40 border-t border-sand">
        © {new Date().getFullYear()} Rithi Vilas. All rights reserved.
      </footer>
    </BrowserRouter>
  )
}

export default App
