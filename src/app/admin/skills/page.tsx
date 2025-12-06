"use client"

import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { GripVertical, Pencil, Plus, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Progress } from "../../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import AdminHeader from "@/features/admin/components/admin-header"
import { useSkillsStore } from "../../../lib/stores"

export default function SkillsPage() {
  const skillsData = useSkillsStore((state) => state.skills) ?? []
  const deleteSkill = useSkillsStore((state) => state.deleteSkill)
  const reorderSkills = useSkillsStore((state) => state.reorderSkills)
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

  const handleDragEnd = (result: DropResult, categoryId: string) => {
    if (!result.destination) return

    const categorySkills = skillsData
      .filter((s) => s.category === categoryId)
      .sort((a, b) => a.orderIndex - b.orderIndex)

    const items = Array.from(categorySkills)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local order
    const updatedItems = items.map((item, index) => ({
      ...item,
      orderIndex: index,
    }))

    // Merge with other skills
    const otherSkills = skillsData.filter((s) => s.category !== categoryId)
    const newSkills = [...otherSkills, ...updatedItems]

    reorderSkills(newSkills)
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
            <div className="space-y-6">
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, category.id)}>
                <Droppable droppableId={`skills-${category.id}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {skillsData
                        .filter((skill) => skill.category === category.id)
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((skill, index) => (
                          <Draggable key={skill.id} draggableId={skill.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        {skill.icon && (
                                          <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain" />
                                        )}
                                        <span>{skill.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                                        {skill.year && <span>{skill.year}y exp</span>}
                                        <span>{skill.level}%</span>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Progress value={skill.level} className="h-2" />
                                    <div className="mt-2 flex justify-between items-center">
                                      <Badge variant="outline">{category.name}</Badge>
                                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
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
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      
                      <Card className="flex flex-col items-center justify-center p-6 border-dashed min-h-[200px]">
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
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
