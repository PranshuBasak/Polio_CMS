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
import { useState, useEffect } from 'react';

import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

export default function ResumeGeneralEditor() {
  const resumeData = useResumeStore((state) => state.resumeData) ?? {
    pdfUrl: '',
    languages: [],
    interests: [],
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    availableForWork: false,
    yearsExperience: 0,
  };
  const updateResumeData = useResumeStore((state) => state.updateResumeData);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pdfUrl: resumeData.pdfUrl || '',
    languages: [...(resumeData.languages || [])],
    interests: [...(resumeData.interests || [])],
    name: resumeData.name || '',
    email: resumeData.email || '',
    phone: resumeData.phone || '',
    location: resumeData.location || '',
    bio: resumeData.bio || '',
    availableForWork: resumeData.availableForWork || false,
    yearsExperience: resumeData.yearsExperience || 0,
  });
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: '' });
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (resumeData) {
      setFormData({
        pdfUrl: resumeData.pdfUrl || '',
        languages: [...(resumeData.languages || [])],
        interests: [...(resumeData.interests || [])],
        name: resumeData.name || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        location: resumeData.location || '',
        bio: resumeData.bio || '',
        availableForWork: resumeData.availableForWork || false,
        yearsExperience: resumeData.yearsExperience || 0,
      });
    }
  }, [resumeData]);

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

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await updateResumeData(formData);

      toast({
        title: 'Resume updated',
        description:
          'Your resume general information has been updated successfully.',
      });
    } catch (error) {
      console.error("Error updating resume:", error);
      toast({
        title: 'Error',
        description: 'Failed to update resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 234 567 890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                name="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={handleChange}
                placeholder="e.g. 5"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="availableForWork"
                checked={formData.availableForWork}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, availableForWork: checked }))
                }
              />
              <Label htmlFor="availableForWork">Available for Work</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Brief bio..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pdfUrl">Resume PDF</Label>
          <div className="flex flex-col gap-2">
             <CloudinaryUpload
                value={formData.pdfUrl}
                onChange={(value) => setFormData((prev) => ({ ...prev, pdfUrl: value as string }))}
                resourceType="auto"
              />
          </div>
          <p className="text-xs text-muted-foreground">
            Upload your resume PDF.
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
