'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Eye, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { saveResume } from '@/actions/resume';
import { EntryForm } from './entry-form';
import { CustomSectionForm } from './custom-section-form';
import ResumePreview from './resume-preview';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/nextjs';
import { entriesToMarkdown } from '@/app/lib/helper';
import { resumeSchema } from '@/app/lib/schema';

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState('edit');
  const { user } = useUser();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: '',
      skills: '',
      experience: [],
      education: [],
      projects: [],
      customSections: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab('preview');
  }, [initialContent]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success('Resume saved successfully!');
    }
    if (saveError) {
      toast.error(saveError.message || 'Failed to save resume');
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(contactInfo.email);
    if (contactInfo.mobile) parts.push(contactInfo.mobile);
    if (contactInfo.linkedin) parts.push(`[LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.github) parts.push(`[GitHub](${contactInfo.github})`);
    if (contactInfo.portfolio)
      parts.push(`[Portfolio](${contactInfo.portfolio})`);
    if (contactInfo.codingProfile)
      parts.push(`[Coding Profile](${contactInfo.codingProfile})`);

    return parts.length > 0
      ? `# ${user?.fullName || 'Your Name'}\n\n${parts.join(' | ')}`
      : '';
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects, customSections } =
      formValues;

    const sections = [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, 'Work Experience'),
      entriesToMarkdown(education, 'Education'),
      entriesToMarkdown(projects, 'Projects'),
    ];

    if (customSections?.length > 0) {
      customSections.forEach((section) => {
        const lines = [`## ${section.heading}`];
        const items = [];
        if (section.title) items.push(`**${section.title}**`);
        if (section.date) items.push(section.date);
        if (section.link) items.push(`[link](${section.link})`);
        if (section.description) items.push(section.description);
        if (items.length > 0) lines.push(items.join(' | '));
        sections.push(lines.join('\n\n'));
      });
    }

    return sections.filter(Boolean).join('\n\n');
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('resume-pdf');

      if (!element) {
        toast.error('Resume preview is not ready yet. Please try again.');
        return;
      }

      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      const html2pdf = (await import('html2pdf.js/dist/html2pdf.min.js'))
        .default;
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async () => {
    try {
      const markdown = getCombinedContent();
      await saveResumeFn(markdown);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2 flex">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register('contactInfo.email')}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register('contactInfo.mobile')}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register('contactInfo.linkedin')}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    {...register('contactInfo.github')}
                    type="url"
                    placeholder="https://github.com/your-username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Portfolio URL</label>
                  <Input
                    {...register('contactInfo.portfolio')}
                    type="url"
                    placeholder="https://your-portfolio.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Coding Profile URL
                  </label>
                  <Input
                    {...register('contactInfo.codingProfile')}
                    type="url"
                    placeholder="https://leetcode.com/u/your-username"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Programming Languages: JavaScript, TypeScript, Python&#10;Frameworks & Libraries: React, Next.js, Node.js&#10;Developer Tools: Git, Docker, AWS"
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Custom Sections</h3>
              <Controller
                name="customSections"
                control={control}
                render={({ field }) => (
                  <CustomSectionForm
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <ResumePreview formValues={formValues} userName={user?.fullName} />
          </div>
        </TabsContent>
      </Tabs>

      <div
        aria-hidden="true"
        className="fixed left-0 top-0 opacity-0 pointer-events-none -z-10"
      >
        <div
          id="resume-pdf"
          style={{ width: '210mm', background: 'white', padding: '10mm' }}
        >
          <ResumePreview
            formValues={formValues}
            userName={user?.fullName}
            isPdf
          />
        </div>
      </div>
    </div>
  );
}
