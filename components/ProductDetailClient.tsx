'use client'

import { useState } from 'react'
import { Product } from '@/lib/supabase/types'
import ProductGallery from '@/components/ProductGallery'
import { useMembership } from '@/lib/context/membership'
import ProductCard from '@/components/ProductCard'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { isClubhouseMember, loading } = useMembership()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const galleryImages = product.gallery_images || []
  const allImages = [product.main_image_url, ...galleryImages].filter(Boolean)

  const saving = product.regular_price - product.clubhouse_price

  // Member state resolves only AFTER loading completes.
  // Guest layout is the default so nothing shifts while status loads.
  const confirmedMember = isClubhouseMember && !loading

  const handleCheckout = async (type: 'regular' | 'clubhouse') => {
    setCheckoutLoading(true)
    setCheckoutError(null)

    try {
      const endpoint =
        type === 'regular' ? '/api/checkout/regular' : '/api/checkout/clubhouse'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })

      const data = await response.json()

      if (!response.ok || !data.checkoutUrl) {
        setCheckoutError(
          data.message || 'Checkout is not available yet. Please check back soon.'
        )
        return
      }

      window.location.href = data.checkoutUrl
    } catch {
      setCheckoutError('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductGallery images={allImages} productName={product.name} />

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>

          <p className="text-lg text-slate-700 mb-8 leading-relaxed">
            {product.short_description}
          </p>

          {/* Pricing — Clubhouse price is the focal point in both states */}
          <div className="bg-cream-100 rounded-lg p-6 mb-8">
            {confirmedMember ? (
              <>
                <div className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                  Clubhouse Price
                </div>
                <div className="text-5xl font-bold text-espresso mb-2">
                  ${product.clubhouse_price.toFixed(2)}
                </div>
                <div className="text-sm line-through text-slate-500">
                  ${product.regular_price.toFixed(2)}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                  Clubhouse Price
                </div>
                <div className="text-5xl font-bold text-espresso mb-3">
                  ${product.clubhouse_price.toFixed(2)}
                </div>
                <div className="pt-3 border-t border-cream-900">
                  <div className="text-sm text-slate-600">
                    Regular ${product.regular_price.toFixed(2)}
                  </div>
                  <div className="text-sm font-semibold text-espresso mt-1">
                    Save ${saving.toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-3 mb-4">
            {confirmedMember ? (
              <button
                type="button"
                onClick={() => handleCheckout('clubhouse')}
                disabled={checkoutLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {checkoutLoading
                  ? 'Loading…'
                  : `Buy Now — $${product.clubhouse_price.toFixed(2)}`}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleCheckout('clubhouse')}
                  disabled={checkoutLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {checkoutLoading
                    ? 'Loading…'
                    : `Get Clubhouse Price — $${product.clubhouse_price.toFixed(2)}`}
                </button>

                <p className="text-xs text-slate-600 text-center">
                  Includes a 14-day Clubhouse trial. Then $39.99/month until cancelled.
                </p>

                <button
                  type="button"
                  onClick={() => handleCheckout('regular')}
                  disabled={checkoutLoading}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {checkoutLoading
                    ? 'Loading…'
                    : `Buy without membership — $${product.regular_price.toFixed(2)}`}
                </button>
              </>
            )}
          </div>

          {checkoutError && (
            <div
              role="alert"
              className="bg-white border border-cream-900 rounded-lg p-4 mb-8"
            >
              <p className="text-sm text-slate-900">{checkoutError}</p>
            </div>
          )}

          {/* Product Details */}
          {product.long_description && (
            <div className="space-y-6 border-t border-cream-900 pt-8">
              <div>
                <h2 className="font-semibold text-slate-900 mb-2">About this product</h2>
                <p className="text-slate-700 leading-relaxed">
                  {product.long_description}
                </p>
              </div>

              {product.sku && (
                <div>
                  <h2 className="font-semibold text-slate-900 mb-2">Product Details</h2>
                  <p className="text-slate-700 text-sm">SKU: {product.sku}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-cream-900 pt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">More coffee gear.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
