'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { Category } from '@/types/Category';
import { useAppSelector } from '@/store/hooks';
import CategoryCard from '@/components/categories/CategoryCard';

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const {data} = await api.getCategories();
        setCategories(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [user, router]);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Categories</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative block bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors duration-200"
            >
              <div className="flex flex-col h-full">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {category.description || 'No description available'}
                </p>
                <div className="mt-2 text-sm font-medium text-indigo-600">
                  {category.products.length || 0} products
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 