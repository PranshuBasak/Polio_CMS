'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useResumeStore } from '@/lib/stores';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { useMemo } from 'react';

export default function TimelineSection() {
  const resumeData = useResumeStore((state) => state.resumeData);

  // Combine experiences and education, sorted by date
  const timelineItems = useMemo(() => {
    const experiences = resumeData.experiences.map((exp) => ({
      id: `exp-${exp.id}`, // Prefix to avoid conflicts
      title: exp.title,
      company: exp.company,
      date: `${exp.startDate} - ${exp.endDate || 'Present'}`,
      description: exp.description,
      skills: exp.achievements || [],
      type: 'work' as const,
    }));

    const education = resumeData.education.map((edu) => ({
      id: `edu-${edu.id}`, // Prefix to avoid conflicts
      title: edu.degree,
      company: edu.institution,
      date: `${edu.startDate} - ${edu.endDate}`,
      description: edu.description,
      skills: edu.courses || [],
      type: 'education' as const,
    }));

    return [...experiences, ...education].sort((a, b) => {
      // Sort by start date (most recent first)
      const dateA = a.date.split(' - ')[0];
      const dateB = b.date.split(' - ')[0];
      return dateB.localeCompare(dateA);
    });
  }, [resumeData.experiences, resumeData.education]);

  return (
    <section className="section-container">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading text-center">
            Experience & Education
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            My professional journey and educational background.
          </p>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:transform md:-translate-x-1/2" />

            {timelineItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative mb-12 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8 md:ml-auto' : 'md:pl-8'
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-6 ${
                    index % 2 === 0 ? 'left-0 md:-left-3' : 'left-0 md:-left-3'
                  } w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10`}
                >
                  {item.type === 'work' ? (
                    <Briefcase className="h-3 w-3 text-primary-foreground" />
                  ) : (
                    <GraduationCap className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>

                <Card
                  className={`relative overflow-hidden ${
                    index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-2 flex-wrap gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1 break-words overflow-hidden">
                      {item.title}
                    </h3>
                    <h4 className="text-primary font-medium mb-3 break-words overflow-hidden">
                      {item.company}
                    </h4>
                    <p className="text-muted-foreground mb-4 break-words whitespace-pre-line overflow-hidden">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, skillIndex) => (
                        <Badge
                          key={`${item.id}-skill-${skillIndex}`}
                          variant="secondary"
                          className="text-xs px-2 py-1 inline-block break-words whitespace-normal leading-tight max-w-full"
                        >
                          <span className="inline-block break-words">{skill}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
