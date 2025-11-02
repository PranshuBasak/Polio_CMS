"use client"

import { useState } from "react"
import { useSkillsStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Pencil, Trash2, Plus, Settings } from "lucide-react"
import { Progress } from "../../../components/ui/progress"
import Link from "next/link"
import { Badge } from "../../../components/ui/badge"

export default function SkillsPage() {
  const skillsData = useSkillsStore((state) => state.skills) ?? []
  const deleteSkill = useSkillsStore((state) => state.deleteSkill)
  const skillCategories = useSkillsStore((state) => state.categories) ?? []

  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Sort categories by order
  const sortedCategories = [...skillCategories].sort((a, b) => a.order - b.order)

  const handleDelete = (id: string) => {
    setIsDeleting(id)

    // Simulate API call
    setTimeout(() => {
      deleteSkill(id)
      setIsDeleting(null)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Skills"
        description="Manage your skills and expertise"
        action={{
          label: "Add Skill",
          href: "/admin/skills/new",
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Skill Categories</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/skills/categories" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage Categories
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={sortedCategories[0]?.id || "core"} className="w-full">
        <TabsList className="flex flex-wrap mb-8">
          {sortedCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex-grow">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillsData
                .filter((skill) => skill.category === category.id)
                .map((skill) => (
                  <Card key={skill.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        <span>{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={skill.level} className="h-2" />
                      <div className="mt-2">
                        <Badge variant="outline">{category.name}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/skills/edit/${skill.id}`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                        disabled={isDeleting === skill.id}
                      >
                        {isDeleting === skill.id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

              <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                <Link href={`/admin/skills/new?category=${category.id}`}>
                  <Button variant="outline" className="mb-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New {category.name} Skill
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground text-center">
                  Add a new skill to your {category.name} category
                </p>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
