export interface Category {
  id: number;
  name: string;
  description: any;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  attributes: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
}
