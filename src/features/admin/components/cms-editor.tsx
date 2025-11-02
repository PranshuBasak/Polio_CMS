'use client';

import type React from 'react';

import { Code, Eye, Save, Undo } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface CMSEditorProps {
  title: string;
  description?: string;
  initialData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  fields: {
    name: string;
    label: string;
    type:
      | 'text'
      | 'textarea'
      | 'markdown'
      | 'image'
      | 'toggle'
      | 'number'
      | 'date';
    description?: string;
    placeholder?: string;
    required?: boolean;
  }[];
}

export default function CMSEditor({
  title,
  description,
  initialData,
  onSave,
  fields,
}: CMSEditorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ ...initialData });
  const [originalData] = useState({ ...initialData });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ ...originalData });
    toast({
      title: 'Changes discarded',
      description: 'Your changes have been reset to the original values.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      toast({
        title: 'Changes saved',
        description: 'Your changes have been saved successfully.',
      });
      setIsLoading(false);
    }, 1000);
  };

  const renderField = (field: CMSEditorProps['fields'][0]) => {
    const { name, label, type, description, placeholder, required } = field;

    switch (type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              value={(formData[name] as string | number) || ''}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              required={required}
            />
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={name}
              value={(formData[name] as string) || ''}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              rows={5}
              required={required}
            />
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      case 'markdown':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Tabs
              defaultValue="edit"
              value={activeTab[name] || 'edit'}
              onValueChange={(value) =>
                setActiveTab((prev) => ({ ...prev, [name]: value }))
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  id={name}
                  value={(formData[name] as string) || ''}
                  onChange={(e) => handleChange(name, e.target.value)}
                  placeholder={placeholder}
                  rows={10}
                  required={required}
                  className="font-mono"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[200px] prose dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {(formData[name] as string) || ''}
                  </ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id={name}
                value={(formData[name] as string) || ''}
                onChange={(e) => handleChange(name, e.target.value)}
                placeholder={placeholder || 'Image URL'}
                required={required}
              />
              {!!formData[name] && (
                <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                  <img
                    src={(formData[name] as string) || '/placeholder.svg'}
                    alt={label}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src =
                        '/placeholder.svg?height=64&width=64';
                    }}
                  />
                </div>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={name}>{label}</Label>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Switch
              id={name}
              checked={(formData[name] as boolean) || false}
              onCheckedChange={(checked) => handleChange(name, checked)}
            />
          </div>
        );
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              type="number"
              value={(formData[name] as number) || ''}
              onChange={(e) =>
                handleChange(name, Number.parseFloat(e.target.value) || 0)
              }
              placeholder={placeholder}
              required={required}
            />
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={name}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={name}
              type="date"
              value={
                formData[name]
                  ? new Date(formData[name] as string | number | Date)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) => handleChange(name, e.target.value)}
              required={required}
            />
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-4">
              {renderField(field)}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            <Undo className="mr-2 h-4 w-4" />
            Discard Changes
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              'Saving...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
