'use client';

import type React from 'react';

import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import CloudinaryImage from '@/components/ui/cloudinary-image';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';
import { useToast } from '@/hooks/use-toast';
import type { AboutJourneyItem } from '@/lib/stores/about-store';
import { useAboutStore } from '@/lib/stores/about-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type JourneyFormData = {
  id: string;
  title: string;
  company: string;
  date: string;
  description: string;
  icon: string;
  images: string[];
};

const emptyFormData: JourneyFormData = {
  id: '',
  title: '',
  company: '',
  date: '',
  description: '',
  icon: '',
  images: [],
};

export default function AboutJourneyEditor() {
  const aboutData = useAboutStore((state) => state.aboutData) ?? { journey: [] };
  const updateAboutJourney = useAboutStore((state) => state.updateAboutJourney);
  const { toast } = useToast();
  const [journeys, setJourneys] = useState<AboutJourneyItem[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<JourneyFormData>(emptyFormData);

  useEffect(() => {
    setJourneys([...(aboutData.journey || [])]);
  }, [aboutData.journey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconUpload = (value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      icon: Array.isArray(value) ? value[0] || '' : value,
    }));
  };

  const handleImagesUpload = (value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.isArray(value) ? value : value ? [value] : [],
    }));
  };

  const isValidForm = () => {
    return Boolean(formData.title && formData.company && formData.date && formData.description);
  };

  const handleEdit = (journey: AboutJourneyItem) => {
    setIsEditing(journey.id);
    setFormData({
      id: journey.id,
      title: journey.title,
      company: journey.company,
      date: journey.date,
      description: journey.description,
      icon: journey.icon || '',
      images: journey.images || [],
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData(emptyFormData);
  };

  const handleSaveEdit = () => {
    if (!isValidForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedJourneys = journeys.map((journey) =>
      journey.id === formData.id
        ? {
            ...journey,
            ...formData,
            icon: formData.icon || null,
            images: formData.images || [],
          }
        : journey
    );

    setJourneys(updatedJourneys);
    void updateAboutJourney(updatedJourneys);
    toast({
      title: 'Journey updated',
      description: 'Your professional journey has been updated successfully.',
    });
    setIsEditing(null);
    setFormData(emptyFormData);
  };

  const handleDelete = (id: string) => {
    const updatedJourneys = journeys.filter((journey) => journey.id !== id);
    setJourneys(updatedJourneys);
    void updateAboutJourney(updatedJourneys);
    toast({
      title: 'Journey deleted',
      description: 'The journey item has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData(emptyFormData);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData(emptyFormData);
  };

  const handleSaveAdd = () => {
    if (!isValidForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newJourney: AboutJourneyItem = {
      id: Date.now().toString(),
      title: formData.title,
      company: formData.company,
      date: formData.date,
      description: formData.description,
      icon: formData.icon || null,
      images: formData.images || [],
    };

    const updatedJourneys = [...journeys, newJourney];
    setJourneys(updatedJourneys);
    void updateAboutJourney(updatedJourneys);
    toast({
      title: 'Journey added',
      description: 'Your new professional journey has been added successfully.',
    });
    setIsAdding(false);
    setFormData(emptyFormData);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedJourneys = [...journeys];
    const temp = updatedJourneys[index];
    updatedJourneys[index] = updatedJourneys[index - 1];
    updatedJourneys[index - 1] = temp;
    setJourneys(updatedJourneys);
    void updateAboutJourney(updatedJourneys);
  };

  const handleMoveDown = (index: number) => {
    if (index === journeys.length - 1) return;
    const updatedJourneys = [...journeys];
    const temp = updatedJourneys[index];
    updatedJourneys[index] = updatedJourneys[index + 1];
    updatedJourneys[index + 1] = temp;
    setJourneys(updatedJourneys);
    void updateAboutJourney(updatedJourneys);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(journeys);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setJourneys(items);
    void updateAboutJourney(items);
  };

  const renderJourneyForm = () => (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Position/Title *</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Software Architect" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company/Organization *</Label>
        <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. TechInnovate" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Time Period *</Label>
        <Input id="date" name="date" value={formData.date} onChange={handleChange} placeholder="e.g. 2022 - Present" required />
      </div>

      <div className="space-y-2">
        <Label>Company Icon (Optional)</Label>
        <CloudinaryUpload value={formData.icon} onChange={handleIconUpload} />
      </div>

      <div className="space-y-2">
        <Label>Memory Images (Optional)</Label>
        <CloudinaryUpload value={formData.images} onChange={handleImagesUpload} multiple />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your role and achievements" rows={4} required />
      </div>
    </CardContent>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Journey</CardTitle>
        <CardDescription>Manage your professional experience timeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Journey</CardTitle>
            </CardHeader>
            {renderJourneyForm()}
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
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {journeys.map((journey, index) => (
                  <Draggable key={journey.id} draggableId={journey.id} index={index}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps}>
                        <Card className={isEditing === journey.id ? 'border-primary' : ''}>
                          {isEditing === journey.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Journey</CardTitle>
                              </CardHeader>
                              {renderJourneyForm()}
                              <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEdit}>Save Changes</Button>
                              </CardFooter>
                            </>
                          ) : (
                            <>
                              <CardHeader>
                                <CardTitle className="flex justify-between items-center gap-3">
                                  <span>{journey.title}</span>
                                  <span className="text-sm text-muted-foreground">{journey.date}</span>
                                </CardTitle>
                                <CardDescription>{journey.company}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-4 flex items-center gap-3">
                                  {journey.icon ? (
                                    <CloudinaryImage
                                      src={journey.icon}
                                      alt={`${journey.company} icon`}
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 rounded-md border border-border object-cover"
                                    />
                                  ) : null}
                                  <p className="text-sm">{journey.description}</p>
                                </div>
                                {journey.images && journey.images.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {journey.images.slice(0, 5).map((imageUrl, imageIndex) => (
                                      <CloudinaryImage
                                        key={`${journey.id}-${imageIndex}`}
                                        src={imageUrl}
                                        alt={`${journey.company} memory ${imageIndex + 1}`}
                                        width={56}
                                        height={56}
                                        className="h-14 w-14 rounded-md border border-border object-cover"
                                      />
                                    ))}
                                    {journey.images.length > 5 ? (
                                      <div className="flex h-14 w-14 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
                                        +{journey.images.length - 5}
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="icon" onClick={() => handleMoveUp(index)} disabled={index === 0}>
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
                                  <Button variant="outline" size="sm" onClick={() => handleEdit(journey)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => handleDelete(journey.id)}>
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

        {!isAdding ? (
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Journey
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

