"use client"

import type React from "react"

import { useState } from "react"
import { useSkillsStore } from "../../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { useToast } from "../../../../hooks/use-toast"
import Link from "next/link"

export default function SkillCategoriesPage() {
  const skillCategories = useSkillsStore((state) => state.categories) ?? []
  const addSkillCategory = useSkillsStore((state) => state.addCategory)
  const updateSkillCategory = useSkillsStore((state) => state.updateCategory)
  const deleteSkillCategory = useSkillsStore((state) => state.deleteCategory)
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    order: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setFormData((prev) => ({ ...prev, order: value }))
  }

  const handleEdit = (category: (typeof skillCategories)[0]) => {
    setIsEditing(category.id)
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      order: category.order,
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setFormData({ id: "", name: "", description: "", order: 0 })
  }

  const handleSaveEdit = () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    updateSkillCategory(formData.id, {
      name: formData.name,
      description: formData.description,
      order: formData.order,
    })

    toast({
      title: "Category updated",
      description: "The skill category has been updated successfully.",
    })

    setIsEditing(null)
    setFormData({ id: "", name: "", description: "", order: 0 })
  }

  const handleDelete = (id: string) => {
    setIsDeleting(id)

    // Simulate API call
    setTimeout(() => {
      deleteSkillCategory(id)
      toast({
        title: "Category deleted",
        description: "The skill category has been deleted successfully.",
      })
      setIsDeleting(null)
    }, 1000)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({
      id: "",
      name: "",
      description: "",
      order: skillCategories.length + 1,
    })
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setFormData({ id: "", name: "", description: "", order: 0 })
  }

  const handleSaveAdd = () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    addSkillCategory({
      name: formData.name,
      description: formData.description,
      order: formData.order,
    })

    toast({
      title: "Category added",
      description: "The new skill category has been added successfully.",
    })

    setIsAdding(false)
    setFormData({ id: "", name: "", description: "", order: 0 })
  }

  // Sort categories by order
  const sortedCategories = [...skillCategories].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Skill Categories"
        description="Manage your skill categories"
        action={{
          label: "Back",
          href: "/admin/skills",
        }}
      />

      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/skills" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Skills
          </Link>
        </Button>
        <Button onClick={handleAdd} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Frontend, Backend, Cloud"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this category"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={handleOrderChange}
              />
              <p className="text-xs text-muted-foreground">Lower numbers will be displayed first</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelAdd}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdd}>Save Category</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedCategories.map((category) => (
          <Card key={category.id}>
            {isEditing === category.id ? (
              <>
                <CardHeader>
                  <CardTitle>Edit Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-name-${category.id}`}>Category Name *</Label>
                    <Input
                      id={`edit-name-${category.id}`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-description-${category.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${category.id}`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`edit-order-${category.id}`}>Display Order</Label>
                    <Input
                      id={`edit-order-${category.id}`}
                      name="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={handleOrderChange}
                    />
                  </div>
                </CardContent>
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
                  <CardTitle className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">Order: {category.order}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description || "No description provided."}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={isDeleting === category.id}
                  >
                    {isDeleting === category.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
