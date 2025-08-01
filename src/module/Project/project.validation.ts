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
    images: z
      .array(z.string().url("Image must be a valid URL"))
      .nonempty("At least one image is required"),
    tags: z.array(z.string().min(1)).nonempty("At least one tag is required"),
    category: ProjectCategoryEnum.refine((val) => !!val, {
      message: "Category is required and must be a valid value",
    }),
    projectContent: z.string(),
    demoUrl: z.string().url("Demo URL must be a valid URL"),
    clientRepo: z.string().url("Client Repository URL must be a valid URL"),
    serverRepo: z.string().url("Server Repository URL must be a valid URL"),
  }),
});

const UpdateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    projectContent: z.string().optional(),
    images: z.array(z.string().url("Image must be a valid URL")).optional(),
    tags: z.array(z.string().min(1)).optional(),
    category: ProjectCategoryEnum.refine((val) => !!val, {
      message: "Invalid category value",
    }).optional(),
    demoUrl: z.string().url("Demo URL must be a valid URL").optional(),
    clientRepo: z.string().url("Client Repository URL must be a valid URL").optional(),
    serverRepo: z.string().url("Server Repository URL must be a valid URL").optional(),
  }),
});

export const projectSchema = {
  CreateProjectSchema,
  UpdateProjectSchema,
};
