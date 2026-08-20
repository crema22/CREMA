import Link from 'next/link'

export const metadata = {
  title: 'Clubhouse — Crema',
  description: 'Premium membership. Better pricing across our entire catalogue.',
}

export default function ClubhousePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section-padding bg-white border-b border-cream-900">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Crema Clubhouse
          </h1>
          <p className="text-lg text-slate-700">
            Premium membership for lower pricing across our entire catalogue.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-2xl">
          <div className="bg-white rounded-lg p-8 border border-cream-900 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">$39.99/month</h2>

            <ul className="space-y-4 mb-8 text-slate-700">
              <li className="flex gap-3">
                <span className="text-espresso font-bold">✓</span>
                <span>Lower pricing across all products</span>
              </li>


              <li className="flex gap-3">
                <span className="text-espresso font-bold">✓</span>
                <span>Cancel anytime</span>
              </li>
            </ul>

            <div className="bg-cream-100 rounded p-4 mb-8 border border-cream-900">
              <p className="text-sm text-slate-700">
                New members start with a <strong>14-day free trial</strong>. After your trial, membership renews at $39.99/month until you cancel.
              </p>
            </div>

            <Link href="/shop" className="btn-primary w-full text-center block">
              Unlock Clubhouse Pricing
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How do I join?</h3>
              <p className="text-slate-700">
                Click "Get Clubhouse Price" on any product. We'll set up your trial and you'll have member pricing immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-700">
Yes. Cancellation details will be confirmed once billing is live.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">What if I'm not happy?</h3>
              <p className="text-slate-700">
Get in touch and we'll do what we can to help. Our full support and refund terms will be published before the store begins accepting live orders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
