"use client"

import { useActionState, useCallback, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { PrismicNextImage } from "@prismicio/next"
import type { ImageField } from "@prismicio/client"
import { Field, Label, Input, Textarea } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import { contactFormSchema } from "@/lib/schemas"
import { submitContact, type ContactFormState } from "@/app/actions/contact"

// Lives here rather than in the action file because "use server" modules
// can only export async functions.
const initialContactState: ContactFormState = { status: "idle" }

interface ContactWidgetProps {
  image: ImageField
  ctaText: string
}

export default function ContactWidget({ image, ctaText }: ContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialContactState,
  )
  // Client-side validation errors; merged with server errors at render time.
  const [clientErrors, setClientErrors] = useState<{
    email?: string
    message?: string
  }>({})
  const cardRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleOpen = useCallback(() => {
    setClientErrors({})
    setIsOpen(true)
  }, [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  // Close on Escape — but not while submitting.
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) handleClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, handleClose, isPending])

  // Close on outside click — but not while submitting.
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (isPending) return
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    // Delay so the opening click doesn't immediately close it.
    const tid = setTimeout(() => document.addEventListener("click", handler), 0)
    return () => {
      clearTimeout(tid)
      document.removeEventListener("click", handler)
    }
  }, [isOpen, handleClose, isPending])

  // Reset and auto-close once the success message has been shown.
  useEffect(() => {
    if (state.status !== "success") return
    formRef.current?.reset()
    const tid = setTimeout(() => setIsOpen(false), 5000)
    return () => clearTimeout(tid)
  }, [state.status])

  // Capture the browser's validity message into our styled UI and suppress
  // its default tooltip. Submission is still blocked natively.
  const handleInvalid: React.FormEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    e.preventDefault()
    const input = e.currentTarget
    const name = input.name as "email" | "message"
    let msg = input.validationMessage
    if (input.validity.valueMissing) {
      msg = name === "email" ? "Email is required." : "Message is required."
    } else if (input.validity.typeMismatch) {
      msg = "Please enter a valid email address."
    } else if (input.validity.tooShort) {
      msg = "Message must be at least 5 characters."
    }
    setClientErrors((prev) => ({ ...prev, [name]: msg }))
  }

  // Clear the field error when it becomes valid again, and mirror our Zod
  // email check into the browser's Constraint Validation API so HTML5 and
  // the server apply the same rules.
  const handleInput: React.FormEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const input = e.currentTarget
    const name = input.name as "email" | "message"

    if (name === "email" && input instanceof HTMLInputElement) {
      if (input.value === "") {
        // Let `required` handle empty values.
        input.setCustomValidity("")
      } else {
        const result = contactFormSchema.shape.email.safeParse(input.value)
        input.setCustomValidity(
          result.success
            ? ""
            : (result.error.issues[0]?.message ??
                "Please enter a valid email address."),
        )
      }
    }

    if (clientErrors[name] && input.validity.valid) {
      setClientErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const emailError = clientErrors.email ?? state.fieldErrors?.email
  const messageError = clientErrors.message ?? state.fieldErrors?.message

  return (
    <div
      ref={cardRef}
      className={cn(
        "pointer-events-auto relative col-span-full justify-self-end overflow-hidden border-2 border-brand transition-all duration-300 ease-out [interpolate-size:allow-keywords] xs:col-span-8 xs:col-start-5 sm:col-span-6 sm:col-start-7 lg:col-span-4 lg:col-start-9",
        isOpen
          ? "w-full rounded-xl bg-dark/90 backdrop-blur-md"
          : "group w-fit cursor-pointer rounded-lg bg-dark/30 backdrop-blur-sm",
      )}
    >
      {/* Absolutely positioned so it stays out of the flex layout — fades
          cleanly and doesn't reserve phantom space or contribute to the
          closed-state `w-fit`. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!isPending) handleClose()
        }}
        disabled={isPending}
        tabIndex={isOpen ? 0 : -1}
        aria-hidden={!isOpen}
        aria-label="Close contact form"
        className={cn(
          "absolute top-3 right-3 z-10 cursor-pointer rounded-md p-1 text-lighter transition-opacity duration-300 ease-out hover:text-light disabled:cursor-not-allowed disabled:opacity-50 md:top-4 md:right-4",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Header morphs between pill button and modal header. Right padding
          in the open state reserves room for the absolute close button. */}
      <div
        onClick={!isOpen ? handleOpen : undefined}
        className={cn(
          "flex items-center transition-all duration-300 ease-out [interpolate-size:allow-keywords]",
          isOpen
            ? "gap-3 border-b border-lighter/20 p-3 pr-12 md:p-4 md:pr-14"
            : "h-12 md:h-14",
        )}
      >
        {/* Fixed sizes in both states so CSS interpolates cleanly. */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-brand transition-all duration-300 ease-out",
            isOpen
              ? "h-10 w-10 rounded-md md:h-12 md:w-12"
              : "h-12 w-12 md:h-14 md:w-14",
          )}
        >
          <PrismicNextImage
            field={image}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <span
          className={cn(
            "font-medium whitespace-nowrap text-light transition-all duration-300 ease-out",
            isOpen
              ? "text-base md:text-lg"
              : "pr-4 pl-3 text-base leading-none group-hover:text-lighter md:pr-5 md:pl-4 md:text-lg",
          )}
        >
          {ctaText}
        </span>
      </div>

      {/* Clamping `max-width` to 0 when closed stops the form's intrinsic
          width from leaking into the outer container's `w-fit`. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,max-width,opacity] duration-300 ease-out",
          isOpen
            ? "max-w-full grid-rows-[1fr] opacity-100"
            : "max-w-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden" inert={isOpen ? undefined : true}>
          {state.status === "success" ? (
            <SuccessPanel />
          ) : (
            <form
              ref={formRef}
              action={formAction}
              className="flex flex-col gap-4 p-3 md:p-4"
            >
              {/* Honeypot — hidden from humans, fillable by naive bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
                defaultValue=""
              />

              <Field>
                <Label
                  htmlFor="contact-email"
                  className="mb-1 block text-sm font-medium text-lighter"
                >
                  Your email
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  defaultValue={state.values?.email ?? ""}
                  onInvalid={handleInvalid}
                  onInput={handleInput}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={
                    emailError ? "contact-email-error" : undefined
                  }
                  className={cn(
                    "w-full rounded-lg border bg-dark/50 px-3 py-2 text-sm text-light placeholder:text-lighter/50 focus:ring-1 focus:outline-none",
                    emailError
                      ? "border-red-400/70 focus:border-red-400 focus:ring-red-400"
                      : "border-lighter/30 focus:border-brand focus:ring-brand",
                  )}
                />
                {emailError ? (
                  <p
                    id="contact-email-error"
                    className="mt-1 text-xs text-red-400"
                  >
                    {emailError}
                  </p>
                ) : null}
              </Field>

              <Field>
                <Label
                  htmlFor="contact-message"
                  className="mb-1 block text-sm font-medium text-lighter"
                >
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={5}
                  rows={3}
                  placeholder="What's on your mind?"
                  defaultValue={state.values?.message ?? ""}
                  onInvalid={handleInvalid}
                  onInput={handleInput}
                  aria-invalid={messageError ? true : undefined}
                  aria-describedby={
                    messageError ? "contact-message-error" : undefined
                  }
                  className={cn(
                    "w-full resize-none rounded-lg border bg-dark/50 px-3 py-2 text-sm text-light placeholder:text-lighter/50 focus:ring-1 focus:outline-none",
                    messageError
                      ? "border-red-400/70 focus:border-red-400 focus:ring-red-400"
                      : "border-lighter/30 focus:border-brand focus:ring-brand",
                  )}
                />
                {messageError ? (
                  <p
                    id="contact-message-error"
                    className="mt-1 text-xs text-red-400"
                  >
                    {messageError}
                  </p>
                ) : null}
              </Field>

              {state.formError ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                >
                  {state.formError}
                </p>
              ) : null}

              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer self-end rounded-lg bg-brand px-5 py-2 text-sm font-medium text-dark transition-colors hover:bg-light disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  )
}

function SuccessPanel() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-1 p-4 md:p-5"
    >
      <p className="text-base font-medium text-light">✓ Message sent</p>
      <p className="text-sm text-lighter">
        Thanks! I&apos;ll get back to you soon.
      </p>
    </div>
  )
}
