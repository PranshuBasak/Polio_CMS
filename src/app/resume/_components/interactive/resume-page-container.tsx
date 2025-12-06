'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResumeDownload from '@/features/resume/components/resume-download';
import { ErrorBoundary } from '@/shared/components/ui-enhancements/error-boundary';
import { motion } from 'framer-motion';
import { Award, Briefcase, Code, GraduationCap, Languages, Globe } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { useHydration } from '../../../../lib/hooks/use-hydration';
import { useResumeData } from '../../_hooks/use-resume-data';
import { resumeService } from '../../_services/resume-service';
import { CertificationCard } from '../ui/certification-card';
import { EducationCard } from '../ui/education-card';
import { ExperienceCard } from '../ui/experience-card';
import { SkillsGrid } from '../ui/skills-grid';

/**
 * Container component for Resume Page
 * Handles data fetching and layout
 */
export function ResumePageContainer() {
  const { experiences, education, skills, certifications, languages, interests } = useResumeData();
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-balance">
          Resume
        </h1>
        <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
          My professional experience, education, and skills.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-20">
              <div className="w-full">
                <ResumeDownload />
              </div>

              <Card className="w-full">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#experience"
                        className="text-sm text-primary hover:underline"
                      >
                        Experience
                      </a>
                    </li>
                    <li>
                      <a
                        href="#education"
                        className="text-sm text-primary hover:underline"
                      >
                        Education
                      </a>
                    </li>
                    <li>
                      <a
                        href="#skills"
                        className="text-sm text-primary hover:underline"
                      >
                        Skills
                      </a>
                    </li>
                    <li>
                      <a
                        href="#certifications"
                        className="text-sm text-primary hover:underline"
                      >
                        Certifications
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 h-auto">
                <TabsTrigger
                  value="experience"
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
                <TabsTrigger
                  value="certifications"
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Certifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="flex items-center gap-2"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">Languages</span>
                </TabsTrigger>
                <TabsTrigger
                  value="interests"
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Interests</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="experience" id="experience">
                <ErrorBoundary>
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <ExperienceCard
                        key={exp.id}
                        experience={exp}
                        formatDateRange={resumeService.formatDateRange}
                      />
                    ))}
                  </div>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="education" id="education">
                <ErrorBoundary>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <EducationCard
                        key={edu.id}
                        education={edu}
                        formatDateRange={resumeService.formatDateRange}
                      />
                    ))}
                  </div>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="skills" id="skills">
                <ErrorBoundary>
                  <SkillsGrid skillGroups={skills} />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="certifications" id="certifications">
                <ErrorBoundary>
                  <div className="space-y-6">
                    {certifications.map((cert) => (
                      <CertificationCard
                        key={cert.id}
                        certification={cert}
                        formatDate={resumeService.formatCertificationDate}
                      />
                    ))}
                  </div>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="languages" id="languages">
                <ErrorBoundary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                      <Card key={lang.id || lang.name}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-muted-foreground">{lang.proficiency}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="interests" id="interests">
                <ErrorBoundary>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, idx) => (
                          <div key={idx} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {interest}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
