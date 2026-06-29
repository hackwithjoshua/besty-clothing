export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'dress' | 'top' | 'wrapper' | 'accessories' | 'suit' | 'skirt';
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    image: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: ShippingAddress;
  paymentRef: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
