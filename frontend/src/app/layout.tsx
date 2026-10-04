import '@/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface">
        {children}
      </body>
    </html>
  )
}

export const metadata = {
  title: 'TASFAM - Tanzania Scaling-up Sustainable Fisheries and Aquaculture Management',
  description: 'World Bank-supported project improving fisheries management across Unguja, Pemba and the mainland coast of Tanzania.',
}
