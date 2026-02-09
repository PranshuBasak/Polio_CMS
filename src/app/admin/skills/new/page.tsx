"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import AdminHeader from "@/features/admin/components/admin-header"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import CloudinaryUpload from "@/components/ui/cloudinary-upload"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { DualRangeSlider } from "../../../../components/ui/dual-range-slider"
import { DotLoader } from "../../../../components/ui/dot-loader"
import { useToast } from "../../../../hooks/use-toast"
import { useSkillsStore } from "../../../../lib/stores"

export default function NewSkillPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addSkill = useSkillsStore((state) => state.addSkill)
  const skillCategories = useSkillsStore((state) => state.categories) ?? []
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Sort categories by order
  const sortedCategories = [...skillCategories].sort((a, b) => a.order - b.order)

  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: searchParams.get("category") || sortedCategories[0]?.id || "core",
    icon: "",
    year: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleLevelChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, level: value[0] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a skill name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      addSkill({
        name: formData.name,
        level: formData.level,
        category: formData.category,
        icon: formData.icon || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
      })

      toast({
        title: "Skill added",
        description: "Your new skill has been added successfully.",
      })

      router.push("/admin/skills")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Add New Skill" description="Add a new skill to your portfolio" />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
            <CardDescription>Fill in the details about your skill.</CardDescription>
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
              <Select value={formData.category} onValueChange={handleCategoryChange}>
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
              <Label htmlFor="icon">Icon (Optional)</Label>
              <CloudinaryUpload
                value={formData.icon}
                onChange={(value) => setFormData((prev) => ({ ...prev, icon: value as string }))}
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
                label={(value) => `${value}%`}
                labelPosition="top"
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/skills")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <DotLoader dotClass="bg-primary-foreground h-1 w-1" />
                    </div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  "Add Skill"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
