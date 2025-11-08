import { Card, CardContent } from '@/components/ui/card';
import { Code2, Cpu, Database, GitBranch, Server } from 'lucide-react';

/**
 * About Bio - Presentational Component
 *
 * Displays biography text and technology stack
 */
interface AboutBioProps {
  bio: string;
  focus: string;
}

export function AboutBio({ bio, focus }: AboutBioProps) {
  const stackIcons = [
    { name: 'TypeScript', icon: Code2 },
    { name: 'Java', icon: Cpu },
    { name: 'Spring Boot', icon: Server },
    { name: 'Node.js', icon: Server },
    { name: 'DevOps', icon: GitBranch },
    { name: 'Databases', icon: Database },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <p className="text-lg mb-6">{bio}</p>
        <p className="text-lg mb-6">{focus}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stackIcons.map((item) => (
          <Card
            key={item.name}
            className="border border-border hover:border-primary/50 transition-all duration-300 card-hover"
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <item.icon className="h-10 w-10 mb-3 text-primary" />
              <span className="text-sm font-medium">{item.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
