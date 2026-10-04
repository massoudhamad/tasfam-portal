'use client'

import { useTranslations, useLocale } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Contact Us' : 'Wasiliana Nasi'}
          </h1>
          <p className="text-lg text-ocean-100 max-w-2xl">
            {locale === 'en'
              ? 'Get in touch with the TASFAM project team'
              : 'Wasiliana na timu ya mradi wa TASFAM'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
              {locale === 'en' ? 'Project Coordination Unit' : 'Kitengo cha Uratibu wa Mradi'}
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-hairline">
                <h3 className="font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Address' : 'Anwani'}
                </h3>
                <p className="text-[#4A5C63]">
                  {locale === 'en'
                    ? 'Ministry of Blue Economy and Fisheries'
                    : 'Wizara ya Uchumi wa Buluu na Uvuvi'}
                  <br />
                  Zanzibar, Tanzania
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-hairline">
                <h3 className="font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Email' : 'Barua pepe'}
                </h3>
                <a href="mailto:tasfam@blueeconomysmz.go.tz" className="text-accent hover:underline">
                  tasfam@blueeconomysmz.go.tz
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 border border-hairline">
                <h3 className="font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Phone' : 'Simu'}
                </h3>
                <p className="text-[#4A5C63]">+255 24 XXX XXXX</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-hairline">
                <h3 className="font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Office Hours' : 'Saa za Kazi'}
                </h3>
                <p className="text-[#4A5C63]">
                  {locale === 'en'
                    ? 'Monday - Friday: 8:00 AM - 4:00 PM'
                    : 'Jumatatu - Ijumaa: 8:00 - 16:00'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-bitter text-2xl font-bold text-ink mb-6">
              {locale === 'en' ? 'Send us a Message' : 'Tutumie Ujumbe'}
            </h2>

            <form className="bg-white rounded-xl p-6 border border-hairline space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Your Name' : 'Jina Lako'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-accent"
                  placeholder={locale === 'en' ? 'Enter your name' : 'Ingiza jina lako'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Email Address' : 'Barua pepe'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-accent"
                  placeholder={locale === 'en' ? 'Enter your email' : 'Ingiza barua pepe yako'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Subject' : 'Mada'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-accent"
                  placeholder={locale === 'en' ? 'Enter subject' : 'Ingiza mada'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {locale === 'en' ? 'Message' : 'Ujumbe'}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-hairline rounded-lg focus:outline-none focus:border-accent resize-none"
                  placeholder={locale === 'en' ? 'Enter your message' : 'Ingiza ujumbe wako'}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-[#12907F] transition-colors"
              >
                {locale === 'en' ? 'Send Message' : 'Tuma Ujumbe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
