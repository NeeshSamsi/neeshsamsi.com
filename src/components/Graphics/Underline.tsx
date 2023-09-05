export default function Underline({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="243"
      height="20"
      className={className}
      fill="none"
    >
      <path
        stroke="#F4A430"
        strokeLinecap="round"
        strokeWidth="3"
        d="M2 9C40 2 153-2 241 7"
      ></path>
    </svg>
  )
}
