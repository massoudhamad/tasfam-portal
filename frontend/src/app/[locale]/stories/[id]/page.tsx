'use client'

import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Story data - in production this comes from Django API
const storiesData: Record<string, {
  titleEn: string
  titleSw: string
  authorEn: string
  authorSw: string
  locationEn: string
  locationSw: string
  contentEn: string[]
  contentSw: string[]
  image: string
}> = {
  'mwanaidi-juma': {
    titleEn: '"We stopped guessing where the fish were."',
    titleSw: '"Tuliacha kubahatisha samaki walipo."',
    authorEn: 'Mwanaidi Juma',
    authorSw: 'Mwanaidi Juma',
    locationEn: 'Seaweed farmer, Paje - Unguja South',
    locationSw: 'Mkulima wa mwani, Paje - Kusini Unguja',
    contentEn: [
      'Mwanaidi Juma has been farming seaweed in the shallow waters of Paje for over 15 years. Like many women in coastal communities, she depended on traditional methods passed down through generations.',
      'When TASFAM introduced deep-water tubular farming lines, everything changed. "Before, we would plant in shallow waters and hope for the best. Now we understand the science behind seaweed farming," she explains.',
      'The results speak for themselves. Her harvest increased from 0.6 tonnes to 1.9 tonnes per season - more than triple her previous yield. This has transformed her family\'s economic situation.',
      '"I can now pay for my children\'s school fees and have money saved for emergencies. The training we received taught us about water temperature, currents, and the best times to harvest."',
      'Mwanaidi now helps train other women in her community, sharing the knowledge she gained through the TASFAM program. "When one woman succeeds, we all succeed," she says with pride.',
    ],
    contentSw: [
      'Mwanaidi Juma amekuwa akilima mwani katika maji ya kina kifupi ya Paje kwa zaidi ya miaka 15. Kama wanawake wengi katika jamii za pwani, alitegemea mbinu za jadi zilizopitishwa kizazi hadi kizazi.',
      'TASFAM ilipoanzisha mistari ya kilimo cha mwani ya maji ya kina, kila kitu kilibadilika. "Awali, tulikuwa tunapanda katika maji ya kina kifupi na kutumaini bora. Sasa tunaelewa sayansi nyuma ya kilimo cha mwani," anaeleza.',
      'Matokeo yanajisemea yenyewe. Mavuno yake yaliongezeka kutoka tani 0.6 hadi 1.9 kwa msimu - zaidi ya mara tatu ya mavuno yake ya awali. Hii imebadilisha hali ya kiuchumi ya familia yake.',
      '"Sasa ninaweza kulipa ada za shule za watoto wangu na kuwa na pesa zilizohifadhiwa kwa dharura. Mafunzo tuliyopata yalitufundisha kuhusu joto la maji, mikondo, na nyakati bora za kuvuna."',
      'Mwanaidi sasa anasaidia kufunza wanawake wengine katika jamii yake, akishiriki maarifa aliyoyapata kupitia programu ya TASFAM. "Mwanamke mmoja anapofanikiwa, sisi sote tunafanikiwa," anasema kwa kiburi.',
    ],
    image: '/gallery/ocean-background.jpg',
  },
  'hassan-omar': {
    titleEn: '"The new GPS system changed everything for us."',
    titleSw: '"Mfumo mpya wa GPS umebadilisha kila kitu kwetu."',
    authorEn: 'Hassan Omar',
    authorSw: 'Hassan Omar',
    locationEn: 'Fisherman, Nungwi - Unguja North',
    locationSw: 'Mvuvi, Nungwi - Kaskazini Unguja',
    contentEn: [
      'Hassan Omar has been fishing the waters off Nungwi since he was a teenager. For decades, he relied on traditional knowledge and intuition to find fish.',
      'Through TASFAM\'s vessel monitoring program, his boat was equipped with GPS tracking and electronic catch documentation. "At first, I was skeptical," he admits. "But now I cannot imagine fishing without it."',
      'The technology helps him locate fishing grounds more efficiently and document his catches properly. This has opened doors to better markets that require certified, traceable seafood.',
      '"Before, we would sell at whatever price the middlemen offered. Now, with proper documentation, we can access markets that pay fair prices for quality fish."',
      'Hassan\'s income has increased by 40% since joining the program. He has become an advocate for sustainable fishing practices in his community.',
    ],
    contentSw: [
      'Hassan Omar amekuwa akivua samaki katika maji ya Nungwi tangu akiwa kijana. Kwa miongo kadhaa, alitegemea ujuzi wa jadi na intuition kupata samaki.',
      'Kupitia programu ya ufuatiliaji wa vyombo ya TASFAM, mashua yake iliandaliwa na ufuatiliaji wa GPS na uhifadhi wa kielektroniki wa samaki. "Mwanzoni, nilikuwa na shaka," anakubali. "Lakini sasa siwezi kufikiria kuvua bila hiyo."',
      'Teknolojia inamusaidia kupata maeneo ya uvuvi kwa ufanisi zaidi na kuandika mavuno yake vizuri. Hii imefungua milango ya masoko bora yanayohitaji dagaa zilizothibitishwa na zinazofuatiliwa.',
      '"Awali, tungeuzza kwa bei yoyote wachuuzi waliyotoa. Sasa, na uhifadhi sahihi, tunaweza kufikia masoko yanayolipa bei nzuri kwa samaki wa ubora."',
      'Mapato ya Hassan yameongezeka kwa 40% tangu kujiunga na programu. Amekuwa mtetezi wa mazoea ya uvuvi endelevu katika jamii yake.',
    ],
    image: '/gallery/ocean-background.jpg',
  },
  'fatma-said': {
    titleEn: '"I now earn three times what I used to."',
    titleSw: '"Sasa ninapata mara tatu ya nilichokuwa nikipata."',
    authorEn: 'Fatma Said',
    authorSw: 'Fatma Said',
    locationEn: 'Fish processor, Mkokotoni',
    locationSw: 'Msindikaji wa samaki, Mkokotoni',
    contentEn: [
      'Fatma Said processes and sells fish at the Mkokotoni landing site. Before TASFAM, she struggled with fish spoilage and limited market access.',
      'The new cold storage facility built by the project has been transformative. "We used to lose so much fish to spoilage, especially during hot weather. Now we can store fish properly and sell when prices are better."',
      'Fatma received training in fish handling, processing, and food safety standards. She learned techniques for smoking and drying fish that meet export quality requirements.',
      '"The training opened my eyes. I learned about hygiene, proper storage, and how to add value to my products. Now I sell processed fish to hotels and restaurants."',
      'Her monthly income has tripled, allowing her to build a new house and send her children to better schools. She employs three other women from her community.',
    ],
    contentSw: [
      'Fatma Said anasindika na kuuza samaki katika kituo cha Mkokotoni. Kabla ya TASFAM, alipambana na kuharibika kwa samaki na upatikanaji mdogo wa soko.',
      'Kituo kipya cha kuhifadhi baridi kilichojengwa na mradi kimekuwa na mabadiliko makubwa. "Tulikuwa tukipoteza samaki wengi kwa kuharibika, hasa wakati wa hali ya hewa ya joto. Sasa tunaweza kuhifadhi samaki vizuri na kuuza bei inapokuwa bora."',
      'Fatma alipata mafunzo katika kushughulikia samaki, kusindika, na viwango vya usalama wa chakula. Alijifunza mbinu za kuchoma na kukausha samaki zinazokidhi mahitaji ya ubora wa usafirishaji.',
      '"Mafunzo yalifungua macho yangu. Nilijifunza kuhusu usafi, uhifadhi sahihi, na jinsi ya kuongeza thamani kwa bidhaa zangu. Sasa ninauza samaki waliosindikwa kwa hoteli na mikahawa."',
      'Mapato yake ya kila mwezi yameongezeka mara tatu, kumruhusu kujenga nyumba mpya na kupeleka watoto wake shule bora. Anaajiri wanawake wengine watatu kutoka jamii yake.',
    ],
    image: '/gallery/ocean-background.jpg',
  },
}

