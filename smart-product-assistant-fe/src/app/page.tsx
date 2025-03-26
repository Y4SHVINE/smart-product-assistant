'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center pt-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Your Perfect Product
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl">
          Discover products that match your needs with our AI-powered smart search. Get personalized recommendations and make informed decisions.
        </p>
        <div className="mt-4 max-w-md mx-auto sm:flex sm:justify-center md:mt-6">
          <div className="rounded-md shadow">
            <Link
              href="/products"
              className="w-full flex items-center justify-center px-8 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-10"
            >
              Browse Products
            </Link>
          </div>
          {!user && (
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                href="/auth/signin"
                className="w-full flex items-center justify-center px-8 py-2.5 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-3 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 gap-6 mt-5 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
        <div className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">AI-Powered Search</h3>
          <p className="mt-2 text-gray-500">
            Get intelligent product recommendations based on your preferences and needs.
          </p>
        </div>
        <div className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Smart Categories</h3>
          <p className="mt-2 text-gray-500">
            Browse products organized in intuitive categories for easy navigation.
          </p>
        </div>
        <div className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-medium text-gray-900">Detailed Information</h3>
          <p className="mt-2 text-gray-500">
            Access comprehensive product details and specifications to make informed decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
