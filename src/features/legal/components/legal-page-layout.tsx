import { Badge } from '@/components/ui/badge';
import { BackgroundPaperShaders } from '@/components/ui/background-paper-shaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LegalDocument } from '../content/legal-content-types';
import { LegalContentSection } from './legal-content-section';

type LegalPageLayoutProps = {
  document: LegalDocument;
};

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  return (
    <main className="relative isolate overflow-hidden py-16 md:py-20">
      <BackgroundPaperShaders className="-z-10 opacity-55" speed={0.9} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background/70" />

      <div className="container mx-auto space-y-8 px-4">
        <header className="space-y-4">
          <Badge className="border-primary/25 bg-primary/10 text-primary">
            Legal
          </Badge>
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {document.title}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {document.description}
            </p>
          </div>
        </header>

        <Card className="border-primary/20 bg-background/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Legal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>
              <span className="font-semibold text-foreground">Effective Date: </span>
              {document.effectiveDate}
            </p>
            <p>
              <span className="font-semibold text-foreground">Contact Email: </span>
              {document.contactEmail}
            </p>
            <p>
              <span className="font-semibold text-foreground">Jurisdiction: </span>
              {document.jurisdiction}
            </p>
            <p>
              <span className="font-semibold text-foreground">Governing Law: </span>
              {document.governingLaw}
            </p>
          </CardContent>
        </Card>

        <section className="grid gap-5">
          {document.sections.map((section) => (
            <LegalContentSection key={section.title} section={section} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default LegalPageLayout;

