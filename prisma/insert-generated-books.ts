/**
 * Inserts generated books into the database without wiping existing data.
 * Run after fetch-books.ts has generated prisma/constants/books-generated.ts
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/insert-generated-books.ts
 */

import { PrismaClient } from '@prisma/client'
import { generatedBooks } from './constants/books-generated'

const prisma = new PrismaClient()

async function main() {
  console.log(`Inserting ${generatedBooks.length} books...\n`)

  let inserted = 0
  let skipped = 0

  for (const book of generatedBooks) {
    const exists = await prisma.book.findFirst({
      where: {
        OR: [
          { isbn: book.isbn },
          { name: { equals: book.name, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    })

    if (exists) {
      console.log(`  [SKIP] "${book.name}" already exists`)
      skipped++
      continue
    }

    await prisma.book.create({
      data: {
        id: book.id,
        name: book.name,
        author: book.author,
        summary: book.summary,
        coverUrl: book.coverUrl,
        totalPages: book.totalPages,
        publishingYear: book.publishingYear ?? undefined,
        publisher: book.publisher ?? undefined,
        language: book.language ?? undefined,
        isbn: book.isbn ?? undefined,
        status: 'APPROVED',
        categories: {
          create: book.categories.map((category: { id: string }) => ({
            category: { connect: { id: category.id } },
          })),
        },
      },
    })

    console.log(`  [OK]   "${book.name}"`)
    inserted++
  }

  console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
