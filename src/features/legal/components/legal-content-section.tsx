import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LegalContentSection } from '../content/legal-content-types';

type LegalContentSectionProps = {
  section: LegalContentSection;
};

export function LegalContentSection({ section }: LegalContentSectionProps) {
  return (
    <Card className="border-border/70 bg-card/75 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-foreground">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export default LegalContentSection;

