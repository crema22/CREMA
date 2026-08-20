export const metadata = {
  title: 'Contact — Crema Clubhouse',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="container-max max-w-2xl section-padding">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Contact</h1>

        <div className="space-y-6 text-slate-700">
          <p>
            We'll have contact information and support channels available before the store goes live.
          </p>

          <div className="bg-cream-100 rounded-lg p-6 border border-cream-900">
            <p className="text-sm">
              For now, you can reach us by replying to any email from Crema Clubhouse.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
