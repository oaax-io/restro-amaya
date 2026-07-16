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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          capacity: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string | null
          end_time: string | null
          event_date: string | null
          event_time: string | null
          flyer_url: string | null
          id: string
          is_paid: boolean
          is_published: boolean
          is_recurring: boolean
          kicker: string | null
          location: string | null
          price_text: string | null
          recurrence: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string | null
          event_time?: string | null
          flyer_url?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          is_recurring?: boolean
          kicker?: string | null
          location?: string | null
          price_text?: string | null
          recurrence?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string | null
          event_time?: string | null
          flyer_url?: string | null
          id?: string
          is_paid?: boolean
          is_published?: boolean
          is_recurring?: boolean
          kicker?: string | null
          location?: string | null
          price_text?: string | null
          recurrence?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption_de: string | null
          caption_en: string | null
          category: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          caption_de?: string | null
          caption_en?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
        }
        Update: {
          caption_de?: string | null
          caption_en?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          cv_path: string | null
          cv_url: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string | null
          position: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          cv_path?: string | null
          cv_url?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone?: string | null
          position: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          cv_path?: string | null
          cv_url?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string | null
          position?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          body_de: string | null
          body_en: string | null
          created_at: string
          id: string
          is_open: boolean
          summary_de: string | null
          summary_en: string | null
          title_de: string
          title_en: string
          updated_at: string
        }
        Insert: {
          body_de?: string | null
          body_en?: string | null
          created_at?: string
          id?: string
          is_open?: boolean
          summary_de?: string | null
          summary_en?: string | null
          title_de: string
          title_en: string
          updated_at?: string
        }
        Update: {
          body_de?: string | null
          body_en?: string | null
          created_at?: string
          id?: string
          is_open?: boolean
          summary_de?: string | null
          summary_en?: string | null
          title_de?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      lounge_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_published: boolean
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_published?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_published?: boolean
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lounge_members: {
        Row: {
          address: string | null
          admin_notes: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          member_number: string | null
          membership_type: string
          message: string | null
          payment_status: string
          phone: string | null
          postal_code: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          member_number?: string | null
          membership_type?: string
          message?: string | null
          payment_status?: string
          phone?: string | null
          postal_code?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          member_number?: string | null
          membership_type?: string
          message?: string | null
          payment_status?: string
          phone?: string | null
          postal_code?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          id: string
          menu_type: string
          name_de: string
          name_en: string
          slug: string
          sort_order: number
          subtitle_de: string | null
          subtitle_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_type?: string
          name_de: string
          name_en: string
          slug: string
          sort_order?: number
          subtitle_de?: string | null
          subtitle_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_type?: string
          name_de?: string
          name_en?: string
          slug?: string
          sort_order?: number
          subtitle_de?: string | null
          subtitle_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          bottle_price: string | null
          category_id: string
          created_at: string
          description_de: string | null
          description_en: string | null
          glass_price: string | null
          highlight: boolean
          id: string
          image_url: string | null
          is_visible: boolean
          name_de: string
          name_en: string
          origin_de: string | null
          origin_en: string | null
          price: number | null
          price_text: string | null
          sort_order: number
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          bottle_price?: string | null
          category_id: string
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          glass_price?: string | null
          highlight?: boolean
          id?: string
          image_url?: string | null
          is_visible?: boolean
          name_de: string
          name_en: string
          origin_de?: string | null
          origin_en?: string | null
          price?: number | null
          price_text?: string | null
          sort_order?: number
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          bottle_price?: string | null
          category_id?: string
          created_at?: string
          description_de?: string | null
          description_en?: string | null
          glass_price?: string | null
          highlight?: boolean
          id?: string
          image_url?: string | null
          is_visible?: boolean
          name_de?: string
          name_en?: string
          origin_de?: string | null
          origin_en?: string | null
          price?: number | null
          price_text?: string | null
          sort_order?: number
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_meta: {
        Row: {
          date_range_de: string | null
          date_range_en: string | null
          menu_type: string
          pdf_url: string | null
          suppe_salat_de: string | null
          suppe_salat_en: string | null
          suppe_salat_price: string | null
          title_de: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          date_range_de?: string | null
          date_range_en?: string | null
          menu_type: string
          pdf_url?: string | null
          suppe_salat_de?: string | null
          suppe_salat_en?: string | null
          suppe_salat_price?: string | null
          title_de?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          date_range_de?: string | null
          date_range_en?: string | null
          menu_type?: string
          pdf_url?: string | null
          suppe_salat_de?: string | null
          suppe_salat_en?: string | null
          suppe_salat_price?: string | null
          title_de?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      opening_hours: {
        Row: {
          closes: string | null
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          opens: string | null
          slot: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          closes?: string | null
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          opens?: string | null
          slot: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          closes?: string | null
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          opens?: string | null
          slot?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          party_size: number
          phone: string | null
          reservation_date: string
          reservation_time: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          party_size: number
          phone?: string | null
          reservation_date: string
          reservation_time: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          party_size?: number
          phone?: string | null
          reservation_date?: string
          reservation_time?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
      application_status:
        | "new"
        | "reviewing"
        | "interview"
        | "accepted"
        | "rejected"
      reservation_status:
        | "pending"
        | "confirmed"
        | "declined"
        | "completed"
        | "cancelled"
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
  public: {
    Enums: {
      app_role: ["admin", "staff"],
      application_status: [
        "new",
        "reviewing",
        "interview",
        "accepted",
        "rejected",
      ],
      reservation_status: [
        "pending",
        "confirmed",
        "declined",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
