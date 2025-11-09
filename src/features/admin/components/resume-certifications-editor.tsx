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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/lib/stores';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ResumeCertificationsEditor() {
  const { resumeData, updateCertifications } = useResumeStore();
  const { toast } = useToast();
  const [certifications, setCertifications] = useState([
    ...resumeData.certifications,
  ]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    issuer: '',
    date: '',
    description: '',
    url: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (cert: (typeof certifications)[0]) => {
    setIsEditing(cert.id);
    setFormData({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      description: cert.description,
      url: cert.url || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
    });
  };

  const handleSaveEdit = () => {
    if (!formData.name || !formData.issuer || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedCertifications = certifications.map((cert) =>
      cert.id === formData.id ? { ...formData } : cert
    );
    setCertifications(updatedCertifications);
    updateCertifications(updatedCertifications);

    toast({
      title: 'Certification updated',
      description: 'Your certification has been updated successfully.',
    });

    setIsEditing(null);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
    });
  };

  const handleDelete = (id: string) => {
    const updatedCertifications = certifications.filter(
      (cert) => cert.id !== id
    );
    setCertifications(updatedCertifications);
    updateCertifications(updatedCertifications);

    toast({
      title: 'Certification deleted',
      description: 'The certification has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
    });
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.issuer || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newCertification = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    updateCertifications(updatedCertifications);

    toast({
      title: 'Certification added',
      description: 'Your new certification has been added successfully.',
    });

    setIsAdding(false);
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedCertifications = [...certifications];
    const temp = updatedCertifications[index];
    updatedCertifications[index] = updatedCertifications[index - 1];
    updatedCertifications[index - 1] = temp;
    setCertifications(updatedCertifications);
    updateCertifications(updatedCertifications);
  };

  const handleMoveDown = (index: number) => {
    if (index === certifications.length - 1) return;
    const updatedCertifications = [...certifications];
    const temp = updatedCertifications[index];
    updatedCertifications[index] = updatedCertifications[index + 1];
    updatedCertifications[index + 1] = temp;
    setCertifications(updatedCertifications);
    updateCertifications(updatedCertifications);
  };

  const handleDragEnd = (result: {
    source: { index: number };
    destination: { index: number } | null;
  }) => {
    if (!result.destination) return;

    const items = Array.from(certifications);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCertifications(items);
    updateCertifications(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
        <CardDescription>
          Manage your professional certifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Certification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization *</Label>
                  <Input
                    id="issuer"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleChange}
                    placeholder="e.g. Amazon Web Services"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date Issued *</Label>
                  <Input
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="YYYY-MM"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Certificate URL</Label>
                  <Input
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the certification"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelAdd}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdd}>Add Certification</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="certifications">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {certifications.map((cert, index) => (
                  <Draggable key={cert.id} draggableId={cert.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={cert.id}
                          className={
                            isEditing === cert.id ? 'border-primary' : ''
                          }
                        >
                          {isEditing === cert.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Certification</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-name-${cert.id}`}>
                                      Certification Name *
                                    </Label>
                                    <Input
                                      id={`edit-name-${cert.id}`}
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-issuer-${cert.id}`}>
                                      Issuing Organization *
                                    </Label>
                                    <Input
                                      id={`edit-issuer-${cert.id}`}
                                      name="issuer"
                                      value={formData.issuer}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-date-${cert.id}`}>
                                      Date Issued *
                                    </Label>
                                    <Input
                                      id={`edit-date-${cert.id}`}
                                      name="date"
                                      value={formData.date}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-url-${cert.id}`}>
                                      Certificate URL
                                    </Label>
                                    <Input
                                      id={`edit-url-${cert.id}`}
                                      name="url"
                                      value={formData.url}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`edit-description-${cert.id}`}
                                  >
                                    Description *
                                  </Label>
                                  <Textarea
                                    id={`edit-description-${cert.id}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
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
                                  <span>{cert.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {cert.date}
                                  </span>
                                </CardTitle>
                                <CardDescription>{cert.issuer}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm mb-2">
                                  {cert.description}
                                </p>
                                {cert.url && (
                                  <a
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    View Certificate
                                  </a>
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
                                    disabled={
                                      index === certifications.length - 1
                                    }
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(cert)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(cert.id)}
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
            Add New Certification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
