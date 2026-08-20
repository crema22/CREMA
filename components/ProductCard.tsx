'use client'

import { Product } from '@/lib/supabase/types'
import Link from 'next/link'
import { useMembership } from '@/lib/context/membership'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isClubhouseMember, loading } = useMembership()

  // Guest layout renders immediately and is the default.
  // Member state only applies once status has actually resolved,
  // so nothing shifts or hides while the request is in flight.
  const confirmedMember = isClubhouseMember && !loading
  const saving = product.regular_price - product.clubhouse_price

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso rounded-lg"
    >
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative w-full aspect-square bg-cream-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.main_image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-slate-700 mb-4 line-clamp-2 flex-1">
            {product.short_description}
          </p>

          {/* Clubhouse price is the focal point in both states */}
          <div>
            {confirmedMember ? (
              <>
                <div className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                  Clubhouse Price
                </div>
                <div className="text-3xl font-bold text-espresso">
                  ${product.clubhouse_price.toFixed(2)}
                </div>
                <div className="text-sm line-through text-slate-500 mt-1">
                  ${product.regular_price.toFixed(2)}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                  Clubhouse Price
                </div>
                <div className="text-3xl font-bold text-espresso">
                  ${product.clubhouse_price.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Regular ${product.regular_price.toFixed(2)}
                </div>
                <div className="text-sm font-semibold text-espresso mt-1">
                  Save ${saving.toFixed(2)}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-cream-900">
            <span className="text-sm font-semibold text-espresso">
              {confirmedMember
                ? `Buy Now — $${product.clubhouse_price.toFixed(2)}`
                : `Get Clubhouse Price — $${product.clubhouse_price.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
