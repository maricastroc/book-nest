# Book Nest
![book-wise](https://github.com/maricastroc/book-wise/assets/121824373/57a7d61b-dd04-4727-9e77-e5e7197d276c)


## 📚 Project Description

The application consists of a book rating platform, where the reader can see recommendations from other readers and also make their own ratings of the books they have already read. Additionally, users can search for books by categories and check data about their reading history, such as the total number of pages and authors they have read. The app also features social authentication through a Google or GitHub account.

Users can track their reading progress by marking books with different statuses: read, reading, did not finish, and want to read. This feature helps users organize and monitor their personal reading history.

Users can also submit new books to the platform by providing the ISBN. Upon submission, the app fetches detailed technical data from external sources using the Google Books API and the Open Library API, enriching the platform’s book database.

## 📌 What did I learn?

The most challenging part of this project was creating routes and endpoints for interacting with the database. Since the registered data had many relationships among themselves, and there were some data that needed to be calculated in the request body, it required a well-thought-out logic to obtain them at times. The application is also covered by automated tests implemented with Jest, ensuring reliability and maintainability of the codebase.

## 🔍 Links
[Preview Site](https://book-wise-puce.vercel.app/)

## 🛠️ Tech Stack

| Category        | Technologies                          |
|----------------|----------------------------------------|
| **Framework**   | Next.js 13 (App Router)               |
| **Styling**     | Stitches, CSS Modules                 |
| **Database**    | PostgreSQL + Prisma ORM               |
| **Authentication** | NextAuth.js                      |
| **Testing**     | Jest, React Testing Library           |
| **Tooling**     | ESLint, Prettier                      |

## ℹ️ How to run the application?

> Clone the repository:

```bash
git clone https://github.com/maricastroc/book-wise
```

> Install the dependencies:

```bash
npm install
```

> Rename the .env.example file to .env and add the necessary information to it.

> Generate the Prisma client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

> Start the service:

```bash
npm run dev
```

> Run all tests:

```bash
npm test
npm run test:coverage
```

> ⏩ Access [http://localhost:3000](http://localhost:3000) to view the web application.
