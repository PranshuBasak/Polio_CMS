'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// Sample timeline data
const timelineItems = [
  {
    id: 1,
    title: 'Senior Software Architect',
    company: 'TechInnovate',
    date: '2022 - Present',
    description:
      'Leading the architecture design for distributed systems and microservices. Implementing event-driven architecture and CQRS patterns.',
    skills: ['System Design', 'Microservices', 'Event Sourcing', 'Kubernetes'],
    type: 'work',
  },
  {
    id: 2,
    title: 'Backend Team Lead',
    company: 'DataFlow Systems',
    date: '2019 - 2022',
    description:
      'Led a team of 6 backend developers. Designed and implemented scalable APIs and services using Spring Boot and Node.js.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Team Leadership'],
    type: 'work',
  },
  {
    id: 3,
    title: 'Software Engineer',
    company: 'CloudScale',
    date: '2017 - 2019',
    description:
      'Developed and maintained backend services for high-traffic applications. Implemented CI/CD pipelines and DevOps practices.',
    skills: ['TypeScript', 'Docker', 'CI/CD', 'PostgreSQL'],
    type: 'work',
  },
  {
    id: 4,
    title: "Master's in Computer Science",
    company: 'Tech University',
    date: '2015 - 2017',
    description:
      'Specialized in Distributed Systems and Cloud Computing. Thesis on Scalable Microservice Architectures.',
    skills: ['Distributed Systems', 'Cloud Computing', 'Research'],
    type: 'education',
  },
];

export default function TimelineSection() {
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
                  className={`relative ${
                    index % 2 === 0 ? 'md:mr-4' : 'md:ml-4'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <h4 className="text-primary font-medium mb-3">
                      {item.company}
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
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
