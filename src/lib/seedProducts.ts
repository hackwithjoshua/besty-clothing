import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const sampleProducts = [
  {
    name: 'Ankara Wrap Dress',
    description: 'A stunning hand-crafted ankara wrap dress with vibrant kente patterns. Perfect for events, weddings, and celebrations.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    ],
    category: 'dress',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red & Gold', 'Blue & Yellow', 'Green & Orange'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Kente Peplum Top',
    description: 'Elegant peplum top crafted from authentic kente cloth. Pairs beautifully with palazzo trousers or a pencil skirt.',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    ],
    category: 'top',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Yellow & Black', 'Red & Green'],
    inStock: true,
    featured: true,
  },
  {
    name: 'African Print Maxi Skirt',
    description: 'Flowing maxi skirt in bold African print. Versatile enough for day-to-night dressing.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    ],
    category: 'skirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Orange & Black', 'Blue & White'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Aso-Oke Senator Suit',
    description: 'Premium hand-woven aso-oke senator suit. Traditional craftsmanship meets modern silhouette.',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    ],
    category: 'suit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy & Gold', 'Burgundy & Silver'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Boubou Agbada Gown',
    description: 'Luxurious boubou-style gown with intricate embroidery. A masterpiece for special occasions.',
    price: 65000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    ],
    category: 'dress',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gold', 'White & Gold', 'Emerald Green'],
    inStock: true,
    featured: true,
  },
  {
    name: 'Lace Ankara Blouse',
    description: 'Delicate lace blouse with ankara accent trim. Perfect for combining traditional elegance with modern style.',
    price: 18500,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    ],
    category: 'top',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Blush', 'Black'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Iro & Buba Set',
    description: 'Classic iro and buba in premium George fabric. Timeless Yoruba fashion for celebrations and ceremonies.',
    price: 55000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    ],
    category: 'wrapper',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Turquoise', 'Coral', 'Purple'],
    inStock: true,
    featured: false,
  },
  {
    name: 'Beaded Neck Accessories Set',
    description: 'Hand-crafted beaded necklace and bracelet set. Inspired by Yoruba, Igbo, and Hausa bead-making traditions.',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    ],
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['Multi-color', 'Gold & Red', 'Blue & White'],
    inStock: true,
    featured: false,
  },
];

export async function seedProducts() {
  const productsRef = collection(db, 'products');
  for (const product of sampleProducts) {
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp(),
    });
  }
  console.log('Products seeded successfully!');
}
