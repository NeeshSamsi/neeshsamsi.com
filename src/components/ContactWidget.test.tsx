// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { ContactFormState } from "@/app/actions/contact"

const submitContact = vi.hoisted(() => vi.fn())

vi.mock("@/app/actions/contact", () => ({ submitContact }))
// Image optimisation is irrelevant here and needs the Next runtime.
vi.mock("@prismicio/next", () => ({ PrismicNextImage: () => null }))

import ContactWidget from "./ContactWidget"

const emptyImage = {} as Parameters<typeof ContactWidget>[0]["image"]

function setup() {
  render(<ContactWidget image={emptyImage} ctaText="Get in touch" />)
  return userEvent.setup()
}

const pill = () => screen.getByRole("button", { name: "Get in touch" })
const email = () => screen.getByLabelText("Your email")
const message = () => screen.getByLabelText("Message")

async function send(user: ReturnType<typeof userEvent.setup>) {
  await user.type(email(), "someone@example.com")
  await user.type(message(), "Hello there")
  await user.click(screen.getByRole("button", { name: /send message/i }))
}

describe("ContactWidget", () => {
  beforeEach(() => {
    submitContact.mockReset()
    // GSAP's matchMedia (used for the reduced-motion gate) needs this API.
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }))
  })
  afterEach(cleanup)

  it("opens from the keyboard and moves focus into the form", async () => {
    const user = setup()

    pill().focus()
    await user.keyboard("{Enter}")

    expect(email()).toHaveProperty("required", true)
    await waitFor(() => expect(document.activeElement).toBe(email()))
    // Once open, the header is no longer a button to "open" anything.
    expect(screen.queryByRole("button", { name: "Get in touch" })).toBeNull()
  })

  it("also opens with the space bar", async () => {
    const user = setup()

    pill().focus()
    await user.keyboard(" ")

    await waitFor(() => expect(document.activeElement).toBe(email()))
  })

  it("leaves focus alone when opened with the pointer", async () => {
    const user = setup()

    await user.click(pill())

    expect(document.activeElement).not.toBe(email())
  })

  it("closes on Escape and hands focus back to the pill", async () => {
    const user = setup()
    pill().focus()
    await user.keyboard("{Enter}")
    await waitFor(() => expect(document.activeElement).toBe(email()))

    await user.keyboard("{Escape}")

    await waitFor(() => expect(document.activeElement).toBe(pill()))
  })

  it("submits the form values to the server action and confirms", async () => {
    submitContact.mockResolvedValue({
      status: "success",
    } satisfies ContactFormState)
    const user = setup()
    await user.click(pill())

    await send(user)

    expect(await screen.findByText(/message sent/i)).toBeTruthy()
    const [, formData] = submitContact.mock.calls[0] as [
      ContactFormState,
      FormData,
    ]
    expect(formData.get("email")).toBe("someone@example.com")
    expect(formData.get("message")).toBe("Hello there")
    expect(formData.get("website")).toBe("")
  })

  it("shows an empty form again when reopened after a sent message", async () => {
    submitContact.mockResolvedValue({
      status: "success",
    } satisfies ContactFormState)
    const user = setup()
    await user.click(pill())
    await send(user)
    await screen.findByText(/message sent/i)

    await user.click(screen.getByRole("button", { name: "Close contact form" }))
    await user.click(pill())

    await waitFor(() => expect(screen.queryByText(/message sent/i)).toBeNull())
    expect((email() as HTMLInputElement).value).toBe("")
    expect((message() as HTMLTextAreaElement).value).toBe("")

    // And a second message can actually be sent.
    await send(user)
    await waitFor(() => expect(submitContact).toHaveBeenCalledTimes(2))
  })

  it("shows a server failure and keeps what the visitor typed", async () => {
    submitContact.mockResolvedValue({
      status: "error",
      formError: "Something went wrong sending your message. Please try again.",
      values: { email: "someone@example.com", message: "Hello there" },
    } satisfies ContactFormState)
    const user = setup()
    await user.click(pill())

    await send(user)

    expect((await screen.findByRole("alert")).textContent).toMatch(
      /something went wrong/i,
    )
    expect((email() as HTMLInputElement).value).toBe("someone@example.com")
    expect((message() as HTMLTextAreaElement).value).toBe("Hello there")
  })

  it("shows server-side field errors next to their fields", async () => {
    submitContact.mockResolvedValue({
      status: "error",
      fieldErrors: { email: "Please enter a valid email address." },
      values: { email: "someone@example.com", message: "Hello there" },
    } satisfies ContactFormState)
    const user = setup()
    await user.click(pill())

    await send(user)

    const error = await screen.findByText("Please enter a valid email address.")
    // Exposed to assistive tech, and only on the field that failed.
    expect(email().getAttribute("aria-invalid")).toBe("true")
    expect(email().getAttribute("aria-describedby")).toBe(error.id)
    expect(message().getAttribute("aria-invalid")).toBeNull()
  })
})
