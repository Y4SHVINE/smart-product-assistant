import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/Category';


interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="grid grid-cols-2 gap-1">
          {category.products.slice(0, 4).map((product) => (
            <div key={product.id} className="relative aspect-square">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={200}
                height={200}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-gray-700">
          <Link href={`/categories/${category.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {category.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
      </div>
    </div>
  );
} 