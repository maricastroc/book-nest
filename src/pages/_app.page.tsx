import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'
import { SessionProvider } from 'next-auth/react'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from '@/contexts/AppContext'
import { Toaster } from 'react-hot-toast'
import { RatingsProvider } from '@/contexts/RatingsContext'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: '#161D2F',
            color: '#fff',
          },
          success: {
            style: {
              backgroundColor: '#161D2F',
              color: '#fff',
            },
          },
          error: {
            style: {
              backgroundColor: '#161D2F',
              color: '#fff',
            },
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
