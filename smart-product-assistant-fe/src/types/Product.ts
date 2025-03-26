export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  attributes: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
  category: Category;
  relevanceScore?: number;
  explanation?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
