'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

type FormStep = 'form' | 'success'

interface GrievanceForm {
  category: string
  district: string
  shehia: string
  description: string
  contactPreference: 'contact' | 'anonymous'
  name: string
  phone: string
  email: string
  preferredLanguage: 'en' | 'sw'
  passphrase: string
  attachments: File[]
}

const categories = [
  { value: 'project-implementation', labelEn: 'Project Implementation', labelSw: 'Utekelezaji wa Mradi' },
  { value: 'environmental', labelEn: 'Environmental Concern', labelSw: 'Wasiwasi wa Mazingira' },
  { value: 'social', labelEn: 'Social Impact', labelSw: 'Athari za Kijamii' },
  { value: 'labor', labelEn: 'Labor Issues', labelSw: 'Masuala ya Wafanyakazi' },
  { value: 'corruption', labelEn: 'Corruption/Fraud', labelSw: 'Rushwa/Udanganyifu' },
  { value: 'gbv', labelEn: 'Gender-Based Violence / Harassment', labelSw: 'Unyanyasaji wa Kijinsia' },
  { value: 'other', labelEn: 'Other', labelSw: 'Mengine' },
]

const districts = [
  { value: 'mjini-magharibi', label: 'Mjini Magharibi' },
  { value: 'kaskazini-a', label: 'Kaskazini A' },
  { value: 'kaskazini-b', label: 'Kaskazini B' },
  { value: 'kusini', label: 'Kusini' },
  { value: 'kati', label: 'Kati' },
  { value: 'chake-chake', label: 'Chake Chake' },
  { value: 'mkoani', label: 'Mkoani' },
  { value: 'wete', label: 'Wete' },
  { value: 'mainland-coast', label: 'Mainland Coast' },
]

