import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(['INSTRUCTOR', 'STUDENT']),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const CreateCourseSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number()
});

const CreateLessonSchema = z.object({
    title: z.string(),
    content: z.string(),
    courseId: z.string()
});

const PurchaseCourseSchema = z.object({
    courseId: z.string()
});

export const schemas = {
    SignupSchema,
    LoginSchema,
    CreateCourseSchema,
    CreateLessonSchema,
    PurchaseCourseSchema
}