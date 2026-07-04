import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/tailwind.css'
import { SessionProvider } from 'next-auth/react'
import { AppProvider } from '@/contexts/AppContext'
import { Toaster } from 'react-hot-toast'
import { RatingsProvider } from '@/contexts/RatingsContext'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            backgroundColor: '#212126',
            color: '#f3f3f4',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: { primary: '#e8b14c', secondary: '#2a1e05' },
          },
          error: {
            iconTheme: { primary: '#e05c5c', secondary: '#fff' },
          },
        }}
      />
      <AppProvider>
        <RatingsProvider>
          <Component {...pageProps} />
        </RatingsProvider>
      </AppProvider>
    </SessionProvider>
  )
}
