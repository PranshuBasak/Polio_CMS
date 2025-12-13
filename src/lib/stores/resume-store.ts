import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"

export type ResumeExperience = {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
}

export type ResumeEducation = {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
  courses: string[]
}

export type ResumeSkillCategory = {
  category: string
  items: {
    name: string
    level: number
  }[]
}

export type ResumeCertification = {
  id: string
  name: string
  issuer: string
  date: string
  description: string
  url?: string
}

export type ResumeData = {
  experiences: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkillCategory[]
  certifications: ResumeCertification[]
  languages: {
    id?: string
    name: string
    proficiency: string
  }[]
  interests: string[]
  pdfUrl: string
  // About fields
  name: string
  email: string
  phone: string
  location: string
  bio: string
  availableForWork: boolean
  yearsExperience: number
}

type ResumeStore = {
  resumeData: ResumeData
  isLoading: boolean
  error: string | null
  fetchResumeData: () => Promise<void>
  updateResumeData: (data: Partial<ResumeData>) => Promise<void>
  updateExperiences: (experiences: ResumeExperience[]) => void
  updateEducation: (education: ResumeEducation[]) => void
  updateSkills: (skills: ResumeSkillCategory[]) => void
  updateCertifications: (certifications: ResumeCertification[]) => void
  resetResume: () => void
}

