export const metadata = {
  title: 'Shipping — Crema Clubhouse',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max max-w-2xl section-padding">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Shipping</h1>

        <div className="space-y-6 text-slate-700">
          <p>
            Final shipping terms will be published before the store begins accepting live orders.
          </p>

          <div className="bg-cream-100 rounded-lg p-6 border border-cream-900">
            <p className="text-sm">
              We're finalizing our shipping logistics to ensure fast, reliable delivery to all customers. Check back soon for detailed shipping policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
