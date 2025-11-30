export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      about: {
        Row: {
          available_for_work: boolean | null
          avatar_url: string | null
          bio: string
          bio_short: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          phone: string | null
          resume_url: string | null
          tagline: string | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          available_for_work?: boolean | null
          avatar_url?: string | null
          bio: string
          bio_short?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          resume_url?: string | null
          tagline?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          available_for_work?: boolean | null
          avatar_url?: string | null
          bio?: string
          bio_short?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          resume_url?: string | null
          tagline?: string | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          issue_date: string
          issuer: string
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date: string
          issuer: string
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string
          issuer?: string
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      core_values: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          current: boolean | null
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution: string
          location: string | null
          logo: string | null
          order_index: number | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current?: boolean | null
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution: string
          location?: string | null
          logo?: string | null
          order_index?: number | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current?: boolean | null
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution?: string
          location?: string | null
          logo?: string | null
          order_index?: number | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[] | null
          company: string
          company_logo: string | null
          company_url: string | null
          created_at: string | null
          current: boolean | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          order_index: number | null
          position: string
          responsibilities: string[] | null
          start_date: string
          technologies: string[] | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          company: string
          company_logo?: string | null
          company_url?: string | null
          created_at?: string | null
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          order_index?: number | null
          position: string
          responsibilities?: string[] | null
          start_date: string
          technologies?: string[] | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          company?: string
          company_logo?: string | null
          company_url?: string | null
          created_at?: string | null
          current?: boolean | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          order_index?: number | null
          position?: string
          responsibilities?: string[] | null
          start_date?: string
          technologies?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      health_check: {
        Row: {
          id: number
          last_ping: string | null
        }
        Insert: {
          id: number
          last_ping?: string | null
        }
        Update: {
          id?: number
          last_ping?: string | null
        }
        Relationships: []
      }
      journey: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          page_path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          content: string | null
          created_at: string | null
          description: string
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          likes: number | null
          live_url: string | null
          order_index: number | null
          published: boolean | null
          screenshots: string[] | null
          slug: string
          tech_stack: string[]
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          live_url?: string | null
          order_index?: number | null
          published?: boolean | null
          screenshots?: string[] | null
          slug: string
          tech_stack?: string[]
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          live_url?: string | null
          order_index?: number | null
          published?: boolean | null
          screenshots?: string[] | null
          slug?: string
          tech_stack?: string[]
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          proficiency: number
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          proficiency: number
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          proficiency?: number
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          order_index: number | null
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          order_index?: number | null
          platform?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_avatar: string | null
          client_company: string | null
          client_name: string
          client_role: string | null
          content: string
          created_at: string | null
          featured: boolean | null
          id: string
          order_index: number | null
          project_id: string | null
          published: boolean | null
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          client_avatar?: string | null
          client_company?: string | null
          client_name: string
          client_role?: string | null
          content: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          published?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          client_avatar?: string | null
          client_company?: string | null
          client_name?: string
          client_role?: string | null
          content?: string
          created_at?: string | null
          featured?: boolean | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          published?: boolean | null
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
