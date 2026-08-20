export const metadata = {
  title: 'Privacy — Crema Clubhouse',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max max-w-2xl section-padding">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <p>
              We collect email addresses and payment information to process orders and manage your membership. We do not sell or share your personal information with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p>
              We use cookies to remember your login and improve your experience. You can disable cookies in your browser settings, though some functionality may be limited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Security</h2>
            <p>
              We use industry-standard encryption to protect your data. No system is completely secure. Use a strong password and keep your account information private.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
            <p>
              We use Whop for payment processing and Supabase for data storage. These services have their own privacy policies. Review them before providing personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p>
              If you have privacy concerns, contact us at support@cremaclubhouse.com.
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
