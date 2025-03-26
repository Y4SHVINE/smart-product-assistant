'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ProductCard from '@/components/products/ProductCard';
import SearchInput from '@/components/ui/SearchInput';
import { api } from '@/utils/api';
import { Product } from '@/types/Product';
import { useAppSelector } from '@/store/hooks';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'category-asc' | 'category-desc';

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getProducts();
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      const response = await api.getProducts();
      setProducts(response.data);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await api.searchProducts(searchQuery);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Failed to search products. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const sortProducts = (products: Product[]): Product[] => {
    const [criteria, direction] = sortBy.split('-');
    
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (criteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.name.localeCompare(b.category.name);
          break;
        default:
          return 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const sortedProducts = sortProducts(products);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Smart Product Search
          </h2>
          <p className="mt-1 text-base text-gray-600">
            <span className="sm:hidden">Ask me anything...</span>
            <span className="hidden sm:inline">Ask me anything about what you're looking for, like "I need a lightweight laptop for college" then press Enter</span>
          </p>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-grow">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Describe what you're looking for..."
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isSearching ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {isSearching ? (
          <div className="mt-4 flex justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 hidden sm:block">Products</h3>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                  Sort:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-48 px-2 py-1.5 text-sm bg-white border border-gray-300 hover:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-md font-medium text-gray-700 cursor-pointer"
                >
                  <option value="name-asc">📄 Name (A-Z)</option>
                  <option value="name-desc">📄 Name (Z-A)</option>
                  <option value="price-asc">💰 Price (Low-High)</option>
                  <option value="price-desc">💰 Price (High-Low)</option>
                  <option value="category-asc">📁 Category (A-Z)</option>
                  <option value="category-desc">📁 Category (Z-A)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="mt-6 text-center">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 