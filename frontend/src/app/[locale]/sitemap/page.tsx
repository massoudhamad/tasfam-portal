'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function SitemapPage() {
  const locale = useLocale()

  const sections = [
    {
      titleEn: 'Main Pages',
      titleSw: 'Kurasa Kuu',
      links: [
        { href: '/', labelEn: 'Home', labelSw: 'Mwanzo' },
        { href: '/about', labelEn: 'About TASFAM', labelSw: 'Kuhusu TASFAM' },
        { href: '/our-ocean', labelEn: 'Our Ocean', labelSw: 'Bahari Yetu' },
        { href: '/components', labelEn: 'Project Components', labelSw: 'Vipengele vya Mradi' },
        { href: '/map', labelEn: 'Where We Work', labelSw: 'Tunapofanya Kazi' },
        { href: '/results', labelEn: 'Results & Impact', labelSw: 'Matokeo na Athari' },
        { href: '/partners', labelEn: 'Our Partners', labelSw: 'Washirika Wetu' },
      ],
    },
    {
      titleEn: 'Resources',
      titleSw: 'Rasilimali',
      links: [
        { href: '/publications', labelEn: 'Publications & Documents', labelSw: 'Machapisho na Nyaraka' },
        { href: '/tenders', labelEn: 'Tenders & Procurement', labelSw: 'Zabuni na Manunuzi' },
        { href: '/stories', labelEn: 'Stories from the Field', labelSw: 'Hadithi kutoka Uwandani' },
        { href: '/gallery', labelEn: 'Photo Gallery', labelSw: 'Galari ya Picha' },
      ],
    },
    {
      titleEn: 'Safeguards & Support',
      titleSw: 'Ulinzi na Msaada',
      links: [
        { href: '/safeguards', labelEn: 'Safeguards & Grievances', labelSw: 'Ulinzi na Malalamiko' },
        { href: '/grievance', labelEn: 'Submit a Grievance', labelSw: 'Wasilisha Lalamiko' },
        { href: '/contact', labelEn: 'Contact Us', labelSw: 'Wasiliana Nasi' },
      ],
    },
    {
      titleEn: 'Legal',
      titleSw: 'Kisheria',
      links: [
        { href: '/privacy', labelEn: 'Privacy Policy', labelSw: 'Sera ya Faragha' },
        { href: '/accessibility', labelEn: 'Accessibility', labelSw: 'Ufikiwaji' },
      ],
    },
  ]

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <h1 className="font-bitter text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Sitemap' : 'Ramani ya Tovuti'}
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: '#E0F4FB' }}>
            {locale === 'en'
              ? 'Quick access to all pages on the TASFAM website'
              : 'Ufikiaji wa haraka wa kurasa zote kwenye tovuti ya TASFAM'}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-bitter text-xl font-bold text-ink mb-4">
                {locale === 'en' ? section.titleEn : section.titleSw}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-[#4A5C63] hover:text-accent no-underline"
                    >
                      {locale === 'en' ? link.labelEn : link.labelSw}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
