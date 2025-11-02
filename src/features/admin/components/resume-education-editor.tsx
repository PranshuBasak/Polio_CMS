'use client';

import type React from 'react';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/lib/data-provider';
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

export default function ResumeEducationEditor() {
  const { resumeData, updateResumeEducation } = useData();
  const { toast } = useToast();
  const [education, setEducation] = useState([...resumeData.education]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    courses: [] as string[],
  });
  const [newCourse, setNewCourse] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setFormData((prev) => ({
        ...prev,
        courses: [...prev.courses, newCourse.trim()],
      }));
      setNewCourse('');
    }
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCourses = [...formData.courses];
    updatedCourses.splice(index, 1);
    setFormData((prev) => ({ ...prev, courses: updatedCourses }));
  };

  const handleEdit = (edu: (typeof education)[0]) => {
    setIsEditing(edu.id);
    setFormData({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
      courses: [...edu.courses],
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      courses: [],
    });
  };

  const handleSaveEdit = () => {
    if (!formData.degree || !formData.institution || !formData.startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedEducation = education.map((edu) =>
      edu.id === formData.id ? { ...formData } : edu
    );
    setEducation(updatedEducation);
    updateResumeEducation(updatedEducation);

    toast({
      title: 'Education updated',
      description: 'Your education has been updated successfully.',
    });

    setIsEditing(null);
    setFormData({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      courses: [],
    });
  };

  const handleDelete = (id: string) => {
    const updatedEducation = education.filter((edu) => edu.id !== id);
    setEducation(updatedEducation);
    updateResumeEducation(updatedEducation);

    toast({
      title: 'Education deleted',
      description: 'The education has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      courses: [],
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      courses: [],
    });
  };

  const handleSaveAdd = () => {
    if (!formData.degree || !formData.institution || !formData.startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newEducation = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
    updateResumeEducation(updatedEducation);

    toast({
      title: 'Education added',
      description: 'Your new education has been added successfully.',
    });

    setIsAdding(false);
    setFormData({
      id: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      courses: [],
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedEducation = [...education];
    const temp = updatedEducation[index];
    updatedEducation[index] = updatedEducation[index - 1];
    updatedEducation[index - 1] = temp;
    setEducation(updatedEducation);
    updateResumeEducation(updatedEducation);
  };

  const handleMoveDown = (index: number) => {
    if (index === education.length - 1) return;
    const updatedEducation = [...education];
    const temp = updatedEducation[index];
    updatedEducation[index] = updatedEducation[index + 1];
    updatedEducation[index + 1] = temp;
    setEducation(updatedEducation);
    updateResumeEducation(updatedEducation);
  };

  const handleDragEnd = (result: {
    source: { index: number };
    destination: { index: number } | null;
  }) => {
    if (!result.destination) return;

    const items = Array.from(education);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEducation(items);
    updateResumeEducation(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Manage your educational background</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. Master's in Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. Tech University"
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
                    placeholder="e.g. Boston, MA"
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
                      placeholder="YYYY-MM"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your education"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Relevant Courses</Label>
                <div className="space-y-2">
                  {formData.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={course} readOnly className="flex-1" />
                      <Button
                        variant="destructive"
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveCourse(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      placeholder="Add a course"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCourse();
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleAddCourse}
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
              <Button onClick={handleSaveAdd}>Add Education</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="education">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {education.map((edu, index) => (
                  <Draggable key={edu.id} draggableId={edu.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={edu.id}
                          className={
                            isEditing === edu.id ? 'border-primary' : ''
                          }
                        >
                          {isEditing === edu.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Education</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-degree-${edu.id}`}>
                                      Degree *
                                    </Label>
                                    <Input
                                      id={`edit-degree-${edu.id}`}
                                      name="degree"
                                      value={formData.degree}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`edit-institution-${edu.id}`}
                                    >
                                      Institution *
                                    </Label>
                                    <Input
                                      id={`edit-institution-${edu.id}`}
                                      name="institution"
                                      value={formData.institution}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-location-${edu.id}`}>
                                      Location
                                    </Label>
                                    <Input
                                      id={`edit-location-${edu.id}`}
                                      name="location"
                                      value={formData.location}
                                      onChange={handleChange}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`edit-startDate-${edu.id}`}
                                      >
                                        Start Date *
                                      </Label>
                                      <Input
                                        id={`edit-startDate-${edu.id}`}
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-endDate-${edu.id}`}>
                                        End Date
                                      </Label>
                                      <Input
                                        id={`edit-endDate-${edu.id}`}
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`edit-description-${edu.id}`}>
                                    Description
                                  </Label>
                                  <Textarea
                                    id={`edit-description-${edu.id}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Relevant Courses</Label>
                                  <div className="space-y-2">
                                    {formData.courses.map((course, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <Input
                                          value={course}
                                          readOnly
                                          className="flex-1"
                                        />
                                        <Button
                                          variant="destructive"
                                          size="icon"
                                          type="button"
                                          onClick={() =>
                                            handleRemoveCourse(index)
                                          }
                                        >
                                          &times;
                                        </Button>
                                      </div>
                                    ))}

                                    <div className="flex gap-2">
                                      <Input
                                        value={newCourse}
                                        onChange={(e) =>
                                          setNewCourse(e.target.value)
                                        }
                                        placeholder="Add a course"
                                        className="flex-1"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCourse();
                                          }
                                        }}
                                      />
                                      <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleAddCourse}
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
                                  <span>{edu.degree}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {edu.startDate} - {edu.endDate}
                                  </span>
                                </CardTitle>
                                <CardDescription>
                                  {edu.institution}, {edu.location}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-4">
                                  {edu.description}
                                </p>
                                {edu.courses.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2">
                                      Relevant Courses:
                                    </h4>
                                    <p className="text-sm">
                                      {edu.courses.join(', ')}
                                    </p>
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
                                    disabled={index === education.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(edu)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(edu.id)}
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
            Add New Education
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
