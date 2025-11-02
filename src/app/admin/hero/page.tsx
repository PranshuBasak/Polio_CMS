"use client"

import { useHeroStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import CMSEditor from "@/features/admin/components/cms-editor"

export default function HeroPage() {
  const heroData = useHeroStore((state) => state.heroData)
  const updateHeroData = useHeroStore((state) => state.updateHeroData)

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
      name: "image",
      label: "Profile Image URL",
      type: "image" as const,
      placeholder: "URL to your profile image",
      description: "Leave empty to use the default placeholder image.",
    },
  ]

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
