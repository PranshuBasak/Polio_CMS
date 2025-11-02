'use client';

import type React from 'react';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/lib/stores';
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
import { Textarea } from '@/components/ui/textarea';

export default function ResumeExperienceEditor() {
  const resumeData = useResumeStore((state) => state.resumeData) ?? {
    experiences: [],
  };
  const updateResumeData = useResumeStore((state) => state.updateResumeData);
  const { toast } = useToast();
  const [experiences, setExperiences] = useState([
    ...(resumeData.experiences || []),
  ]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    achievements: [] as string[],
  });
  const [newAchievement, setNewAchievement] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements.splice(index, 1);
    setFormData((prev) => ({ ...prev, achievements: updatedAchievements }));
  };

  const handleEdit = (experience: (typeof experiences)[0]) => {
    setIsEditing(experience.id);
    setFormData({
      id: experience.id,
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      description: experience.description,
      achievements: [...experience.achievements],
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
  };

  const handleSaveEdit = () => {
    if (!formData.title || !formData.company || !formData.startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedExperiences = experiences.map((exp) =>
      exp.id === formData.id ? { ...formData } : exp
    );
    setExperiences(updatedExperiences);
    updateResumeData({ experiences: updatedExperiences });

    toast({
      title: 'Experience updated',
      description: 'Your experience has been updated successfully.',
    });

    setIsEditing(null);
    setFormData({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
  };

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    updateResumeData({ experiences: updatedExperiences });

    toast({
      title: 'Experience deleted',
      description: 'The experience has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.company || !formData.startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newExperience = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    updateResumeData({ experiences: updatedExperiences });

    toast({
      title: 'Experience added',
      description: 'Your new experience has been added successfully.',
    });

    setIsAdding(false);
    setFormData({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedExperiences = [...experiences];
    const temp = updatedExperiences[index];
    updatedExperiences[index] = updatedExperiences[index - 1];
    updatedExperiences[index - 1] = temp;
    setExperiences(updatedExperiences);
    updateResumeData({ experiences: updatedExperiences });
  };

  const handleMoveDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const updatedExperiences = [...experiences];
    const temp = updatedExperiences[index];
    updatedExperiences[index] = updatedExperiences[index + 1];
    updatedExperiences[index + 1] = temp;
    setExperiences(updatedExperiences);
    updateResumeData({ experiences: updatedExperiences });
  };

  const handleDragEnd = (result: {
    source: { index: number; droppableId: string };
    destination: { index: number; droppableId: string } | null;
  }) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExperiences(items);
    updateResumeData({ experiences: items });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>Manage your work experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Architect"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. TechInnovate"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      placeholder="YYYY-MM"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      placeholder="YYYY-MM or Present"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your role and responsibilities"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Key Achievements</Label>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={achievement} readOnly className="flex-1" />
                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAchievement();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleAddAchievement}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelAdd}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdd}>Add Experience</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="experiences">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {experiences.map((experience, index) => (
                  <Draggable
                    key={experience.id}
                    draggableId={experience.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={experience.id}
                          className={
                            isEditing === experience.id ? 'border-primary' : ''
                          }
                        >
                          {isEditing === experience.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Experience</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`edit-title-${experience.id}`}
                                    >
                                      Job Title *
                                    </Label>
                                    <Input
                                      id={`edit-title-${experience.id}`}
                                      name="title"
                                      value={formData.title}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`edit-company-${experience.id}`}
                                    >
                                      Company *
                                    </Label>
                                    <Input
                                      id={`edit-company-${experience.id}`}
                                      name="company"
                                      value={formData.company}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`edit-location-${experience.id}`}
                                    >
                                      Location
                                    </Label>
                                    <Input
                                      id={`edit-location-${experience.id}`}
                                      name="location"
                                      value={formData.location}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`edit-startDate-${experience.id}`}
                                      >
                                        Start Date *
                                      </Label>
                                      <Input
                                        id={`edit-startDate-${experience.id}`}
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`edit-endDate-${experience.id}`}
                                      >
                                        End Date
                                      </Label>
                                      <Input
                                        id={`edit-endDate-${experience.id}`}
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`edit-description-${experience.id}`}
                                  >
                                    Description *
                                  </Label>
                                  <Textarea
                                    id={`edit-description-${experience.id}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Key Achievements</Label>
                                  <div className="space-y-2">
                                    {formData.achievements.map(
                                      (achievement, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2"
                                        >
                                          <Input
                                            value={achievement}
                                            readOnly
                                            className="flex-1"
                                          />
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            type="button"
                                            onClick={() =>
                                              handleRemoveAchievement(index)
                                            }
                                          >
                                            &times;
                                          </Button>
                                        </div>
                                      )
                                    )}

                                    <div className="flex gap-2">
                                      <Input
                                        value={newAchievement}
                                        onChange={(e) =>
                                          setNewAchievement(e.target.value)
                                        }
                                        placeholder="Add an achievement"
                                        className="flex-1"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddAchievement();
                                          }
                                        }}
                                      />
                                      <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleAddAchievement}
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                  Save Changes
                                </Button>
                              </CardFooter>
                            </>
                          ) : (
                            <>
                              <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                  <span>{experience.title}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {experience.startDate} -{' '}
                                    {experience.endDate}
                                  </span>
                                </CardTitle>
                                <CardDescription>
                                  {experience.company}, {experience.location}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-4">
                                  {experience.description}
                                </p>
                                {experience.achievements.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2">
                                      Key Achievements:
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {experience.achievements.map(
                                        (achievement, i) => (
                                          <li key={i} className="text-sm">
                                            {achievement}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === experiences.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(experience)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(experience.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </CardFooter>
                            </>
                          )}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!isAdding && (
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Experience
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
