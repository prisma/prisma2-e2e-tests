import { vercelEdgeAdapter } from "@builder.io/qwik-city/adapters/vercel-edge/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["./src/entry.vercel-edge.tsx", "@qwik-city-plan"],
      },
      outDir: ".vercel/output/functions/_qwik-city.func",
    },
    plugins: [
      vercelEdgeAdapter(),
    ],

    // - Adding `resolve` makes the build succeed on Vercel, only to fail at runtime with `TypeError: Ju.PrismaClient is not a constructor` */
    // - Without `resolve`, the Vercel build fails with `TypeError [PLUGIN_ERROR]: Invalid module ".prisma/client/default" is not a valid package name imported from /vercel/path0/.vercel/output/functions/_qwik-city.func/@qwik-city-plan.js`
    // resolve: {
    //   alias: {
    //     ".prisma/client/default": "./node_modules/@prisma/client/index.js",
    //   },
    // },
  };
});
