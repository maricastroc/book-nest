# Book Wise
![book-wise](https://github.com/maricastroc/book-wise/assets/121824373/57a7d61b-dd04-4727-9e77-e5e7197d276c)


## 📚 Project Description

The application consists of a book rating platform, where the reader can see recommendations from other readers and also make their own ratings of the books they have already read. Additionally, users can search for books by categories and check data about their reading history, such as the total number of pages and authors they have read. The app also features social authentication through a Google or GitHub account.



## 📌 What did I learn?

The most challenging part of this project was creating routes and endpoints for interacting with the database. Since the registered data had many relationships among themselves, and there were some data that needed to be calculated in the request body, it required a well-thought-out logic to obtain them at times.

I leveraged Next.js's server-side rendering feature, using `getServerSideProps`, to render database information on the server-side. Additionally, I used a seed.ts file to populate the database. NextAuth.js library was employed to implement social user authentication.

## 🔍 Links
[Preview Site](https://book-wise-puce.vercel.app/)

## 💻 My Process
### Built with:

- [React](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Next.Js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Next Auth](https://next-auth.js.org/)
- [Stitches](https://stitches.dev/)
- [axios](https://axios-http.com/docs/intro)
- [date-fns](https://date-fns.org/)
- [font-awesome](https://fontawesome.com/)
- [nookies](https://npm.io/package/nookies)
- [zod](https://zod.dev/)
- [react-hook-form](https://react-hook-form.com/)
- [phosphor-react](https://phosphoricons.com/)
- [radix-ui](https://www.radix-ui.com/)
- [react-simple-star-rating](https://www.npmjs.com/package/react-simple-star-rating)
- [react-toastify](https://fkhadra.github.io/react-toastify/introduction)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
<br/>

## ℹ️ How to run the application?

> Clone the repository:

```bash
git clone https://github.com/maricastroc/book-wise
```

> Install the dependencies:

```bash
npm install
```

> Switch to the commit that contains the local SQLite server:

```bash
git checkout f7b5aa42e70e25077697366192171bcec89dc3ab
```

> Rename the .env.example file to .env and add the necessary information to it.

> Start the service:

```bash
npm run dev
```

> ⏩ Access [http://localhost:3000](http://localhost:3000) to view the web application.
