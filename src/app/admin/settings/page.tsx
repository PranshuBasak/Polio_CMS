"use client"

import AdminHeader from "@/features/admin/components/admin-header"
import SiteSettings from "@/features/admin/components/site-settings"
import LanguageSettings from "@/features/admin/components/language-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

import { useEffect } from "react"
import { useSiteSettingsStore } from "@/lib/stores/site-settings-store"

export default function SettingsPage() {
  const fetchSettings = useSiteSettingsStore((state) => state.fetchSettings)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <div className="space-y-6">
      <AdminHeader title="Settings" description="Manage your portfolio settings and preferences" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="languages">Language Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SiteSettings />
        </TabsContent>

        <TabsContent value="languages">
          <LanguageSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
