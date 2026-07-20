import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address."),

  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters.")
    .max(100, "Subject cannot exceed 100 characters."),

  message: z
    .string()
    .trim()
    .min(20, "Message must contain at least 20 characters.")
    .max(500, "Message cannot exceed 500 characters."),
});

/*
|--------------------------------------------------------------------------
| Update Contact Schema (Admin Edit - partial)
|--------------------------------------------------------------------------
*/

export const updateContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .optional(),

  subject: z
    .string()
    .trim()
    .min(5, "Subject must be at least 5 characters.")
    .max(100, "Subject cannot exceed 100 characters.")
    .optional(),

  message: z
    .string()
    .trim()
    .min(20, "Message must contain at least 20 characters.")
    .max(500, "Message cannot exceed 500 characters.")
    .optional(),

  status: z
    .enum(["New", "Important", "Resolved"], {
      message: "Status must be one of New, Important, or Resolved.",
    })
    .optional(),

  removeImage: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Status Update Schema
|--------------------------------------------------------------------------
*/

export const statusSchema = z.object({
  status: z.enum(["New", "Important", "Resolved"], {
    message: "Status must be one of New, Important, or Resolved.",
  }),
});

export default contactSchema;