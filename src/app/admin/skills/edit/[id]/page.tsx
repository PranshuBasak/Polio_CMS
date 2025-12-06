'use client';

import type React from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import AdminHeader from '@/features/admin/components/admin-header';
import { Button } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { DualRangeSlider } from '../../../../../components/ui/dual-range-slider';
import { DotLoader } from '../../../../../components/ui/dot-loader';
import { useToast } from '../../../../../hooks/use-toast';
import { useSkillsStore } from '../../../../../lib/stores';

export default function EditSkillPage() {
  const params = useParams();
  const router = useRouter();
  const rawSkillsData = useSkillsStore((state) => state.skills);
  const skillsData = useMemo(() => rawSkillsData ?? [], [rawSkillsData]);
  const updateSkill = useSkillsStore((state) => state.updateSkill);
  const skillCategories = useSkillsStore((state) => state.categories) ?? [];
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Sort categories by order
  const sortedCategories = [...skillCategories].sort(
    (a, b) => a.order - b.order
  );

  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: '',
    icon: '',
    year: '',
  });

  useEffect(() => {
    if (params.id) {
      const skill = skillsData.find((s) => s.id === params.id);
      if (skill) {
        // Use requestAnimationFrame to delay state update
        const frame = requestAnimationFrame(() => {
          setFormData({
            name: skill.name,
            level: skill.level,
            category: skill.category,
            icon: skill.icon || '',
            year: skill.year ? skill.year.toString() : '',
          });
          setIsFetching(false);
        });
        return () => cancelAnimationFrame(frame);
      } else {
        router.push('/admin/skills');
      }
    }
  }, [params.id, skillsData, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleLevelChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, level: value[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a skill name.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateSkill(params.id as string, {
        name: formData.name,
        level: formData.level,
        category: formData.category,
        icon: formData.icon || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
      });

      toast({
        title: 'Skill updated',
        description: 'Your skill has been updated successfully.',
      });

      router.push('/admin/skills');
    }, 1000);
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <AdminHeader
          title="Edit Skill"
          description="Update your skill details"
        />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Edit Skill" description="Update your skill details" />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
            <CardDescription>Update the details of your skill.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. TypeScript, Docker, PostgreSQL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {sortedCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon URL (Optional)</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. https://example.com/icon.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Years of Experience (Optional)</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="e.g. 3"
              />
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex justify-between">
                <Label htmlFor="level">Proficiency Level</Label>
              </div>
              <DualRangeSlider
                value={[formData.level]}
                onValueChange={handleLevelChange}
                min={0}
                max={100}
                step={1}
                label
                labelPosition="top"
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/skills')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <DotLoader dotClass="bg-primary-foreground h-1 w-1" />
                    </div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Skill'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
