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
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/lib/stores';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ResumeSkillsEditor() {
  const { resumeData, updateSkills } = useResumeStore();
  const { toast } = useToast();
  const [skillGroups, setSkillGroups] = useState([...resumeData.skills]);
  const [isEditingGroup, setIsEditingGroup] = useState<number | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState<{
    groupIndex: number;
    skillIndex: number;
  } | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState<number | null>(null);
  const [groupFormData, setGroupFormData] = useState({
    category: '',
  });
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    level: 50,
  });

  useEffect(() => {
    if (resumeData?.skills) {
      setSkillGroups([...resumeData.skills]);
    }
  }, [resumeData.skills]);

  const handleGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSkillFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillLevelChange = (value: number[]) => {
    setSkillFormData((prev) => ({ ...prev, level: value[0] }));
  };

  const handleEditGroup = (index: number) => {
    setIsEditingGroup(index);
    setGroupFormData({
      category: skillGroups[index].category,
    });
  };

  const handleCancelEditGroup = () => {
    setIsEditingGroup(null);
    setGroupFormData({ category: '' });
  };

  const handleSaveEditGroup = () => {
    if (!groupFormData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a category name.',
        variant: 'destructive',
      });
      return;
    }

    const updatedGroups = [...skillGroups];
    if (isEditingGroup !== null) {
      updatedGroups[isEditingGroup] = {
        ...updatedGroups[isEditingGroup],
        category: groupFormData.category,
      };
    }
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);

    toast({
      title: 'Skill group updated',
      description: 'Your skill group has been updated successfully.',
    });

    setIsEditingGroup(null);
    setGroupFormData({ category: '' });
  };

  const handleDeleteGroup = (index: number) => {
    const updatedGroups = [...skillGroups];
    updatedGroups.splice(index, 1);
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);

    toast({
      title: 'Skill group deleted',
      description: 'The skill group has been deleted successfully.',
    });
  };

  const handleAddGroup = () => {
    setIsAddingGroup(true);
    setGroupFormData({ category: '' });
  };

  const handleCancelAddGroup = () => {
    setIsAddingGroup(false);
    setGroupFormData({ category: '' });
  };

  const handleSaveAddGroup = () => {
    if (!groupFormData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a category name.',
        variant: 'destructive',
      });
      return;
    }

    const newGroup = {
      category: groupFormData.category,
      items: [],
    };

    const updatedGroups = [...skillGroups, newGroup];
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);

    toast({
      title: 'Skill group added',
      description: 'Your new skill group has been added successfully.',
    });

    setIsAddingGroup(false);
    setGroupFormData({ category: '' });
  };

  const handleEditSkill = (groupIndex: number, skillIndex: number) => {
    setIsEditingSkill({ groupIndex, skillIndex });
    setSkillFormData({
      name: skillGroups[groupIndex].items[skillIndex].name,
      level: skillGroups[groupIndex].items[skillIndex].level,
    });
  };

  const handleCancelEditSkill = () => {
    setIsEditingSkill(null);
    setSkillFormData({ name: '', level: 50 });
  };

  const handleSaveEditSkill = () => {
    if (!skillFormData.name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a skill name.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditingSkill) {
      const { groupIndex, skillIndex } = isEditingSkill;
      const updatedGroups = [...skillGroups];
      updatedGroups[groupIndex].items[skillIndex] = {
        ...updatedGroups[groupIndex].items[skillIndex],
        name: skillFormData.name,
        level: skillFormData.level,
      };
      setSkillGroups(updatedGroups);
      updateSkills(updatedGroups);

      toast({
        title: 'Skill updated',
        description: 'Your skill has been updated successfully.',
      });
    }

    setIsEditingSkill(null);
    setSkillFormData({ name: '', level: 50 });
  };

  const handleDeleteSkill = (groupIndex: number, skillIndex: number) => {
    const updatedGroups = [...skillGroups];
    updatedGroups[groupIndex].items.splice(skillIndex, 1);
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);

    toast({
      title: 'Skill deleted',
      description: 'The skill has been deleted successfully.',
    });
  };

  const handleAddSkill = (groupIndex: number) => {
    setIsAddingSkill(groupIndex);
    setSkillFormData({ name: '', level: 50 });
  };

  const handleCancelAddSkill = () => {
    setIsAddingSkill(null);
    setSkillFormData({ name: '', level: 50 });
  };

  const handleSaveAddSkill = () => {
    if (!skillFormData.name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a skill name.',
        variant: 'destructive',
      });
      return;
    }

    if (isAddingSkill !== null) {
      const updatedGroups = [...skillGroups];
      updatedGroups[isAddingSkill].items.push({
        name: skillFormData.name,
        level: skillFormData.level,
      });
      setSkillGroups(updatedGroups);
      updateSkills(updatedGroups);

      toast({
        title: 'Skill added',
        description: 'Your new skill has been added successfully.',
      });
    }

    setIsAddingSkill(null);
    setSkillFormData({ name: '', level: 50 });
  };

  const handleMoveGroupUp = (index: number) => {
    if (index === 0) return;
    const updatedGroups = [...skillGroups];
    const temp = updatedGroups[index];
    updatedGroups[index] = updatedGroups[index - 1];
    updatedGroups[index - 1] = temp;
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);
  };

  const handleMoveGroupDown = (index: number) => {
    if (index === skillGroups.length - 1) return;
    const updatedGroups = [...skillGroups];
    const temp = updatedGroups[index];
    updatedGroups[index] = updatedGroups[index + 1];
    updatedGroups[index + 1] = temp;
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);
  };

  const handleMoveSkillUp = (groupIndex: number, skillIndex: number) => {
    if (skillIndex === 0) return;
    const updatedGroups = [...skillGroups];
    const temp = updatedGroups[groupIndex].items[skillIndex];
    updatedGroups[groupIndex].items[skillIndex] =
      updatedGroups[groupIndex].items[skillIndex - 1];
    updatedGroups[groupIndex].items[skillIndex - 1] = temp;
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);
  };

  const handleMoveSkillDown = (groupIndex: number, skillIndex: number) => {
    if (skillIndex === skillGroups[groupIndex].items.length - 1) return;
    const updatedGroups = [...skillGroups];
    const temp = updatedGroups[groupIndex].items[skillIndex];
    updatedGroups[groupIndex].items[skillIndex] =
      updatedGroups[groupIndex].items[skillIndex + 1];
    updatedGroups[groupIndex].items[skillIndex + 1] = temp;
    setSkillGroups(updatedGroups);
    updateSkills(updatedGroups);
  };

  const handleDragEnd = (result: {
    source: { index: number; droppableId: string };
    destination: { index: number; droppableId: string } | null;
    type: string;
  }) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Handle group reordering
    if (type === 'group') {
      const items = Array.from(skillGroups);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setSkillGroups(items);
      updateSkills(items);
      return;
    }

    // Handle skill reordering within the same group
    if (source.droppableId === destination.droppableId) {
      const groupIndex = Number.parseInt(source.droppableId);
      const items = Array.from(skillGroups[groupIndex].items);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const updatedGroups = [...skillGroups];
      updatedGroups[groupIndex].items = items;
      setSkillGroups(updatedGroups);
      updateSkills(updatedGroups);
    } else {
      // Handle skill moving between groups
      const sourceGroupIndex = Number.parseInt(source.droppableId);
      const destGroupIndex = Number.parseInt(destination.droppableId);

      const sourceItems = Array.from(skillGroups[sourceGroupIndex].items);
      const destItems = Array.from(skillGroups[destGroupIndex].items);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      const updatedGroups = [...skillGroups];
      updatedGroups[sourceGroupIndex].items = sourceItems;
      updatedGroups[destGroupIndex].items = destItems;

      setSkillGroups(updatedGroups);
      updateSkills(updatedGroups);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Manage your skills and proficiency levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAddingGroup && (
          <Card className="border-primary/50 mb-4">
            <CardHeader>
              <CardTitle>Add New Skill Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="category">Category Name *</Label>
                <Input
                  id="category"
                  name="category"
                  value={groupFormData.category}
                  onChange={handleGroupChange}
                  placeholder="e.g. Programming Languages"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelAddGroup}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddGroup}>Add Group</Button>
            </CardFooter>
          </Card>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skill-groups" type="group">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {skillGroups.map((group, groupIndex) => (
                  <Draggable
                    key={`group-${groupIndex}`}
                    draggableId={`group-${groupIndex}`}
                    index={groupIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          key={groupIndex}
                          className={
                            isEditingGroup === groupIndex
                              ? 'border-primary'
                              : ''
                          }
                        >
                          {isEditingGroup === groupIndex ? (
                            <>
                              <CardHeader>
                                <CardTitle>Edit Skill Group</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`edit-category-${groupIndex}`}
                                  >
                                    Category Name *
                                  </Label>
                                  <Input
                                    id={`edit-category-${groupIndex}`}
                                    name="category"
                                    value={groupFormData.category}
                                    onChange={handleGroupChange}
                                    required
                                  />
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={handleCancelEditGroup}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleSaveEditGroup}>
                                  Save Changes
                                </Button>
                              </CardFooter>
                            </>
                          ) : (
                            <>
                              <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                  <span>{group.category}</span>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleMoveGroupUp(groupIndex)
                                      }
                                      disabled={groupIndex === 0}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        handleMoveGroupDown(groupIndex)
                                      }
                                      disabled={
                                        groupIndex === skillGroups.length - 1
                                      }
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Droppable
                                  droppableId={`${groupIndex}`}
                                  type="skill"
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="space-y-3"
                                    >
                                      {group.items.map((skill, skillIndex) => (
                                        <Draggable
                                          key={`skill-${groupIndex}-${skillIndex}`}
                                          draggableId={`skill-${groupIndex}-${skillIndex}`}
                                          index={skillIndex}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={
                                                isEditingSkill &&
                                                isEditingSkill.groupIndex ===
                                                  groupIndex &&
                                                isEditingSkill.skillIndex ===
                                                  skillIndex
                                                  ? 'border rounded-md p-3 border-primary'
                                                  : 'border rounded-md p-3'
                                              }
                                            >
                                              {isEditingSkill &&
                                              isEditingSkill.groupIndex ===
                                                groupIndex &&
                                              isEditingSkill.skillIndex ===
                                                skillIndex ? (
                                                <div className="space-y-3">
                                                  <div className="space-y-2">
                                                    <Label
                                                      htmlFor={`edit-skill-name-${groupIndex}-${skillIndex}`}
                                                    >
                                                      Skill Name *
                                                    </Label>
                                                    <Input
                                                      id={`edit-skill-name-${groupIndex}-${skillIndex}`}
                                                      name="name"
                                                      value={skillFormData.name}
                                                      onChange={
                                                        handleSkillChange
                                                      }
                                                      required
                                                    />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label
                                                      htmlFor={`edit-skill-level-${groupIndex}-${skillIndex}`}
                                                    >
                                                      Proficiency Level:{' '}
                                                      {skillFormData.level}%
                                                    </Label>
                                                    <Slider
                                                      id={`edit-skill-level-${groupIndex}-${skillIndex}`}
                                                      min={0}
                                                      max={100}
                                                      step={5}
                                                      value={[
                                                        skillFormData.level,
                                                      ]}
                                                      onValueChange={
                                                        handleSkillLevelChange
                                                      }
                                                    />
                                                  </div>
                                                  <div className="flex justify-end space-x-2 pt-2">
                                                    <Button
                                                      variant="outline"
                                                      onClick={
                                                        handleCancelEditSkill
                                                      }
                                                    >
                                                      Cancel
                                                    </Button>
                                                    <Button
                                                      onClick={
                                                        handleSaveEditSkill
                                                      }
                                                    >
                                                      Save
                                                    </Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="flex items-center justify-between">
                                                  <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                      <span className="font-medium">
                                                        {skill.name}
                                                      </span>
                                                      <span className="text-sm text-muted-foreground">
                                                        {skill.level}%
                                                      </span>
                                                    </div>
                                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                      <div
                                                        className="h-full bg-primary"
                                                        style={{
                                                          width: `${skill.level}%`,
                                                        }}
                                                      ></div>
                                                    </div>
                                                  </div>
                                                  <div className="flex ml-4 space-x-1">
                                                    <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleMoveSkillUp(
                                                          groupIndex,
                                                          skillIndex
                                                        )
                                                      }
                                                      disabled={
                                                        skillIndex === 0
                                                      }
                                                      className="h-8 w-8"
                                                    >
                                                      <ArrowUp className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleMoveSkillDown(
                                                          groupIndex,
                                                          skillIndex
                                                        )
                                                      }
                                                      disabled={
                                                        skillIndex ===
                                                        group.items.length - 1
                                                      }
                                                      className="h-8 w-8"
                                                    >
                                                      <ArrowDown className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleEditSkill(
                                                          groupIndex,
                                                          skillIndex
                                                        )
                                                      }
                                                      className="h-8 w-8"
                                                    >
                                                      <Pencil className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      variant="destructive"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleDeleteSkill(
                                                          groupIndex,
                                                          skillIndex
                                                        )
                                                      }
                                                      className="h-8 w-8"
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}

                                      {isAddingSkill === groupIndex ? (
                                        <div className="border rounded-md p-3 border-primary">
                                          <div className="space-y-3">
                                            <div className="space-y-2">
                                              <Label
                                                htmlFor={`add-skill-name-${groupIndex}`}
                                              >
                                                Skill Name *
                                              </Label>
                                              <Input
                                                id={`add-skill-name-${groupIndex}`}
                                                name="name"
                                                value={skillFormData.name}
                                                onChange={handleSkillChange}
                                                placeholder="e.g. TypeScript"
                                                required
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label
                                                htmlFor={`add-skill-level-${groupIndex}`}
                                              >
                                                Proficiency Level:{' '}
                                                {skillFormData.level}%
                                              </Label>
                                              <Slider
                                                id={`add-skill-level-${groupIndex}`}
                                                min={0}
                                                max={100}
                                                step={5}
                                                value={[skillFormData.level]}
                                                onValueChange={
                                                  handleSkillLevelChange
                                                }
                                              />
                                            </div>
                                            <div className="flex justify-end space-x-2 pt-2">
                                              <Button
                                                variant="outline"
                                                onClick={handleCancelAddSkill}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={handleSaveAddSkill}
                                              >
                                                Add Skill
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleAddSkill(groupIndex)
                                          }
                                          className="w-full mt-2"
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Add Skill
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </Droppable>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditGroup(groupIndex)}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Group
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteGroup(groupIndex)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Group
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

        {!isAddingGroup && (
          <Button onClick={handleAddGroup} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Skill Group
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