export default function GrievancePage() {
  const t = useTranslations('grm')
  const locale = useLocale()
  const [step, setStep] = useState<FormStep>('form')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [formData, setFormData] = useState<GrievanceForm>({
    category: '',
    district: '',
    shehia: '',
    description: '',
    contactPreference: 'contact',
    name: '',
    phone: '',
    email: '',
    preferredLanguage: locale as 'en' | 'sw',
    passphrase: '',
    attachments: [],
  })

  const isSensitiveCategory = formData.category === 'gbv'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate reference number (in production, this comes from the API)
    const year = new Date().getFullYear()
    const num = Math.floor(Math.random() * 9000) + 1000
    const ref = `TASFAM-GRM-${year}-${num}`

    setReferenceNumber(ref)
    setStep('success')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.attachments.length > 5) {
      alert(locale === 'en' ? 'Maximum 5 files allowed' : 'Faili 5 kiwango cha juu zinaruhusiwa')
      return
    }
    setFormData({ ...formData, attachments: [...formData.attachments, ...files] })
  }

  if (step === 'success') {
    return (
      <div className="bg-surface min-h-screen">
        <section className="text-white py-16" style={{ backgroundColor: "#2196C8" }}>
          <div className="container-max text-center">
            <div className="max-w-lg mx-auto">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-bitter text-3xl font-bold mb-4">
                {locale === 'en' ? 'Grievance Submitted' : 'Lalamiko Limewasilishwa'}
              </h1>
              <p className="text-ocean-100 mb-8">
                {locale === 'en'
                  ? 'Your grievance has been received and will be reviewed within 7 days.'
                  : 'Lalamiko lako limepokelewa na litakaguliwa ndani ya siku 7.'}
              </p>

              <div className="bg-white text-ink rounded-xl p-6 text-left">
                <p className="text-sm text-muted mb-2">{t('referenceNumber')}</p>
                <p className="font-bitter text-2xl font-bold text-accent mb-4">{referenceNumber}</p>
                <p className="text-sm text-[#4A5C63] mb-4">{t('saveReference')}</p>

                {formData.passphrase && (
                  <div className="bg-[#FDF6E3] border border-[#E8D9AE] rounded-lg p-4 text-sm">
                    <p className="font-semibold mb-1">
                      {locale === 'en' ? 'Your passphrase' : 'Nenosiri lako'}:
                    </p>
                    <p className="font-mono text-accent">{formData.passphrase}</p>
                    <p className="text-[#8A6A2F] mt-2">
                      {locale === 'en'
                        ? 'You will need this passphrase to check your grievance status.'
                        : 'Utahitaji nenosiri hili kuangalia hali ya lalamiko lako.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero section */}
      <section className="text-white py-12" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <h1 className="font-bitter text-[clamp(28px,4vw,40px)] font-bold mb-3">
            {t('title')}
          </h1>
          <p className="text-ocean-100 max-w-2xl">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="container-max py-10">
        <form onSubmit={handleSubmit} className="max-w-2xl">
          {/* Sensitive case warning */}
          {isSensitiveCategory && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl p-6 mb-8">
              <h3 className="font-bitter font-semibold text-lg text-[#92400E] mb-3">
                {locale === 'en' ? 'Important Information' : 'Taarifa Muhimu'}
              </h3>
              <p className="text-[#92400E] text-sm mb-4">
                {locale === 'en'
                  ? 'Cases involving gender-based violence, sexual exploitation, abuse, or harassment are handled with the highest confidentiality. Your case will be visible only to the designated GBV focal point and project coordinator.'
                  : 'Kesi zinazohusisha unyanyasaji wa kijinsia, unyonyaji wa kingono, ukatili, au udhalilishaji zinashughulikiwa kwa usiri wa hali ya juu. Kesi yako itaonekana tu kwa mshauri wa GBV na mratibu wa mradi.'}
              </p>
              <p className="text-[#92400E] text-sm font-semibold">
                {locale === 'en'
                  ? 'The project will not contact anyone without your consent.'
                  : 'Mradi hautawasiliana na mtu yeyote bila idhini yako.'}
              </p>
            </div>
          )}

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-2">
              {t('category')} <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option value="">{locale === 'en' ? 'Select category' : 'Chagua kategoria'}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {locale === 'en' ? cat.labelEn : cat.labelSw}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                {t('district')} <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="">{locale === 'en' ? 'Select district' : 'Chagua wilaya'}</option>
                {districts.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                {t('shehia')}
              </label>
              <input
                type="text"
                value={formData.shehia}
                onChange={(e) => setFormData({ ...formData, shehia: e.target.value })}
                placeholder={locale === 'en' ? 'Enter shehia/ward' : 'Ingiza shehia'}
                className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-2">
              {t('descriptionLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-4 py-3 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 resize-y"
            />
          </div>

          {/* Contact preference */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-3">
              {t('contactPreference')}
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="contactPreference"
                  value="contact"
                  checked={formData.contactPreference === 'contact'}
                  onChange={() => setFormData({ ...formData, contactPreference: 'contact' })}
                  className="w-5 h-5 text-accent"
                />
                <span>{t('contactMe')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="contactPreference"
                  value="anonymous"
                  checked={formData.contactPreference === 'anonymous'}
                  onChange={() => setFormData({ ...formData, contactPreference: 'anonymous' })}
                  className="w-5 h-5 text-accent"
                />
                <span>{t('anonymous')}</span>
              </label>
            </div>
          </div>

          {/* Contact details (if not anonymous) */}
          {formData.contactPreference === 'contact' && (
            <div className="bg-[#FBF8F2] border border-hairline rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('yourName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('phoneEmail')}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+255..."
                    className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {t('preferredLanguage')}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="en"
                      checked={formData.preferredLanguage === 'en'}
                      onChange={() => setFormData({ ...formData, preferredLanguage: 'en' })}
                      className="w-4 h-4 text-accent"
                    />
                    <span>English</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="sw"
                      checked={formData.preferredLanguage === 'sw'}
                      onChange={() => setFormData({ ...formData, preferredLanguage: 'sw' })}
                      className="w-4 h-4 text-accent"
                    />
                    <span>Kiswahili</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Passphrase for anonymous submissions */}
          {formData.contactPreference === 'anonymous' && (
            <div className="bg-[#FDF6E3] border border-[#E8D9AE] rounded-xl p-6 mb-6">
              <label className="block text-sm font-semibold text-ink mb-2">
                {locale === 'en' ? 'Create a passphrase' : 'Tengeneza nenosiri'} <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-[#8A6A2F] mb-3">
                {locale === 'en'
                  ? 'You will need this passphrase to check the status of your grievance later.'
                  : 'Utahitaji nenosiri hili kuangalia hali ya lalamiko lako baadaye.'}
              </p>
              <input
                type="text"
                required
                value={formData.passphrase}
                onChange={(e) => setFormData({ ...formData, passphrase: e.target.value })}
                placeholder={locale === 'en' ? 'Enter a memorable phrase' : 'Ingiza maneno ya kukumbuka'}
                className="w-full h-12 px-4 border border-hairline rounded-lg bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          )}

          {/* Attachments */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-ink mb-2">
              {t('attachments')}
            </label>
            <p className="text-sm text-muted mb-3">{t('attachmentsHelp')}</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-3 border border-dashed border-hairline rounded-lg bg-white text-ink cursor-pointer hover:border-accent"
            />
            {formData.attachments.length > 0 && (
              <ul className="mt-3 space-y-2">
                {formData.attachments.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        attachments: formData.attachments.filter((_, i) => i !== idx)
                      })}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-primary w-full md:w-auto">
            {t('submit')}
          </button>
        </form>
      </section>
    </div>
  )
}
