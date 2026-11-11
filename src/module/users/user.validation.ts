import { z } from 'zod';
export const addUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    age: z
      .number()
      .int()
      .positive({ message: 'Age must be a positive integer' }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm Password must be at least 6 characters long',
    }),
    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: 'custom', message: 'Passwords do not match' });
    }
  });
