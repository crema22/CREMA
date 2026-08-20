export const metadata = {
  title: 'Terms — Crema Clubhouse',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max max-w-2xl section-padding">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>

        <div className="space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Membership</h2>
            <p>
              Crema Clubhouse membership costs $39.99/month. New members receive a 14-day free trial. After your trial, your membership renews automatically each month until cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Cancellation</h2>
            <p>
              You may cancel your membership at any time. Your access continues through the end of your billing period. No refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Products</h2>
            <p>
              All products are sold as-is. We make no warranties beyond what is stated in product descriptions. For defective items, contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitation of Liability</h2>
            <p>
              Crema Clubhouse is not liable for indirect, incidental, or consequential damages. Your sole remedy is a refund of the purchase price.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Changes to Terms</h2>
            <p>
              We may update these terms anytime. Continued use of the site means you accept the changes.
            </p>
          </section>

          <p className="text-xs text-slate-600 pt-8 border-t border-cream-900 mt-8">
            Draft — not final. This policy will be finalised before the store begins accepting live orders.
          </p>
        </div>
      </div>
    </div>
  )
}
