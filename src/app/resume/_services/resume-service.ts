/**
 * Service for resume-related business logic
 * Facade pattern for resume operations
 */
export const resumeService = {
  /**
   * Format date range for display
   */
  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate).getFullYear()
    const end = endDate === "Present" ? "Present" : new Date(endDate).getFullYear()
    return `${start} - ${end}`
  },

  /**
   * Calculate years of experience
   */
  calculateYearsOfExperience(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = endDate === "Present" ? new Date() : new Date(endDate)
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return Math.round(years * 10) / 10
  },

  /**
   * Get skill level label
   */
  getSkillLevelLabel(level: number): string {
    if (level >= 90) return "Expert"
    if (level >= 75) return "Advanced"
    if (level >= 50) return "Intermediate"
    return "Beginner"
  },

  /**
   * Format certification date
   */
  formatCertificationDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  },
}
