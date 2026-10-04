'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export function QuickLinks() {
  const t = useTranslations()
  const locale = useLocale()

  const links = [
    {
      href: '/our-ocean',
      title: t('nav.ourOcean'),
      description: locale === 'en'
        ? "Why Tanzania's coastal and marine fisheries matter, and what is at stake."
        : 'Kwa nini uvuvi wa pwani na bahari ya Tanzania ni muhimu, na hatari zilizopo.',
    },
    {
      href: '/components',
      title: t('nav.components'),
      description: locale === 'en'
        ? 'Governance, fisheries management, aquaculture value chains and project delivery.'
        : 'Utawala, usimamizi wa uvuvi, minyororo ya thamani ya ufugaji na utekelezaji.',
    },
    {
      href: '/results',
      title: t('nav.resultsImpact'),
      description: locale === 'en'
        ? 'Funding, targets against achievements, beneficiaries and downloadable reports.'
        : 'Fedha, malengo dhidi ya mafanikio, wanufaika na ripoti za kupakua.',
    },
    {
      href: '/map',
      title: locale === 'en' ? 'Interactive map' : 'Ramani shirikishi',
      description: locale === 'en'
        ? 'Explore sub-projects and landing sites across Unguja, Pemba and the mainland coast.'
        : 'Tazama miradi midogo na mialo Unguja, Pemba na ukanda wa Bara.',
    },
    {
      href: '/tenders',
      title: locale === 'en' ? 'Tenders & procurement' : 'Zabuni na manunuzi',
      description: locale === 'en'
        ? 'Open notices, awarded contracts and the procurement plan.'
        : 'Matangazo, mikataba iliyotolewa na mpango wa manunuzi.',
    },
    {
      href: '/safeguards',
      title: t('nav.safeguards'),
      description: locale === 'en'
        ? 'ESMF, RPF and SEP disclosures, plus the grievance redress mechanism.'
        : 'Nyaraka za ESMF, RPF na SEP, pamoja na mfumo wa kushughulikia malalamiko.',
    },
  ]

  return (
    <section className="container-max py-16">
      <h2 className="font-bitter text-[26px] font-semibold mb-6">
        {t('home.quickLinks')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={`/${locale}${link.href}`}
            className="flex flex-col gap-3 p-7 bg-white border border-hairline rounded-xl no-underline text-ink card-hover"
          >
            <span className="w-[38px] h-[3px] bg-accent" aria-hidden="true" />
            <h3 className="font-bitter text-[21px] font-semibold">
              {link.title}
            </h3>
            <p className="text-base leading-relaxed text-[#4A5C63]">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
