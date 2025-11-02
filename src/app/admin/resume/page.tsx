"use client"
import AdminHeader from "@/features/admin/components/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import ResumeExperienceEditor from "@/features/admin/components/resume-experience-editor"
import ResumeEducationEditor from "@/features/admin/components/resume-education-editor"
import ResumeSkillsEditor from "@/features/admin/components/resume-skills-editor"
import ResumeCertificationsEditor from "@/features/admin/components/resume-certifications-editor"
import ResumeGeneralEditor from "@/features/admin/components/resume-general-editor"

export default function ResumePage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Resume Management" description="Manage your resume content and downloadable PDF" />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ResumeGeneralEditor />
        </TabsContent>

        <TabsContent value="experience">
          <ResumeExperienceEditor />
        </TabsContent>

        <TabsContent value="education">
          <ResumeEducationEditor />
        </TabsContent>

        <TabsContent value="skills">
          <ResumeSkillsEditor />
        </TabsContent>

        <TabsContent value="certifications">
          <ResumeCertificationsEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}
