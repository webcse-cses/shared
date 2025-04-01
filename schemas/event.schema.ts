import { z } from "zod";

export const eventSchema = z.object({
    _id: z.string(),
    type: z.enum(["Hackathon", "Cultural", "Seminar"]),
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    prizePool: z.number().optional(),
    ruleBookLink: z.string().url().optional().or(z.literal("")),
    venue: z.string().optional(),
    date: z.string(), // Using string for date from API, will be converted to Date when needed
    contacts: z
      .array(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          phone: z
            .string()
            .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" })
            .optional(),
        })
      )
      .min(1, { message: "At least one contact is required" }),
    category: z.string().optional(),
  });

type Event = z.infer<typeof eventSchema>;

export default Event