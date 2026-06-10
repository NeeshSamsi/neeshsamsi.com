import Script from "next/script"

const WEBSITE_ID = "c98851cd-fce3-401d-aae0-6249488c14e1"

export default function Umami() {
  if (process.env.NODE_ENV !== "production") return null

  return (
    <>
      <Script src="/u/script.js" data-website-id={WEBSITE_ID} strategy="afterInteractive" />
      <Script
        src="/u/recorder.js"
        data-website-id={WEBSITE_ID}
        data-sample-rate="0.15"
        data-mask-level="moderate"
        data-max-duration="300000"
        strategy="afterInteractive"
      />
    </>
  )
}
