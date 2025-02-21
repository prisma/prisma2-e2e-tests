# turso-vercel-edge-qwik

Deploys a Prisma Client using the Turso Adapter and the Qwik City framework on Vercel Edge.

## Local Development

- Set up dependencies
  
  ```sh
  pnpm i
  pnpm prisma generate
  ```

- Start the development server

  ```sh
  pnpm dev
  ```

- Hit the middleware route, which uses Prisma Client to return a JSON: [/demo/users](http://localhost:5173/demo/users)

## CI Usage

Set the necessary env vars first.

```sh
source ./prepare.sh && ./run.sh && ./test.sh && ./finally.sh
```

## Qwik City App ⚡️

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.
