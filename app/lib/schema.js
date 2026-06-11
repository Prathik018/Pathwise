import { z } from 'zod';

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: 'Please select an industry',
  }),
  subIndustry: z.string({
    required_error: 'Please select a specialization',
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, 'Experience must be at least 0 years')
        .max(50, 'Experience cannot exceed 50 years'),
    ),
  skills: z
    .array(
      z.object({
        name: z.string().min(1, 'Skill name is required'),
        level: z.enum(['beginner', 'intermediate', 'advanced']),
      }),
    )
    .min(1, 'Add at least one skill'),
});

export const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  codingProfile: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: 'End date is required unless this is your current position',
      path: ['endDate'],
    },
  );

export const customSectionSchema = z.object({
  heading: z.string().min(1, 'Section heading is required'),
  title: z.string().min(1, 'Title is required'),
  date: z.string().optional(),
  link: z.string().optional(),
  description: z.string().optional(),
});

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, 'Professional summary is required'),
  skills: z.string().min(1, 'Skills are required'),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
  customSections: z.array(customSectionSchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
});
