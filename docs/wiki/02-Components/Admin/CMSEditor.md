# CMSEditor Component

**Path**: `src/features/admin/components/cms-editor.tsx`

## Purpose
The `CMSEditor` is a **generic, configuration-driven form builder** designed to standardize data entry across the Admin CMS. Instead of building separate forms for Projects, Blogs, and Skills, this component accepts a configuration array (`fields`) and renders the appropriate inputs with validation.

## Architecture Connection
-   **Reusability**: Used by `ProjectEditor`, `BlogEditor`, `SkillEditor`.
-   **UI Library**: Wraps Shadcn `Input`, `Textarea`, `Switch`, `Tabs`.
-   **Validation**: Implements basic required field validation (can be extended with Zod).

## Code Analysis

### 1. Interface Definition
```tsx
interface CMSEditorProps {
  title: string;
  initialData: Record<string, unknown>; // The data object to edit
  onSave: (data: Record<string, unknown>) => void; // Save callback
  fields: {
    name: string; // Key in the data object
    label: string; // UI Label
    type: 'text' | 'markdown' | 'image' | ...; // Input type
    required?: boolean;
  }[];
}
```
-   **`initialData`**: Populates the form for "Edit" mode. Pass `{}` for "Create" mode.
-   **`fields`**: The schema definition for the form.

### 2. State Management
```tsx
export default function CMSEditor({ initialData, ... }) {
  const [formData, setFormData] = useState({ ...initialData });
  
  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
```
-   **Local State**: Manages form data internally until `onSave` is triggered.

### 3. Field Rendering Factory
```tsx
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return <Input ... />;
      case 'markdown':
        return (
          <Tabs defaultValue="edit">
            <TabsContent value="edit"><Textarea ... /></TabsContent>
            <TabsContent value="preview"><ReactMarkdown>...</ReactMarkdown></TabsContent>
          </Tabs>
        );
      case 'image':
        return (
          <div className="flex gap-4">
             <Input placeholder="Image URL" ... />
             {/* Live Preview Thumbnail */}
             <img src={formData[name]} ... />
          </div>
        );
      // ... other types
    }
  };
```
-   **Markdown Support**: Includes a live preview tab using `react-markdown`.
-   **Image Support**: Shows a thumbnail preview if a URL is entered.

### 4. Submission Logic
```tsx
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay for UX
    setTimeout(() => {
      onSave(formData); // Pass data back to parent
      setIsLoading(false);
    }, 1000);
  };
```

## Usage Example

Creating a form for a "Skill":

```tsx
<CMSEditor
  title="Edit Skill"
  initialData={{ name: 'React', proficiency: 90 }}
  onSave={(data) => updateSkill(id, data)}
  fields={[
    { name: 'name', label: 'Skill Name', type: 'text', required: true },
    { name: 'proficiency', label: 'Proficiency (%)', type: 'number' },
    { name: 'icon', label: 'Icon URL', type: 'image' }
  ]}
/>
```

## Perks & Fallbacks
| Feature | Description |
| :--- | :--- |
| **Rapid Dev** | Create complex forms in minutes by defining a JSON schema. |
| **Consistency** | All forms look and behave exactly the same. |
| **Fallback** | Complex validation (e.g., "email format") is currently manual or relies on HTML5 attributes. |
