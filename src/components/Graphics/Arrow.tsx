export default function Arrow({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="77"
      height="21"
      fill="none"
      className={className}
    >
      <g clipPath="url(#a)">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5"
          d="M3 16c9.7.7 38.2-1.3 60.2-6"
        ></path>
        <path
          fill="currentColor"
          d="M62.5 18.1c-.5-1-.9-1.6-1.1-2.3l-1.7-5.5c-.2-.8-.4-1.5-1-2-.3-.3-.5-.7-.5-1 0-.8-.3-1.4-.6-2l-.9-2.6a3 3 0 010-1.2c0-.6.5-1 1-1 1.2.2 2.3 0 3.4.5 2.7 1.2 5.5 1.8 8.3 2.2a140 140 0 016.7 1.4c.7.4.8 1.3.2 1.9l-.7.5c-1.8.8-3 2.2-4 3.8l-2 3-3 4.4-1.9 1.8c-.4.4-1 .6-1.6.6-.8 0-1.4-.7-1.1-1.5l.5-1z"
        ></path>
      </g>
    </svg>
  )
}