export default function StoryPage() {
  const locale = useLocale()
  const params = useParams()
  const storyId = params.id as string

  const story = storiesData[storyId]

  if (!story) {
    return (
      <div className="bg-surface min-h-screen">
        <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
          <div className="container-max">
            <h1 className="font-bitter text-4xl font-bold mb-4">
              {locale === 'en' ? 'Story Not Found' : 'Hadithi Haijapatikana'}
            </h1>
          </div>
        </section>
        <section className="container-max py-12">
          <p className="text-[#4A5C63] mb-6">
            {locale === 'en'
              ? 'The story you are looking for could not be found.'
              : 'Hadithi unayoitafuta haijapatikana.'}
          </p>
          <Link
            href={`/${locale}/stories`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold"
          >
            {locale === 'en' ? 'Back to Stories' : 'Rudi kwa Hadithi'}
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <section className="text-white py-16" style={{ backgroundColor: '#2196C8' }}>
        <div className="container-max">
          <span className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2 block" style={{ color: '#CCE9F5' }}>
            {locale === 'en' ? 'Story from the Field' : 'Hadithi kutoka Uwandani'}
          </span>
          <h1 className="font-bitter text-3xl md:text-4xl font-bold mb-4 max-w-3xl">
            {locale === 'en' ? story.titleEn : story.titleSw}
          </h1>
          <p className="text-lg" style={{ color: '#E0F4FB' }}>
            {locale === 'en' ? story.authorEn : story.authorSw} — {locale === 'en' ? story.locationEn : story.locationSw}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-max py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 border border-hairline">
              <div className="prose prose-lg max-w-none">
                {(locale === 'en' ? story.contentEn : story.contentSw).map((paragraph, idx) => (
                  <p key={idx} className="text-[#4A5C63] leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-hairline">
                <Link
                  href={`/${locale}/stories`}
                  className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
                >
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {locale === 'en' ? 'Back to all stories' : 'Rudi kwa hadithi zote'}
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Image
                src={story.image}
                alt={locale === 'en' ? story.authorEn : story.authorSw}
                width={400}
                height={300}
                className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
              />
              <div className="mt-6 bg-white rounded-xl p-6 border border-hairline">
                <h3 className="font-bitter text-lg font-bold text-ink mb-3">
                  {locale === 'en' ? 'About this story' : 'Kuhusu hadithi hii'}
                </h3>
                <p className="text-sm text-[#4A5C63] mb-4">
                  {locale === 'en'
                    ? 'This is one of many stories of impact from the TASFAM project. Real people, real change.'
                    : 'Hii ni moja ya hadithi nyingi za athari kutoka mradi wa TASFAM. Watu wa kweli, mabadiliko ya kweli.'}
                </p>
                <Link
                  href={`/${locale}/grievance`}
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  {locale === 'en' ? 'Share your story' : 'Shiriki hadithi yako'} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
