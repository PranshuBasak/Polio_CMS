'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useResumeStore } from '@/lib/stores';
import { Eye, FileDown, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ResumeDownload() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const resumeData = useResumeStore((state) => state.resumeData);

  // Use the PDF URL from resumeData or fallback to a placeholder
  const resumeUrl = resumeData?.pdfUrl || '/placeholder.pdf';

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Resume</CardTitle>
        <CardDescription>Download my professional resume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
          <FileText className="h-12 w-12 text-primary/60" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
              <DialogDescription>
                Tanzim&apos;s Professional Resume
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden rounded-md">
              <iframe
                src={resumeUrl}
                className="w-full h-full"
                title="Resume Preview"
              />
            </div>
          </DialogContent>
        </Dialog>

        <Button asChild className="flex items-center gap-2">
          <a href={resumeUrl} download="Tanzim_Resume.pdf">
            <FileDown className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
