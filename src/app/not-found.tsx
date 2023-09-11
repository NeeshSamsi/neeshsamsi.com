import Button from "@/components/Button"
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

export default function NotFound() {
  return (
    <main className="mb-20 mt-12 grid place-items-center text-center md:mb-36 md:mt-24">
      <p className="text-lg font-light text-lighter sm:text-xl md:text-2xl xl:text-3xl">
        404: Not Found
      </p>
      <h1 className="mt-4 font-serif text-2xl font-medium sm:text-3xl md:text-4xl xl:text-5xl">
        Whoops! This page could not be found.
      </h1>
      <div className="mt-10 w-fit text-sm sm:text-base md:text-lg xl:text-xl">
        <Button element="link" href="/" type="outline" theme="light">
          <ArrowLongLeftIcon className="aspect-square w-5" strokeWidth={2} />
          Back home
        </Button>
      </div>

      <Image
        src="/sad.png"
        alt="Sad face"
        width={512}
        height={512}
        className="mt-12 aspect-square w-64 md:w-72 lg:w-96 xl:w-auto"
      />
    </main>
  )
}
