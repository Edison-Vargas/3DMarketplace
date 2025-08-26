export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  printType: 'FDM' | 'SLA' | 'SLS';
  material: string;
  colors: string[];
  dimensions: string;
  printTime: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  rating: number;
  reviews: Review[];
  tags: string[];
  featured: boolean;
  downloadable: boolean;
  modelUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  images?: string[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Dragão Místico - Miniatura de RPG',
    description: 'Miniatura detalhada de dragão para jogos de RPG. Impressa em resina SLA com alta qualidade e detalhamento excepcional. Perfeita para campanhas de D&D e outros jogos de mesa.',
    price: 45.90,
    images: ['/src/assets/dragon-miniature-main.jpg', '/src/assets/dragon-miniature-detail.jpg', '/src/assets/dragon-miniature.jpg'],
    category: 'Miniaturas',
    printType: 'SLA',
    material: 'Resina Fotopolimérica',
    colors: ['Cinza', 'Preto', 'Vermelho', 'Dourado'],
    dimensions: '5cm x 4cm x 6cm',
    printTime: '4 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.9,
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: 'Manuela Costa',
        rating: 5,
        comment: 'Qualidade incrível! Os detalhes são perfeitos e a impressão ficou impecável. Recomendo muito!',
        date: new Date('2024-01-15'),
        images: ['/src/assets/dragon-miniature-detail.jpg']
      },
      {
        id: '2',
        userId: '3',
        userName: 'Carlos Silva',
        rating: 4,
        comment: 'Muito bom produto, chegou rápido e bem embalado. Apenas o acabamento poderia ser um pouco melhor.',
        date: new Date('2024-01-10')
      }
    ],
    tags: ['RPG', 'Miniatura', 'Dragão', 'Alta Qualidade'],
    featured: true,
    downloadable: false
  },
  {
    id: '2',
    name: 'Vaso Decorativo Geométrico',
    description: 'Vaso moderno com design geométrico exclusivo. Ideal para plantas suculentas e decoração de ambientes contemporâneos. Design único e funcional.',
    price: 32.50,
    images: ['/src/assets/geometric-vase-main.jpg', '/src/assets/geometric-vase-lifestyle.jpg'],
    category: 'Decoração',
    printType: 'FDM',
    material: 'PLA+',
    colors: ['Branco', 'Preto', 'Azul', 'Verde'],
    dimensions: '12cm x 12cm x 15cm',
    printTime: '6 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.7,
    reviews: [
      {
        id: '3',
        userId: '1',
        userName: 'Manuela Costa',
        rating: 5,
        comment: 'Perfeito para minha decoração! O design é lindo e a qualidade da impressão surpreendeu.',
        date: new Date('2024-01-20')
      }
    ],
    tags: ['Vaso', 'Decoração', 'Geométrico', 'Moderno'],
    featured: true,
    downloadable: false
  },
  {
    id: '3',
    name: 'Suporte para Smartphone Ajustável',
    description: 'Suporte ergonômico e ajustável para smartphones. Design funcional que permite múltiplos ângulos de visualização. Compatível com a maioria dos dispositivos.',
    price: 18.90,
    images: ['/src/assets/smartphone-stand-main.jpg', '/src/assets/smartphone-stand-lifestyle.jpg'],
    category: 'Acessórios',
    printType: 'FDM',
    material: 'PETG',
    colors: ['Preto', 'Branco', 'Azul'],
    dimensions: '8cm x 6cm x 10cm',
    printTime: '3 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.6,
    reviews: [],
    tags: ['Suporte', 'Smartphone', 'Ajustável', 'Funcional'],
    featured: false,
    downloadable: false
  },
  {
    id: '4',
    name: 'Kit de Peças para Drone',
    description: 'Kit completo de peças de reposição para drones. Inclui hélices, suportes e proteções. Material resistente e leve.',
    price: 67.80,
    images: ['/src/assets/drone-kit-main.jpg', '/src/assets/hero-3d-printer.jpg'],
    category: 'Tecnologia',
    printType: 'SLS',
    material: 'Nylon PA12',
    colors: ['Preto', 'Branco'],
    dimensions: 'Variado',
    printTime: '8 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.8,
    reviews: [
      {
        id: '4',
        userId: '4',
        userName: 'Ana Santos',
        rating: 5,
        comment: 'Excelente qualidade! As peças se encaixaram perfeitamente no meu drone.',
        date: new Date('2024-01-18')
      }
    ],
    tags: ['Drone', 'Kit', 'Peças', 'Tecnologia'],
    featured: false,
    downloadable: false
  },
  {
    id: '5',
    name: 'Luminária de Mesa LED',
    description: 'Luminária moderna com design minimalista. Base para LED integrado, perfeita para escritórios e home office.',
    price: 89.90,
    images: ['/src/assets/led-desk-lamp-main.jpg', '/src/assets/led-desk-lamp-ambient.jpg'],
    category: 'Iluminação',
    printType: 'FDM',
    material: 'PLA',
    colors: ['Branco', 'Preto', 'Cinza'],
    dimensions: '20cm x 15cm x 35cm',
    printTime: '12 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.5,
    reviews: [],
    tags: ['Luminária', 'LED', 'Mesa', 'Escritório'],
    featured: true,
    downloadable: false
  },
  {
    id: '6',
    name: 'Organizador de Mesa Modular',
    description: 'Sistema modular de organização para mesa de trabalho. Compartimentos personalizáveis para diferentes necessidades.',
    price: 54.30,
    images: ['/src/assets/desk-organizer-main.jpg', '/src/assets/geometric-vase.jpg'],
    category: 'Organização',
    printType: 'FDM',
    material: 'ABS',
    colors: ['Preto', 'Branco', 'Azul', 'Vermelho'],
    dimensions: '25cm x 15cm x 8cm',
    printTime: '7 horas',
    sellerId: '2',
    sellerName: 'Ricardo Almeida',
    sellerRating: 4.8,
    rating: 4.7,
    reviews: [
      {
        id: '5',
        userId: '1',
        userName: 'Manuela Costa',
        rating: 5,
        comment: 'Muito prático! Consegui organizar toda minha mesa de trabalho.',
        date: new Date('2024-01-22')
      }
    ],
    tags: ['Organizador', 'Mesa', 'Modular', 'Escritório'],
    featured: false,
    downloadable: false
  }
];

export const categories = [
  'Todos',
  'Miniaturas',
  'Decoração',
  'Acessórios',
  'Tecnologia',
  'Iluminação',
  'Organização',
  'Jogos',
  'Arte',
  'Ferramentas'
];

export const printTypes = ['Todos', 'FDM', 'SLA', 'SLS'];
export const materials = ['Todos', 'PLA', 'ABS', 'PETG', 'Resina', 'Nylon'];
export const priceRanges = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: 'Até R$ 25', min: 0, max: 25 },
  { label: 'R$ 25 - R$ 50', min: 25, max: 50 },
  { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
  { label: 'Acima de R$ 100', min: 100, max: Infinity },
];