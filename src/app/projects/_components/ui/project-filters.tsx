"use client"

import { Input } from "../../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Search } from "lucide-react"

type ProjectFiltersProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedTech: string
  onTechChange: (value: string) => void
  technologies: string[]
}

/**
 * Presentational component for project filters
 */
export function ProjectFilters({
  searchTerm,
  onSearchChange,
  selectedTech,
  onTechChange,
  technologies,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search projects..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search projects"
        />
      </div>

      <div className="w-full md:w-64">
        <Select value={selectedTech} onValueChange={onTechChange}>
          <SelectTrigger aria-label="Filter by technology">
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