const defaultResumeData: ResumeData = {
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  interests: [],
  pdfUrl: "",
  name: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  availableForWork: false,
  yearsExperience: 0,
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resumeData: defaultResumeData,
  isLoading: false,
  error: null,

  fetchResumeData: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()

      // Fetch experiences
      const { data: experiences } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false })

      // Fetch education
      const { data: education } = await supabase
        .from("education")
        .select("*")
        .order("start_date", { ascending: false })

      // Fetch certifications
      const { data: certifications } = await supabase
        .from("certifications")
        .select("*")
        .order("issue_date", { ascending: false })

      // Fetch skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .order("order_index", { ascending: true })

      // Group skills by category
      const skills: ResumeSkillCategory[] = []
      if (skillsData) {
        const categories = Array.from(new Set(skillsData.map((s: any) => s.category)))
        categories.forEach((category) => {
          skills.push({
            category: category as string,
            items: skillsData
              .filter((s: any) => s.category === category)
              .map((s: any) => ({
                name: s.name,
                level: s.proficiency,
              })),
          })
        })
      }

      // Fetch languages
      const { data: languages } = await supabase
        .from("languages")
        .select("*")
        .order("created_at", { ascending: true })

      // Fetch interests
      const { data: interests } = await supabase
        .from("interests")
        .select("*")
        .order("created_at", { ascending: true })

      // Fetch about data
      const { data: about } = await supabase
        .from("about")
        .select("*")
        .single()

      // Map to ResumeData format
      const resumeData: ResumeData = {
        experiences: experiences?.map((exp: any) => ({
          id: exp.id,
          title: exp.position,
          company: exp.company,
          location: exp.location || "",
          startDate: exp.start_date,
          endDate: exp.end_date || "Present",
          description: exp.description,
          achievements: exp.achievements || [],
        })) || defaultResumeData.experiences,
        education: education?.map((edu: any) => ({
          id: edu.id,
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || "",
          startDate: edu.start_date,
          endDate: edu.end_date,
          description: edu.description,
          courses: edu.courses || [],
        })) || defaultResumeData.education,
        skills: skills.length > 0 ? skills : defaultResumeData.skills,
        certifications: certifications?.map((cert: any) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.issue_date,
          description: cert.description,
          url: cert.credential_url,
        })) || defaultResumeData.certifications,
        languages: languages?.map((lang: any) => ({
          id: lang.id,
          name: lang.name,
          proficiency: lang.proficiency,
        })) || [],
        interests: interests?.map((int: any) => int.name) || [],
        pdfUrl: about?.resume_url || defaultResumeData.pdfUrl,
        name: about?.name || "",
        email: about?.email || "",
        phone: about?.phone || "",
        location: about?.location || "",
        bio: about?.bio || "",
        availableForWork: about?.available_for_work || false,
        yearsExperience: about?.years_experience || 0,
      }

      set({ resumeData })
    } catch (error: any) {
      console.error("Failed to fetch resume data:", error)
      set({ error: error?.message || "Failed to fetch resume data" })
      set({ resumeData: defaultResumeData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateResumeData: async (data) => {
    const currentData = get().resumeData
    // Optimistic update
    set({
      resumeData: { ...currentData, ...data },
      isLoading: true,
      error: null,
    })

    try {
      const supabase = createClient()
      
      // Update About table (General Info)
      const aboutUpdates: any = {}
      if (data.pdfUrl !== undefined) aboutUpdates.resume_url = data.pdfUrl
      if (data.name !== undefined) aboutUpdates.name = data.name
      if (data.email !== undefined) aboutUpdates.email = data.email
      if (data.phone !== undefined) aboutUpdates.phone = data.phone
      if (data.location !== undefined) aboutUpdates.location = data.location
      if (data.bio !== undefined) aboutUpdates.bio = data.bio
      if (data.availableForWork !== undefined) aboutUpdates.available_for_work = data.availableForWork
      if (data.yearsExperience !== undefined) aboutUpdates.years_experience = data.yearsExperience

      if (Object.keys(aboutUpdates).length > 0) {
        const { data: aboutData } = await supabase.from("about").select("id").limit(1).single()
        
        if (aboutData) {
           const { error } = await supabase
            .from("about")
            .update(aboutUpdates)
            .eq("id", aboutData.id)
            
           if (error) throw error
        }
      }

      // Update Languages
      if (data.languages) {
        const { error: deleteError } = await supabase
          .from("languages")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
        
        if (deleteError) throw deleteError

        if (data.languages.length > 0) {
          const { error: insertError } = await supabase
            .from("languages")
            .insert(
              data.languages.map((l) => ({
                name: l.name,
                proficiency: l.proficiency,
              }))
            )
          if (insertError) throw insertError
        }
      }

      // Update Interests
      if (data.interests) {
        const { error: deleteError } = await supabase
          .from("interests")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
          
        if (deleteError) throw deleteError

        if (data.interests.length > 0) {
          const { error: insertError } = await supabase
            .from("interests")
            .insert(
              data.interests.map((interest) => ({
                name: interest,
              }))
            )
          if (insertError) throw insertError
        }
      }

      // Update Experiences
      if (data.experiences) {
        const { error: deleteError } = await supabase
          .from("experiences")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
          
        if (deleteError) throw deleteError

        if (data.experiences.length > 0) {
          const { error: insertError } = await supabase
            .from("experiences")
            .insert(
              data.experiences.map((exp, index) => ({
                position: exp.title,
                company: exp.company,
                location: exp.location,
                start_date: exp.startDate,
                end_date: exp.endDate === "Present" ? null : exp.endDate, // Handle "Present"
                description: exp.description,
                achievements: exp.achievements,
                order_index: index,
              }))
            )
          if (insertError) throw insertError
        }
      }

      // Update Education
      if (data.education) {
        const { error: deleteError } = await supabase
          .from("education")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
          
        if (deleteError) throw deleteError

        if (data.education.length > 0) {
          const { error: insertError } = await supabase
            .from("education")
            .insert(
              data.education.map((edu, index) => ({
                degree: edu.degree,
                institution: edu.institution,
                location: edu.location,
                start_date: edu.startDate,
                end_date: edu.endDate,
                description: edu.description,
                courses: edu.courses,
                order_index: index,
              }))
            )
          if (insertError) throw insertError
        }
      }

      // Update Certifications
      if (data.certifications) {
        const { error: deleteError } = await supabase
          .from("certifications")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
          
        if (deleteError) throw deleteError

        if (data.certifications.length > 0) {
          const { error: insertError } = await supabase
            .from("certifications")
            .insert(
              data.certifications.map((cert, index) => ({
                name: cert.name,
                issuer: cert.issuer,
                issue_date: cert.date, // Mapped from date
                description: cert.description,
                credential_url: cert.url, // Mapped from url
                order_index: index,
              }))
            )
          if (insertError) throw insertError
        }
      }

      // Update Skills
      if (data.skills) {
        const { error: deleteError } = await supabase
          .from("skills")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000")
          
        if (deleteError) throw deleteError

        const flatSkills = data.skills.flatMap((cat, catIndex) => 
          cat.items.map((item, itemIndex) => ({
            category: cat.category,
            name: item.name,
            proficiency: item.level,
            order_index: catIndex * 100 + itemIndex, // Simple ordering strategy
          }))
        )

        if (flatSkills.length > 0) {
          const { error: insertError } = await supabase
            .from("skills")
            .insert(flatSkills)
          if (insertError) throw insertError
        }
      }

      console.log("Resume data updated in Supabase:", data)
    } catch (error: any) {
      console.error("Failed to update resume data:", error)
      set({ error: error?.message || "Failed to update resume data" })
      // Revert optimistic update
      set({ resumeData: currentData })
    } finally {
      set({ isLoading: false })
    }
  },

  updateExperiences: (experiences) => get().updateResumeData({ experiences }),

  updateEducation: (education) => get().updateResumeData({ education }),

  updateSkills: (skills) => get().updateResumeData({ skills }),

  updateCertifications: (certifications) => get().updateResumeData({ certifications }),

  resetResume: () => set({ resumeData: defaultResumeData }),
}))
