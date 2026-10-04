'use client'

import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Header() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/components', label: t('nav.components') },
    { href: '/map', label: t('nav.whereWeWork') },
    { href: '/results', label: t('nav.resultsImpact') },
    { href: '/tenders', label: t('nav.tenders') },
    { href: '/contact', label: t('nav.contact') },
  ]

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/our-ocean', label: t('nav.ourOcean') },
    { href: '/about', label: t('nav.about') },
    { href: '/components', label: t('nav.components') },
    { href: '/map', label: t('nav.whereWeWork'), highlight: true },
    { href: '/results', label: t('nav.resultsImpact') },
    { href: '/stories', label: t('nav.stories') },
    { href: '/publications', label: t('nav.publications') },
    { href: '/tenders', label: t('nav.procurement') },
    { href: '/safeguards', label: t('nav.safeguards') },
    { href: '/grievance', label: t('nav.submitGrievance'), accent: true },
    { href: '/partners', label: t('nav.partners') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <>
      {/* Skip to content link */}
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>

      {/* Top utility bar */}
      <div className="text-[#CFE0E3] text-[13.5px] tracking-wide" style={{ backgroundColor: '#10333F' }}>
        <div className="container-max py-2 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 min-h-8">
            <span className="w-[7px] h-[7px] bg-accent rounded-full flex-none" />
            <span>{t('common.siteName')} &middot; {t('common.siteDescription')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/contact`}
              className="text-[#CFE0E3] no-underline font-semibold min-h-8 inline-flex items-center hover:text-light-accent"
            >
              {t('common.contact')}
            </Link>
            <span className="text-[#35545E]">&middot;</span>
            <Link
              href={`/${locale}/grievance`}
              className="text-[#CFE0E3] no-underline font-semibold min-h-8 inline-flex items-center hover:text-light-accent"
            >
              {t('common.grievance')}
            </Link>

            {/* Language switcher */}
            <div className="flex border border-[#35545E] rounded-full overflow-hidden">
              <button
                type="button"
                onClick={() => switchLocale('en')}
                aria-pressed={locale === 'en'}
                className={`min-h-9 px-4 border-0 font-bold text-[13px] cursor-pointer ${
                  locale === 'en'
                    ? 'bg-white text-ink'
                    : 'bg-transparent text-[#CFE0E3]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => switchLocale('sw')}
                aria-pressed={locale === 'sw'}
                className={`min-h-9 px-4 border-0 font-bold text-[13px] cursor-pointer ${
                  locale === 'sw'
                    ? 'bg-white text-ink'
                    : 'bg-transparent text-[#CFE0E3]'
                }`}
              >
                Kiswahili
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Government header with logos */}
      <div className="bg-white border-b border-[#EDE6D6]">
        <div className="container-max py-0 flex items-center justify-between gap-6 flex-wrap">
          {/* SMZ Coat of Arms */}
          <Image
            src="https://bigzproject.org/smz-logo.png"
            alt="Coat of arms of the Revolutionary Government of Zanzibar"
            width={72}
            height={72}
            className="h-[72px] w-auto block flex-none"
          />

          {/* Ministry text */}
          <div className="flex-1 min-w-60 flex flex-col items-center gap-1.5 text-center leading-tight">
            <span className="font-bitter font-bold text-[clamp(22px,3.4vw,40px)] tracking-tight">
              {t('header.government')}
            </span>
            <span className="text-[clamp(16px,2vw,24px)] text-muted tracking-wide">
              {t('header.ministry')}
            </span>
          </div>

          {/* TASFAM Logo */}
          <Link href={`/${locale}`} className="block no-underline flex-none">
            <Image
              src="/tasfam-logo.jpg"
              alt="TASFAM Project 2025-2030 - Tanzania Scaling-Up Sustainable Marine Fisheries and Aquaculture Management"
              width={96}
              height={96}
              className="h-24 w-auto block rounded-full"
            />
          </Link>
        </div>
      </div>

      {/* Sticky navigation */}
      <header className="bg-white border-b border-hairline sticky top-0 z-40">
        <div className="container-max py-2 flex items-center gap-4">
          {/* Desktop navigation */}
          <nav aria-label="Main" className="flex-1 hidden lg:flex items-stretch justify-between gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="flex items-center min-h-12 px-3 no-underline text-ink font-semibold text-[15.5px] border-b-[3px] border-transparent hover:text-accent hover:border-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            className="min-h-12 min-w-12 flex items-center gap-2.5 px-4 bg-ink text-white border-0 rounded-md font-bold text-[15px] cursor-pointer"
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="block w-[18px] h-0.5 bg-white" />
              <span className="block w-[18px] h-0.5 bg-white" />
              <span className="block w-[18px] h-0.5 bg-white" />
            </span>
            <span>{t('common.menu')}</span>
          </button>
        </div>

        {/* Mobile/Full menu overlay */}
        {menuOpen && (
          <div className="border-t border-hairline bg-[#FBF8F2]">
            <nav
              aria-label="All sections"
              className="container-max py-4 pb-6 grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-2"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  onClick={() => setMenuOpen(false)}
                  className={`min-h-[52px] flex items-center px-3.5 rounded-md no-underline font-semibold text-base border ${
                    item.accent
                      ? 'bg-accent text-white border-accent hover:bg-[#12907F]'
                      : item.highlight
                      ? 'bg-ink text-white border-ink hover:bg-accent hover:border-accent'
                      : 'bg-white text-ink border-hairline hover:bg-accent hover:text-white hover:border-accent'
                  }`}
                >
                  {item.label}
                  {item.highlight && (
                    <span className="ml-auto text-[13px] opacity-75">map</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
