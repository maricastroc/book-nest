import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMostFrequentString } from '@/utils/getMostFrequentString'

export const config = { runtime: 'nodejs' }

const CARD_BG = '#161D2F'
const SURFACE = '#252D4A'
const ACCENT_TEAL = '#50B2C0'
const ACCENT_PURPLE = '#8381D9'
const TEXT_PRIMARY = '#F8F9FC'
const TEXT_SECONDARY = '#8D95AF'

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: SURFACE,
        borderRadius: 12,
        padding: '20px 28px',
        gap: 4,
        flex: 1,
      }}
    >
      <span
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: TEXT_PRIMARY,
          lineHeight: 1,
        }}
      >
        {value ?? '—'}
      </span>
      <span
        style={{ fontSize: 13, color: TEXT_SECONDARY, textAlign: 'center' }}
      >
        {label}
      </span>
    </div>
  )
}

export default async function handler(req: NextRequest) {
  const url = new URL(req.url)
  const userId = url.pathname.split('/').pop() ?? ''

  let name = 'Reader'
  let avatarUrl: string | null = null
  let readPages = 0
  let ratedBooks = 0
  let authorsCount = 0
  let bestGenre: string | null = null

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (user) {
      name = user.name ?? 'Reader'
      avatarUrl = user.avatarUrl ?? null

      const readBooks = await prisma.book.findMany({
        where: {
          readingStatus: {
            some: { userId, status: { equals: 'read', mode: 'insensitive' } },
          },
        },
        include: { categories: { include: { category: true } } },
      })

      readPages = readBooks.reduce((acc, book) => acc + book.totalPages, 0)
      authorsCount = new Set(readBooks.map((b) => b.author)).size
      const categoryNames = readBooks.flatMap((b) =>
        b.categories.map((c) => c.category.name),
      )
      bestGenre = categoryNames.length
        ? getMostFrequentString(categoryNames)
        : null

      ratedBooks = await prisma.rating.count({ where: { userId } })
    }
  } catch {
    // return a fallback image if DB is unavailable
  }

  const isExternalAvatar =
    avatarUrl &&
    (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://'))

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: CARD_BG,
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        {/* gradient top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: `linear-gradient(90deg, ${ACCENT_TEAL}, ${ACCENT_PURPLE})`,
            display: 'flex',
          }}
        />

        {/* header: avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {isExternalAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl as string}
              width={96}
              height={96}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              alt={name}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: SURFACE,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                color: TEXT_SECONDARY,
              }}
            >
              👤
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{ fontSize: 36, fontWeight: 700, color: TEXT_PRIMARY }}
            >
              {name}
            </span>
            <span style={{ fontSize: 18, color: TEXT_SECONDARY }}>
              Reading profile · Book Nest
            </span>
          </div>
        </div>

        {/* divider */}
        <div
          style={{
            height: 1,
            background: SURFACE,
            margin: '40px 0',
            display: 'flex',
          }}
        />

        {/* stats grid */}
        <div style={{ display: 'flex', gap: 16, flex: 1 }}>
          <StatCard value={readPages.toLocaleString()} label="Pages read" />
          <StatCard value={ratedBooks} label="Books rated" />
          <StatCard value={authorsCount} label="Authors read" />
          <StatCard value={bestGenre ?? '—'} label="Favourite genre" />
        </div>

        {/* footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 40,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: TEXT_SECONDARY,
              letterSpacing: '0.05em',
            }}
          >
            booknest.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
