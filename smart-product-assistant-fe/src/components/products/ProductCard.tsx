import { Product } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="w-full h-[300px] overflow-hidden rounded-lg bg-white relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-center group-hover:opacity-75"
          quality={100}
          priority
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category?.name}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
      {(product.relevanceScore !== undefined || product.explanation) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {product.relevanceScore !== undefined && (
            <p className="text-sm text-blue-600">
              Relevance Score: {(product.relevanceScore * 100).toFixed(1)}%
            </p>
          )}
          {product.explanation && (
            <p className="mt-1 text-sm text-gray-600 italic">
              {product.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 