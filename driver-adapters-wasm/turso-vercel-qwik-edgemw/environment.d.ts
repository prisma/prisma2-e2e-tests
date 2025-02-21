export {};

module "@builder.io/qwik-city/middleware/request-handler" {
  interface EnvGetter {
    get(name: "DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_DATABASE_URL"): string;
    get(name: "DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_TOKEN"): string;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_DATABASE_URL: string;
      DRIVER_ADAPTERS_TURSO_VERCEL_QWIK_EDGEMW_TOKEN: string;
    }
  }
}
