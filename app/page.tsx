import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/supabase/types'

const HERO_SLUG = 'usb-c-milk-frother'

async function getHomepageProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('display_order')

  if (error) {
    console.error('Homepage product fetch error:', error)
    return { hero: null, savings: [], featured: [] }
  }

  const products = (data || []) as Product[]
  const hero = products.find((p) => p.slug === HERO_SLUG) ?? products[0] ?? null

  const savings = products
    .filter((p) => p.id !== hero?.id)
    .sort(
      (a, b) =>
        b.regular_price - b.clubhouse_price - (a.regular_price - a.clubhouse_price)
    )
    .slice(0, 3)

  const featured = products.filter((p) => p.featured).slice(0, 3)

  return { hero, savings, featured }
}

export default async function HomePage() {
  const { hero, savings, featured } = await getHomepageProducts()

  return (
    <>
      <section className="section-padding bg-gradient-to-b from-cream-50 to-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="text-xs uppercase tracking-widest text-espresso font-bold">
                  Coffee Gear at Member Prices
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-slate-900 mb-6">
                Coffee gear.
                <br />
                Better priced.
              </h1>

              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Shop premium coffee equipment at regular prices. Or join Crema
                Clubhouse for lower pricing across the entire store.
              </p>

              {hero && (
                <div className="bg-cream-100 rounded-lg p-6 mb-8">
                  <p className="text-sm text-slate-600 mb-2">Featured</p>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {hero.name}
                  </h2>

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                      Clubhouse Price
                    </p>
                    <p className="text-5xl font-bold text-espresso mb-2">
                      ${hero.clubhouse_price.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Regular ${hero.regular_price.toFixed(2)} &middot;{' '}
                      <span className="font-semibold text-espresso">
                        Save ${(hero.regular_price - hero.clubhouse_price).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/products/${hero.slug}`}
                    className="btn-primary w-full text-center block mb-3"
                  >
                    Get Clubhouse Price — ${hero.clubhouse_price.toFixed(2)}
                  </Link>

                  <p className="text-xs text-slate-600 text-center mb-3">
                    Includes a 14-day Clubhouse trial. Then $39.99/month until
                    cancelled.
                  </p>

                  <Link
                    href={`/products/${hero.slug}`}
                    className="btn-secondary w-full text-center block"
                  >
                    Buy without membership — ${hero.regular_price.toFixed(2)}
                  </Link>
                </div>
              )}
            </div>

            {hero?.main_image_url && (
              <div className="relative h-96 md:h-full min-h-96 bg-cream-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.main_image_url}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {savings.length > 0 && (
        <section className="section-padding bg-white border-t border-cream-900">
          <div className="container-max">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              Better prices across your coffee setup.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {savings.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="border border-cream-900 rounded-lg p-6 block hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900 mb-4">{item.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-espresso font-bold mb-1">
                    Clubhouse
                  </p>
                  <p className="text-3xl font-bold text-espresso mb-2">
                    ${item.clubhouse_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-600 pb-3">
                    Regular ${item.regular_price.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-espresso pt-3 border-t border-cream-900">
                    Save ${(item.regular_price - item.clubhouse_price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="section-padding bg-cream-50">
          <div className="container-max">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
              Premium coffee gear.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/shop" className="btn-primary">
                Browse All Products
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
