import Script from "next/script"

import { isProductionDeployment } from "@/lib/deployment"

const WEBSITE_ID = "c98851cd-fce3-401d-aae0-6249488c14e1"

export default function Umami() {
  // Local builds and preview deployments load neither script.
  if (!isProductionDeployment) return null

  return (
    <>
      {/* a.js / b.js are ad-blocker-evading aliases for Umami's script.js /
          recorder.js, proxied via the /u/ rewrites in next.config.js.
          data-exclude-search stays unset so UTM parameters and click IDs
          keep reaching Umami. */}
      <Script
        src="/u/a.js"
        data-website-id={WEBSITE_ID}
        data-domains="www.neeshsamsi.com"
        data-exclude-hash="true"
        data-do-not-track="true"
        data-performance="true"
        data-errors="true"
        data-environment={process.env.VERCEL_ENV}
        data-release={process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}
        strategy="afterInteractive"
      />
      {/* The recorder (replays and heatmaps) reads only its website ID here.
          Its sample rate, masking and duration are set in the Umami dashboard
          (Websites, Edit, Replays & Heatmaps). */}
      <Script
        src="/u/b.js"
        data-website-id={WEBSITE_ID}
        strategy="afterInteractive"
      />
    </>
  )
}
