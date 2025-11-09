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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAboutStore } from '@/lib/stores';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Available icons for values
const availableIcons = [
  { value: 'Heart', label: 'Heart' },
  { value: 'Target', label: 'Target' },
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Star', label: 'Star' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Award', label: 'Award' },
  { value: 'Compass', label: 'Compass' },
  { value: 'Shield', label: 'Shield' },
];

export default function AboutValuesEditor() {
  const { aboutData, updateAboutValues } = useAboutStore();
  const { toast } = useToast();
  const [values, setValues] = useState([...aboutData.values]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    icon: 'Heart',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (value: string) => {
    setFormData((prev) => ({ ...prev, icon: value }));
  };

  const handleEdit = (value: (typeof values)[0]) => {
    setIsEditing(value.id);
    setFormData({
      id: value.id,
      title: value.title,
      description: value.description,
      icon: value.icon,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setFormData({ id: '', title: '', description: '', icon: 'Heart' });
  };

  const handleSaveEdit = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const updatedValues = values.map((value) =>
      value.id === formData.id ? { ...formData } : value
    );
    setValues(updatedValues);
    updateAboutValues(updatedValues);

    toast({
      title: 'Value updated',
      description: 'Your core value has been updated successfully.',
    });

    setIsEditing(null);
    setFormData({ id: '', title: '', description: '', icon: 'Heart' });
  };

  const handleDelete = (id: string) => {
    const updatedValues = values.filter((value) => value.id !== id);
    setValues(updatedValues);
    updateAboutValues(updatedValues);

    toast({
      title: 'Value deleted',
      description: 'The core value has been deleted successfully.',
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      id: '',
      title: '',
      description: '',
      icon: 'Heart',
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setFormData({ id: '', title: '', description: '', icon: 'Heart' });
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newValue = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedValues = [...values, newValue];
    setValues(updatedValues);
    updateAboutValues(updatedValues);

    toast({
      title: 'Value added',
      description: 'Your new core value has been added successfully.',
    });

    setIsAdding(false);
    setFormData({ id: '', title: '', description: '', icon: 'Heart' });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedValues = [...values];
    const temp = updatedValues[index];
    updatedValues[index] = updatedValues[index - 1];
    updatedValues[index - 1] = temp;
    setValues(updatedValues);
    updateAboutValues(updatedValues);
  };

  const handleMoveDown = (index: number) => {
    if (index === values.length - 1) return;
    const updatedValues = [...values];
    const temp = updatedValues[index];
    updatedValues[index] = updatedValues[index + 1];
    updatedValues[index + 1] = temp;
    setValues(updatedValues);
    updateAboutValues(updatedValues);
  };

  const handleDragEnd = (result: {
    source: { index: number };
    destination: { index: number } | null;
  }) => {
    if (!result.destination) return;

    const items = Array.from(values);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setValues(items);
    updateAboutValues(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Values</CardTitle>
        <CardDescription>
          Manage your core values and principles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle>Add New Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Value Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Excellence"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this core value"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon} onValueChange={handleIconChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelAdd}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdd}>Add Value</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="values">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {values.map((value, index) => (
                  <Draggable
                    key={value.id}
                    draggableId={value.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={value.id}
                          className={
                            isEditing === value.id ? 'border-primary' : ''
                          }
                        >
                          {isEditing === value.id ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Value</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-title-${value.id}`}>
                                    Value Title *
                                  </Label>
                                  <Input
                                    id={`edit-title-${value.id}`}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`edit-description-${value.id}`}
                                  >
                                    Description *
                                  </Label>
                                  <Textarea
                                    id={`edit-description-${value.id}`}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`edit-icon-${value.id}`}>
                                    Icon
                                  </Label>
                                  <Select
                                    value={formData.icon}
                                    onValueChange={handleIconChange}
                                  >
                                    <SelectTrigger id={`edit-icon-${value.id}`}>
                                      <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableIcons.map((icon) => (
                                        <SelectItem
                                          key={icon.value}
                                          value={icon.value}
                                        >
                                          {icon.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
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
                                <CardTitle className="flex items-center gap-2">
                                  <span>{value.title}</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary">
                                      {value.icon}
                                    </span>
                                  </div>
                                  <p className="text-sm">{value.description}</p>
                                </div>
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
                                    disabled={index === values.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(value)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(value.id)}
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
            Add New Value
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
