"use client"

import { useAboutStore } from "../../../lib/stores"
import AdminHeader from "@/features/admin/components/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import CMSEditor from "@/features/admin/components/cms-editor"
import AboutJourneyEditor from "@/features/admin/components/about-journey-editor"
import AboutValuesEditor from "@/features/admin/components/about-values-editor"

export default function AboutPage() {
  const aboutData = useAboutStore((state) => state.aboutData)
  const updateAboutData = useAboutStore((state) => state.updateAboutData)

  const aboutBioFields = [
    {
      name: "bio",
      label: "Bio",
      type: "markdown" as const,
      placeholder: "Write a brief bio about yourself",
      required: true,
    },
    {
      name: "focus",
      label: "Focus Areas",
      type: "markdown" as const,
      placeholder: "Describe your focus areas and expertise",
      required: true,
    },
    {
      name: "mission",
      label: "Mission Statement",
      type: "textarea" as const,
      placeholder: "Your professional mission statement",
      required: true,
    },
    {
      name: "avatarUrl",
      label: "About Image",
      type: "image" as const,
      description: "A professional photo for the about section",
      required: false,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader title="About Section" description="Update your about section content" />

      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="journey">Professional Journey</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
        </TabsList>

        <TabsContent value="bio">
          <CMSEditor
            title="About Content"
            description="This information will be displayed in the about section of your portfolio."
            initialData={aboutData}
            onSave={updateAboutData}
            fields={aboutBioFields}
          />
        </TabsContent>

        <TabsContent value="journey">
          <AboutJourneyEditor />
        </TabsContent>

        <TabsContent value="values">
          <AboutValuesEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
