"use client"

import { Input } from "../../../../components/ui/input"
import { Search } from "lucide-react"

type BlogSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Presentational component for blog search
 */
export function BlogSearch({ value, onChange, placeholder = "Search blog posts..." }: BlogSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search blog posts"
      />
    </div>
  )
}
