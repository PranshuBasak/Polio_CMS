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

  // Helper to force download for Cloudinary URLs
  const getDownloadUrl = (url: string) => {
    if (url && url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

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
      <CardFooter className="flex flex-col gap-2 pt-2">
        <div className="flex justify-between w-full gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent flex-1"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
              <DialogDescription>
                Pranshu&apos;s Professional Resume
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

          <Button asChild className="flex items-center gap-2 flex-1">
            <a href={getDownloadUrl(resumeUrl)} download="Pranshu_Resume.pdf">
              <FileDown className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>

        {/* Print Version Button */}
        <Button asChild variant="secondary" className="flex items-center gap-2 w-full">
          <a href="/resume/print" target="_blank" rel="noopener noreferrer">
            <FileText className="h-4 w-4" />
            Print Version
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
