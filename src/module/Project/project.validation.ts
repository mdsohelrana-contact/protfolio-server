import { z } from "zod";

export const ProjectCategoryEnum = z.enum([
  "FULLSTACK",
  "FRONTEND",
  "BACKEND",
  "LANDING_PAGE",
  "API",
]);
const CreateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z.string().url("Image must be a valid URL"),
    tags: z.array(z.string().min(1)).nonempty("At least one tag is required"),
    category: ProjectCategoryEnum.refine((val) => !!val, {
      message: "Category is required and must be a valid value",
    }),
    demoUrl: z.string().url("Demo URL must be a valid URL"),
    githubUrl: z.string().url("GitHub URL must be a valid URL"),
  }),
});

const UpdateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    tags: z.array(z.string().min(1)).optional(),
    category: ProjectCategoryEnum.refine((val) => !!val, {
      message: "Invalid category value",
    }).optional(),
    demoUrl: z.string().url("Demo URL must be a valid URL").optional(),
    githubUrl: z.string().url("GitHub URL must be a valid URL").optional(),
  }),
});

export const projectSchema = {
  CreateProjectSchema,
  UpdateProjectSchema,
};
