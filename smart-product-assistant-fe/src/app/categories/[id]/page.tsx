'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/utils/api';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { Category } from '@/types/Category';
import { Product } from '@/types/Product';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const {data} = await api.getCategory(+id);
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!category) return <Error message="Category not found" />;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
          {category.products.length === 0 && (
            <div className="col-span-full text-center py-4 text-gray-500">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 