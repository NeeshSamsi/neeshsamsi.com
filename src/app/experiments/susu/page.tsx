'use client'

/**
 * SusuPage renders the Vite animation playground in a full-screen iframe.
 * We use 'fixed inset-0' to bypass the root layout's Navbar/Footer/Padding
 * and provide a truly immersive experience as intended.
 */
export default function SusuPage() {
  return (
    <iframe
      src="/experiments/susu/index.html"
      className="fixed inset-0 z-[9999] h-screen w-screen border-none bg-dark"
      title="susu experiments" allow="camera"
    />
  )
}
