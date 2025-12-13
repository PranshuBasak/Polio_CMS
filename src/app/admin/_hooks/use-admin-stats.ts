"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useMemo, useState } from "react"
import { useBlogStore, useProjectsStore, useSkillsStore } from "../../../lib/stores"

/**
 * Custom hook for admin dashboard statistics
 * Provides computed stats from various stores and real-time data
 */
export function useAdminStats() {
  const projects = useProjectsStore((state) => state.projects)
  const posts = useBlogStore((state) => state.posts)
  const internalBlogPosts = posts.filter(p => !p.externalUrl)
  const externalBlogPosts = posts.filter(p => p.externalUrl)
  const skills = useSkillsStore((state) => state.skills)
  
  const [pageViews, setPageViews] = useState(0)
  const [pageViewsGrowth, setPageViewsGrowth] = useState(0)
  const [statsGrowth, setStatsGrowth] = useState({
    projects: 0,
    blog: 0,
    skills: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      
      // 1. Page Views Logic
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

      // Fetch total page views
      const { count: totalCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
      
      setPageViews(totalCount || 0)

      // Fetch views in last 30 days
      const { count: currentPeriodCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Fetch views in previous 30 days
      const { count: previousPeriodCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())

      const current = currentPeriodCount || 0
      const previous = previousPeriodCount || 0

      if (previous === 0) {
        setPageViewsGrowth(current > 0 ? 100 : 0)
      } else {
        const growth = ((current - previous) / previous) * 100
        setPageViewsGrowth(Math.round(growth))
      }

      // 2. Other Stats Growth Logic (Client-side calculation)
      const calculateGrowth = (items: any[], dateField: string) => {
        if (!items || items.length === 0) return 0
        
        const currentItems = items.filter(item => {
          const date = new Date(item[dateField])
          return date >= thirtyDaysAgo
        }).length

        const previousItems = items.filter(item => {
          const date = new Date(item[dateField])
          return date >= sixtyDaysAgo && date < thirtyDaysAgo
        }).length

        if (previousItems === 0) return currentItems > 0 ? 100 : 0
        return Math.round(((currentItems - previousItems) / previousItems) * 100)
      }

      setStatsGrowth({
        projects: calculateGrowth(projects, 'createdAt'),
        blog: calculateGrowth(internalBlogPosts, 'date'),
        skills: calculateGrowth(skills, 'createdAt')
      })
    }

    fetchStats()
  }, [projects, internalBlogPosts, skills])

  const stats = useMemo(
    () => ({
      totalProjects: projects?.length ?? 0,
      totalBlogPosts: internalBlogPosts?.length ?? 0,
      totalExternalPosts: externalBlogPosts?.length ?? 0,
      totalSkills: skills?.length ?? 0,
      totalContent: (projects?.length ?? 0) + (internalBlogPosts?.length ?? 0) + (skills?.length ?? 0),
      totalPageViews: pageViews,
      pageViewsGrowth,
      statsGrowth
    }),
    [projects, internalBlogPosts, externalBlogPosts, skills, pageViews, pageViewsGrowth, statsGrowth],
  )

  return stats
}
