'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  const quickLinks = [
    { href: '/about', label: t('nav.about') },
    { href: '/components', label: t('nav.components') },
    { href: '/results', label: t('nav.resultsImpact') },
    { href: '/map', label: t('nav.whereWeWork') },
  ]

  const resourceLinks = [
    { href: '/publications', label: t('nav.publications') },
    { href: '/tenders', label: t('nav.tenders') },
    { href: '/safeguards', label: t('nav.safeguards') },
    { href: '/grievance', label: t('nav.submitGrievance') },
  ]

  return (
    <footer className="text-white" style={{ backgroundColor: '#10333F' }}>
      {/* Main footer content */}
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Image
              src="/tasfam-logo.jpg"
              alt="TASFAM Project 2025-2030"
              width={80}
              height={80}
              className="h-20 w-auto mb-4 rounded-full"
            />
            <p className="text-[#BFD6D9] text-sm leading-relaxed mb-4">
              {t('common.siteDescription')}
            </p>
            <p className="text-light-accent text-sm font-semibold">
              {t('common.worldBankSupported')} &middot; {t('common.timeline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bitter font-semibold text-lg mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-[#BFD6D9] hover:text-light-accent no-underline text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bitter font-semibold text-lg mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-[#BFD6D9] hover:text-light-accent no-underline text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bitter font-semibold text-lg mb-4">
              {t('footer.contactUs')}
            </h3>
            <address className="not-italic text-[#BFD6D9] text-sm space-y-2">
              <p>{t('footer.address')}</p>
              <p>
                <a href="mailto:tasfam@blueeconomysmz.go.tz" className="text-light-accent hover:text-white no-underline">
                  {t('footer.email')}
                </a>
              </p>
              <p>{t('footer.phone')}</p>
            </address>
          </div>
        </div>
      </div>

      {/* Partner logos */}
      <div className="border-t border-[#1C4350]">
        <div className="container-max py-6 flex flex-wrap items-center justify-center gap-8">
          <Image
            src="/tasfam-logo.jpg"
            alt="TASFAM Project 2025-2030"
            width={50}
            height={50}
            className="h-[50px] w-auto opacity-80 hover:opacity-100 transition-opacity rounded-full"
          />
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#1C4350]">
        <div className="container-max py-4 flex flex-wrap items-center justify-between gap-4 text-sm text-[#6E9199]">
          <p>
            &copy; {new Date().getFullYear()} {t('footer.copyright')}. {t('footer.allRightsReserved')}.
          </p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="text-[#6E9199] hover:text-white no-underline">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href={`/${locale}/accessibility`} className="text-[#6E9199] hover:text-white no-underline">
              {t('footer.accessibility')}
            </Link>
            <Link href={`/${locale}/sitemap`} className="text-[#6E9199] hover:text-white no-underline">
              {t('footer.sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
