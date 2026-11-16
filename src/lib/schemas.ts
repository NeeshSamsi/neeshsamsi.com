import { z } from "zod"

/**
 * Validation schema for the ContactWidget submission.
 *
 * - `email` / `message` map 1:1 to the form fields.
 * - `website` is a honeypot — it's rendered hidden to users, but bots that
 *   naively fill every input will populate it. The server action checks this
 *   before validation and silently drops the submission.
 * - The 2000-char message limit fits Discord's embed description (4096),
 *   where the server action puts it. An embed field value only holds 1024.
 */
export const contactFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .max(254),
  message: z
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
  website: z.string().max(0).optional().default(""),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
