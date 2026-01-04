"use client"

import { useHeroStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import CMSEditor from "@/features/admin/components/cms-editor"
import { DotLoader } from "@/components/ui/dot-loader"

export default function HeroPage() {
  const heroData = useHeroStore((state) => state.heroData)
  const updateHeroData = useHeroStore((state) => state.updateHeroData)
  const isLoading = useHeroStore((state) => state.isLoading)

  const heroFields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      placeholder: "Your name",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Your professional title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "A brief description about yourself",
      required: true,
    },
    {
      name: "avatarUrl",
      label: "Profile Image URL",
      type: "image" as const,
      placeholder: "URL to your profile image",
      description: "Leave empty to use the default placeholder image.",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DotLoader dotClass="text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading hero data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Hero Section" description="Update your hero section content" />
      <CMSEditor
        title="Hero Content"
        description="This information will be displayed in the hero section of your portfolio."
        initialData={heroData}
        onSave={updateHeroData}
        fields={heroFields}
      />
    </div>
  )
}
