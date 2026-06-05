import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  department: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
});

export const systemSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
});

export const researchProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]),
  department: z.string().min(1, "Department is required"),
  budget: z.number().positive("Budget must be positive"),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => s ? new Date(s) : null).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const aiModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  version: z.string().min(1, "Version is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["ACTIVE", "TRAINING", "DEPRECATED", "ARCHIVED"]),
  parameters: z.number().positive("Parameters must be positive"),
  contextWindow: z.number().int().positive("Context window must be positive"),
  capabilities: z.string().min(1, "Capabilities are required"),
  benchmarks: z.string().min(1, "Benchmarks are required"),
  apiEndpoint: z.string().url().optional().nullable(),
  pricing: z.string().optional().nullable(),
});

export const datasetSchema = z.object({
  name: z.string().min(1, "Dataset name is required"),
  description: z.string().min(1, "Description is required"),
  size: z.string().min(1, "Size is required"),
  licenseType: z.string().min(1, "License type is required"),
  storageLocation: z.string().min(1, "Storage location is required"),
  format: z.string().optional(),
  domain: z.string().optional(),
  projectId: z.string().optional().nullable(),
});

export const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z.string().min(1, "Authors are required"),
  journal: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  doi: z.string().optional(),
  pdfUrl: z.string().url().optional().nullable(),
  keywords: z.string().min(1, "Keywords are required"),
  projectId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "SUBMITTED", "PUBLISHED", "REJECTED"]),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["PLATFORM", "TOOL", "SERVICE", "API"]),
  version: z.string().min(1, "Version is required"),
  status: z.enum(["ACTIVE", "BETA", "DEPRECATED", "PLANNED"]),
  parameters: z.string().min(1, "Parameters are required"),
  pricing: z.string().optional().nullable(),
  documentation: z.string().optional(),
  features: z.string().min(1, "Features are required"),
  thumbnail: z.string().url().optional().nullable(),
});

export const jobListingSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  level: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  location: z.string().optional(),
  remote: z.boolean().optional(),
  status: z.enum(["OPEN", "CLOSED", "ON_HOLD"]).optional(),
});

export const jobApplicationSchema = z.object({
  listingId: z.string().min(1, "Job listing ID is required"),
  applicantName: z.string().min(1, "Applicant name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  resumeUrl: z.string().url().optional().nullable(),
  coverLetter: z.string().optional(),
});

export const interviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  type: z.enum(["PHONE", "VIDEO", "ONSITE", "TECHNICAL", "CULTURAL"]),
  scheduledAt: z.string().transform((s) => new Date(s)),
  duration: z.number().int().positive().optional(),
  notes: z.string().optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
});

export const budgetAllocationSchema = z.object({
  projectId: z.string().optional().nullable(),
  department: z.string().min(1, "Department is required"),
  fiscalYear: z.number().int().min(2000).max(2100),
  allocated: z.number().positive("Allocated amount must be positive"),
  spent: z.number().min(0).optional(),
  category: z.enum(["RESEARCH", "OPERATIONS", "INFRASTRUCTURE", "PERSONNEL"]),
  notes: z.string().optional(),
});

export const newsArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  category: z.enum(["PRESS_RELEASE", "ANNOUNCEMENT", "PARTNERSHIP", "MILESTONE"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().transform((s) => s ? new Date(s) : null).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["CONFERENCE", "WORKSHOP", "SEMINAR", "WEBINAR", "MEETUP"]),
  location: z.string().optional(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => s ? new Date(s) : null).optional(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
});

export const trainingRunSchema = z.object({
  modelId: z.string().min(1, "Model ID is required"),
  status: z.enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED"]),
  datasetSize: z.number().int().positive(),
  hyperparameters: z.string().min(1, "Hyperparameters are required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type SystemSettingInput = z.infer<typeof systemSettingSchema>;
export type ResearchProjectInput = z.infer<typeof researchProjectSchema>;
export type AIModelInput = z.infer<typeof aiModelSchema>;
export type DatasetInput = z.infer<typeof datasetSchema>;
export type PublicationInput = z.infer<typeof publicationSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type JobListingInput = z.infer<typeof jobListingSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type InterviewInput = z.infer<typeof interviewSchema>;
export type BudgetAllocationInput = z.infer<typeof budgetAllocationSchema>;
export type NewsArticleInput = z.infer<typeof newsArticleSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type TrainingRunInput = z.infer<typeof trainingRunSchema>;