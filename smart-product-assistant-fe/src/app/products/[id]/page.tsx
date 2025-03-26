"use client";

import { api } from "@/utils/api";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Product } from "@/types/Product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(Number(id));
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
    return <Error message={error || "Product not found"} />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="aspect-h-4 aspect-w-3 bg-white rounded-lg relative h-[500px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain object-center"
                priority
              />
            </div>

            <div className="mt-4 lg:mt-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-2">
                {product.name}
              </h1>
              <p className="text-3xl tracking-tight text-gray-900 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
                  <div className="mt-2 space-y-2">
                    {Object.entries(product.attributes || {}).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4">
                        <dt className="text-sm text-gray-600 capitalize">{key}</dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
