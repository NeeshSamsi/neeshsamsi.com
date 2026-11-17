// True only on the site's Vercel production deployment. Vercel exposes
// VERCEL_ENV to the browser as NEXT_PUBLIC_VERCEL_ENV, because this project
// has "Automatically expose System Environment Variables" on. Local builds and
// preview deployments are left out, so neither reports to Umami or Mux Data.
export const isProductionDeployment =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
