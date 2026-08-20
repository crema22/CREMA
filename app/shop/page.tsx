import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('display_order')

  if (error) {
    console.error('Product fetch error:', error)
    return []
  }

  return data || []
}

export const metadata = {
  title: 'Shop — Crema Clubhouse',
  description: 'Premium coffee gear and accessories at member prices.',
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section-padding bg-white border-b border-cream-900">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Coffee Gear
          </h1>
          <p className="text-lg text-slate-700">
            Premium coffee equipment. Available at regular or member prices.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No products available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}