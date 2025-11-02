'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/lib/stores';
import { FileUp } from 'lucide-react';
import { useState } from 'react';

export default function ResumeGeneralEditor() {
  const resumeData = useResumeStore((state) => state.resumeData) ?? {
    pdfUrl: '',
    languages: [],
    interests: [],
  };
  const updateResumeData = useResumeStore((state) => state.updateResumeData);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pdfUrl: resumeData.pdfUrl || '',
    languages: [...(resumeData.languages || [])],
    interests: [...(resumeData.interests || [])],
  });
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: '' });
  const [newInterest, setNewInterest] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const handleAddLanguage = () => {
    if (newLanguage.name && newLanguage.proficiency) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }],
      }));
      setNewLanguage({ name: '', proficiency: '' });
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages.splice(index, 1);
    setFormData((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const handleAddInterest = () => {
    if (newInterest) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...formData.interests];
    updatedInterests.splice(index, 1);
    setFormData((prev) => ({ ...prev, interests: updatedInterests }));
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateResumeData(formData);

      toast({
        title: 'Resume updated',
        description:
          'Your resume general information has been updated successfully.',
      });

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Resume Information</CardTitle>
        <CardDescription>
          Update your resume PDF and general information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pdfUrl">Resume PDF URL</Label>
          <div className="flex gap-2">
            <Input
              id="pdfUrl"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleChange}
              placeholder="URL to your resume PDF"
              className="flex-1"
            />
            <Button variant="outline" type="button">
              <FileUp className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a URL to your resume PDF or upload a new one
          </p>
        </div>

        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="space-y-4">
            {formData.languages.map((language, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={language.name}
                  onChange={(e) =>
                    handleLanguageChange(index, 'name', e.target.value)
                  }
                  placeholder="Language name"
                  className="flex-1"
                />
                <Input
                  value={language.proficiency}
                  onChange={(e) =>
                    handleLanguageChange(index, 'proficiency', e.target.value)
                  }
                  placeholder="Proficiency level"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => handleRemoveLanguage(index)}
                >
                  &times;
                </Button>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <Input
                value={newLanguage.name}
                onChange={(e) =>
                  setNewLanguage({ ...newLanguage, name: e.target.value })
                }
                placeholder="Add language"
                className="flex-1"
              />
              <Input
                value={newLanguage.proficiency}
                onChange={(e) =>
                  setNewLanguage({
                    ...newLanguage,
                    proficiency: e.target.value,
                  })
                }
                placeholder="Proficiency level"
                className="flex-1"
              />
              <Button
                variant="outline"
                type="button"
                onClick={handleAddLanguage}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.interests.map((interest, index) => (
              <div
                key={index}
                className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(index)}
                  className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add interest"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
            />
            <Button variant="outline" type="button" onClick={handleAddInterest}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading} className="ml-auto">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
