export interface ArtworkItem {
  id: string
  title: string
  author: string
  date: string
  description: string
  image: string
  orientation: 'portrait' | 'landscape'
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
    cover: '/assets/covers/cover.png',
    items: [
        { id: 's1', title: 'Papaya Tree', author: 'Rithicaa', date: '2020', description: 'Sketched and painted a Papaya Tree using watercolours.', image: '/assets/sketchbook/1.jpeg', orientation: 'portrait' },
      { id: 's2', title: 'Ashok Tree', author: 'Rithicaa', date: '2020', description: 'Sketched and painted an Ashok Tree using watercolours.', image: '/assets/sketchbook/2.jpeg', orientation: 'portrait' },
      { id: 's3', title: 'Coconut Tree', author: 'Rithicaa', date: '2021', description: 'Sketched and painted a Coconut Tree using watercolours.', image: '/assets/sketchbook/3.jpeg', orientation: 'portrait' },
      { id: 's4', title: 'Poppy', author: 'Rithicaa', date: '2019', description: 'Sketched and painted a poppy using acrylics.', image: '/assets/sketchbook/4.jpeg', orientation: 'landscape' },
      { id: 's4', title: 'Posha Girl', author: 'Rithicaa', date: '2020', description: 'Sketched my version of Potassium if it was a character in a Chemistry show.', image: '/assets/sketchbook/5.jpeg', orientation: 'portrait' },
      { id: 's4', title: 'Sai Baba', author: 'Rithicaa', date: '2020', description: 'Sketched and added some shading for Shri Sai Baba.', image: '/assets/sketchbook/6.jpeg', orientation: 'portrait' },
    ],
  },
  {
    id: 'digital-art',
    title: 'Digital Art',
    cover: '/assets/covers/cover.png',
    items: [
      { id: 'd1', title: 'City Girl', author: 'Rithicaa', date: '2024', description: 'Digital art of a city girl modelling on Friday night.', image: '/assets/digital-art/1.jpeg', orientation: 'portrait' },
      { id: 'd2', title: 'Hindu Goddess', author: 'Rithicaa', date: '2024', description: 'Digital art of a Hindu Goddess.', image: '/assets/digital-art/2.jpeg', orientation: 'portrait' },
      { id: 'd3', title: 'Fruit Town', author: 'Rithicaa', date: '2024', description: 'Digital art of a Fruit town, home to fairies and elves.', image: '/assets/digital-art/3.jpeg', orientation: 'landscape' },
    ],
  },
  {
    id: 'cad',
    title: 'CAD',
    cover: '/assets/covers/cover.png',
    items: [
      { id: 'c1', title: 'Power Feed Bracket', author: 'Rithicaa', date: '2024', description: 'Made a 3D CAD model of a Power Feed Bracket.', image: '/assets/cad/1.png', orientation: 'portrait' },
      { id: 'c2', title: 'Flanged Mounting Base', author: 'Rithicaa', date: '2024', description: 'Made a 3D CAD model of a Flanged Mounting Base.', image: '/assets/cad/2.png', orientation: 'portrait' },
      { id: 'c3', title: 'RockStar Pumpkin Candle Holder', author: 'Rithicaa', date: '2024', description: 'Made a 3D CAD model of a pumpkin candle holder. Has a cute rockstar face designed.', image: '/assets/cad/3.png', orientation: 'portrait' },
      { id: 'c4', title: 'Yazhi Pumpkin Candle Holder', author: 'Rithicaa', date: '2024', description: 'Made a 3D CAD model of a pumpkin candle holder. Has mythical beast called Yazhi as design', image: '/assets/cad/4.png', orientation: 'portrait' },
      { id: 'c5', title: 'Greenhouse Temperature Monitoring System PCB', author: 'Rithicaa', date: '2025', description: 'Planned,Designed and Arranged schematic and PCB for Greenhouse Temperature Monitoring System.', image: '/assets/cad/5.png', orientation: 'landscape'},
      { id: 'c6', title: 'Servo Cam', author: 'Rithicaa', date: '2025', description: 'Designed and made a 3D CAD model of a Servo Cam for Greenhouse Temperature Monitoring System.', image: '/assets/cad/6.png', orientation: 'portrait'},
      { id: 'c7', title: 'Roof Mount', author: 'Rithicaa', date: '2025', description: 'Designed and made a 3D CAD model of a Roof Mount for Greenhouse Temperature Monitoring System.', image: '/assets/cad/7.png', orientation: 'portrait'},
      { id: 'c8', title: 'Greenhouse Temperature Monitoring System', author: 'Rithicaa', date: '2025', description: 'Designed and assembled all components of the Greenhouse Temperature Monitoring System.', image: '/assets/cad/8.png', orientation: 'portrait'},
    ],
  },
  {
    id: 'photography',
    title: 'Photography',
    cover: '/assets/covers/cover.png',
    items: [
      { id: 'p1', title: 'Big Ben', author: 'Rithicaa', date: '2025', description: 'Picture of Big Ben on a sunny day.', image: '/assets/photography/1.jpeg', orientation: 'portrait' },
      { id: 'p2', title: 'Sun through the woods', author: 'Rithicaa', date: '2026', description: 'Golden hour landscape capture.', image: '/assets/photography/2.jpeg', orientation: 'portrait' },
      { id: 'p3', title: 'Plane near Big Ben', author: 'Rithicaa', date: '2025', description: 'Plane flying near Big Ben.', image: '/assets/photography/3.jpeg', orientation: 'landscape' },
      { id: 'p4', title: 'Symmetry', author: 'Rithicaa', date: '2025', description: 'Architectural symmetry study.', image: '/assets/photography/4.jpeg', orientation: 'landscape' },
      { id: 'p5', title: 'Jumping Squirrel', author: 'Rithicaa', date: '2026', description: 'Squirrel jumping to the tree.', image: '/assets/photography/5.jpeg', orientation: 'portrait'},
    ],
  },
]
