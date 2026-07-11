export interface ArtworkItem {
  id: string
  title: string
  author: string
  date: string
  description: string
  image: string
}

export interface PortfolioBook {
  id: string
  title: string
  cover: string
  items: ArtworkItem[]
}

export const portfolioBooks: PortfolioBook[] = [
  {
    id: 'sketchbook',
    title: 'Sketchbook',
    cover: '/assets/covers/sketchbook.jpg',
    items: [
      { id: 's1', title: 'Sketch 1', author: 'Rithi Vilas', date: '2024', description: 'Pencil on paper, exploring form and shadow.', image: '/assets/sketchbook/1.jpg' },
      { id: 's2', title: 'Sketch 2', author: 'Rithi Vilas', date: '2024', description: 'Charcoal study of organic shapes.', image: '/assets/sketchbook/2.jpg' },
      { id: 's3', title: 'Sketch 3', author: 'Rithi Vilas', date: '2024', description: 'Ink wash landscape composition.', image: '/assets/sketchbook/3.jpg' },
      { id: 's4', title: 'Sketch 4', author: 'Rithi Vilas', date: '2024', description: 'Graphite portrait study.', image: '/assets/sketchbook/4.jpg' },
    ],
  },
  {
    id: 'digital-art',
    title: 'Digital Art',
    cover: '/assets/covers/digital-art.jpg',
    items: [
      { id: 'd1', title: 'Digital Piece 1', author: 'Rithi Vilas', date: '2024', description: 'Digital painting exploring color theory.', image: '/assets/digital-art/1.jpg' },
      { id: 'd2', title: 'Digital Piece 2', author: 'Rithi Vilas', date: '2024', description: 'Abstract composition in Procreate.', image: '/assets/digital-art/2.jpg' },
      { id: 'd3', title: 'Digital Piece 3', author: 'Rithi Vilas', date: '2024', description: 'Character concept illustration.', image: '/assets/digital-art/3.jpg' },
      { id: 'd4', title: 'Digital Piece 4', author: 'Rithi Vilas', date: '2024', description: 'Environment design study.', image: '/assets/digital-art/4.jpg' },
    ],
  },
  {
    id: 'cad',
    title: 'CAD',
    cover: '/assets/covers/cad.jpg',
    items: [
      { id: 'c1', title: 'CAD Model 1', author: 'Rithi Vilas', date: '2024', description: 'Parametric furniture design.', image: '/assets/cad/1.jpg' },
      { id: 'c2', title: 'CAD Model 2', author: 'Rithi Vilas', date: '2024', description: '3D printed sculpture prototype.', image: '/assets/cad/2.jpg' },
      { id: 'c3', title: 'CAD Model 3', author: 'Rithi Vilas', date: '2024', description: 'Architectural detail rendering.', image: '/assets/cad/3.jpg' },
      { id: 'c4', title: 'CAD Model 4', author: 'Rithi Vilas', date: '2024', description: 'Product design iteration.', image: '/assets/cad/4.jpg' },
    ],
  },
  {
    id: 'photography',
    title: 'Photography',
    cover: '/assets/covers/photography.jpg',
    items: [
      { id: 'p1', title: 'Photo 1', author: 'Rithi Vilas', date: '2024', description: 'Golden hour landscape capture.', image: '/assets/photography/1.jpg' },
      { id: 'p2', title: 'Photo 2', author: 'Rithi Vilas', date: '2024', description: 'Macro study of natural textures.', image: '/assets/photography/2.jpg' },
      { id: 'p3', title: 'Photo 3', author: 'Rithi Vilas', date: '2024', description: 'Street photography in monochrome.', image: '/assets/photography/3.jpg' },
      { id: 'p4', title: 'Photo 4', author: 'Rithi Vilas', date: '2024', description: 'Architectural symmetry study.', image: '/assets/photography/4.jpg' },
    ],
  },
]
