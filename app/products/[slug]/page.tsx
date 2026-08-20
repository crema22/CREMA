import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductDetailClient from '@/components/ProductDetailClient'

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  return data
}

async function getRelatedProducts(category: string, productId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('active', true)
    .neq('id', productId)
    .limit(3)

  return data || []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  return {
    title: product?.name ? `${product.name} — Crema Clubhouse` : 'Product — Crema Clubhouse',
    description: product?.short_description || 'Premium coffee gear.',
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="container-max section-padding text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max section-padding">
        <Link href="/shop" className="text-espresso font-medium mb-8 inline-block hover:opacity-80">
          ← Back to Shop
        </Link>

        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  )
}
