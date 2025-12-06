'use client';

import type React from 'react';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAboutStore } from '@/lib/stores';
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

export default function AboutJourneyEditor() {
  const aboutData = useAboutStore((state) => state.aboutData) ?? {
    journey: [],
  };
  const updateAboutJourney = useAboutStore((state) => state.updateAboutJourney);
  const { toast } = useToast();
  const [journeys, setJourneys] = useState([...(aboutData.journey || [])]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    date: '',
    description: '',
    icon: '',
  });

  // Sync local state with data fetched from Supabase
  useEffect(() => {
    setJourneys([...(aboutData.journey || [])]);
  }, [aboutData.journey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (journey: (typeof journeys)[0]) => {
    setIsEditing(journey.id);
    setFormData({
      id: journey.id,
      title: journey.title,
      company: journey.company,
      date: journey.date,
      description: journey.description,
      icon: journey.icon || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({ id: '', title: '', company: '', date: '', description: '', icon: '' });
  };

  const handleSaveEdit = () => {
    if (!formData.title || !formData.company || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedJourneys = journeys.map((journey) =>
      journey.id === formData.id ? { ...formData } : journey
    );
    setJourneys(updatedJourneys);
    updateAboutJourney(updatedJourneys);

    toast({
      title: 'Journey updated',
      description: 'Your professional journey has been updated successfully.',
    });

    setIsEditing(null);
    setFormData({ id: '', title: '', company: '', date: '', description: '', icon: '' });
  };

  const handleDelete = (id: string) => {
    const updatedJourneys = journeys.filter((journey) => journey.id !== id);
    setJourneys(updatedJourneys);
    updateAboutJourney(updatedJourneys);

    toast({
      title: 'Journey deleted',
      description: 'The journey item has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      id: '',
      title: '',
      company: '',
      date: '',
      description: '',
      icon: '',
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({ id: '', title: '', company: '', date: '', description: '', icon: '' });
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.company || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newJourney = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedJourneys = [...journeys, newJourney];
    setJourneys(updatedJourneys);
    updateAboutJourney(updatedJourneys);

    toast({
      title: 'Journey added',
      description: 'Your new professional journey has been added successfully.',
    });

    setIsAdding(false);
    setFormData({ id: '', title: '', company: '', date: '', description: '', icon: '' });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedJourneys = [...journeys];
    const temp = updatedJourneys[index];
    updatedJourneys[index] = updatedJourneys[index - 1];
    updatedJourneys[index - 1] = temp;
    setJourneys(updatedJourneys);
    updateAboutJourney(updatedJourneys);
  };

  const handleMoveDown = (index: number) => {
    if (index === journeys.length - 1) return;
    const updatedJourneys = [...journeys];
    const temp = updatedJourneys[index];
    updatedJourneys[index] = updatedJourneys[index + 1];
    updatedJourneys[index + 1] = temp;
    setJourneys(updatedJourneys);
    updateAboutJourney(updatedJourneys);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(journeys);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setJourneys(items);
    updateAboutJourney(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Journey</CardTitle>
        <CardDescription>
          Manage your professional experience timeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Position/Title *</Label>
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
                <Label htmlFor="company">Company/Organization *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. TechInnovate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Time Period *</Label>
                <Input
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. 2022 - Present"
                  required
                />
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your role and achievements"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelAdd}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdd}>Add Journey</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="journeys">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {journeys.map((journey, index) => (
                  <Draggable
                    key={journey.id}
                    draggableId={journey.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={journey.id}
                          className={
                            isEditing === journey.id ? 'border-primary' : ''
                          }
                        >
                          {isEditing === journey.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Journey</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-title-${journey.id}`}>
                                    Position/Title *
                                  </Label>
                                  <Input
                                    id={`edit-title-${journey.id}`}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`edit-company-${journey.id}`}>
                                    Company/Organization *
                                  </Label>
                                  <Input
                                    id={`edit-company-${journey.id}`}
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`edit-date-${journey.id}`}>
                                    Time Period *
                                  </Label>
                                  <Input
                                    id={`edit-date-${journey.id}`}
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`edit-icon-${journey.id}`}>
                                    Icon URL (Optional)
                                  </Label>
                                  <Input
                                    id={`edit-icon-${journey.id}`}
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="e.g. https://example.com/icon.png"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`edit-description-${journey.id}`}
                                  >
                                    Description *
                                  </Label>
                                  <Textarea
                                    id={`edit-description-${journey.id}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                  />
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
                                  <span>{journey.title}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {journey.date}
                                  </span>
                                </CardTitle>
                                <CardDescription>
                                  {journey.company}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">{journey.description}</p>
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
                                    disabled={index === journeys.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(journey)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(journey.id)}
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
            Add New Journey
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
