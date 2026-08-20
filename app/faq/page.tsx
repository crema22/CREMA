export const metadata = {
  title: 'FAQ — Crema Clubhouse',
}

export default function FAQPage() {
  const faqs = [
    {
      q: 'How do I join the Clubhouse?',
      a: 'Click "Get Clubhouse Price" on any product and follow the checkout flow. Your membership starts immediately with a 14-day free trial.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes. New members get 14 days free, then $39.99/month. You can cancel anytime.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. Cancel from your account page anytime. Your access continues until the end of your billing period.',
    },
    {
      q: 'Do all products have member pricing?',
      a: 'Most items in our catalogue have Clubhouse pricing. Check each product page for member discounts available.',
    },
    {
      q: 'What if I want to buy without joining?',
      a: 'You can buy any product at regular pricing without a membership.',
    },
    {
      q: 'How long does shipping take?',
      a: 'Final shipping times will be published before the store begins accepting live orders.',
    },
    {
      q: 'Do you have a return policy?',
      a: 'Our full returns policy will be published before the store begins accepting live orders.',
    },
    {
      q: 'Do you ship internationally?',
      a: 'Shipping destinations will be confirmed before the store begins accepting live orders.',
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section-padding bg-white border-b border-cream-900">
        <div className="container-max">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">FAQ</h1>
          <p className="text-lg text-slate-700">
            Common questions about Crema Clubhouse and our products.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-2xl">
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-cream-900 pb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-slate-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
