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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assignment_exercises: {
        Row: {
          assignment_id: string
          duration_seconds: number
          exercise_id: string
          frequency_per_day: number
          id: string
          instructions_override: string | null
          order_index: number
          reps: number
          sets: number
        }
        Insert: {
          assignment_id: string
          duration_seconds: number
          exercise_id: string
          frequency_per_day: number
          id?: string
          instructions_override?: string | null
          order_index?: number
          reps: number
          sets: number
        }
        Update: {
          assignment_id?: string
          duration_seconds?: number
          exercise_id?: string
          frequency_per_day?: number
          id?: string
          instructions_override?: string | null
          order_index?: number
          reps?: number
          sets?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignment_exercises_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "exercise_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_assignments: {
        Row: {
          created_at: string
          doctor_id: string
          end_date: string | null
          id: string
          notes: string | null
          organization_id: string
          patient_id: string
          start_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          patient_id: string
          start_date: string
          status: string
          title: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_assignments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "exercise_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_assignments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          description: string
          howToDo: string[]
          id: string
          name: string
          src: string
          targetedMuscles: string[]
          title: string
          whatNotToDo: string[]
        }
        Insert: {
          created_at?: string
          description: string
          howToDo: string[]
          id?: string
          name: string
          src: string
          targetedMuscles: string[]
          title: string
          whatNotToDo: string[]
        }
        Update: {
          created_at?: string
          description?: string
          howToDo?: string[]
          id?: string
          name?: string
          src?: string
          targetedMuscles?: string[]
          title?: string
          whatNotToDo?: string[]
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          doctors_count: number
          id: string
          image: string | null
          link: string | null
          managers_count: number
          name: string
          patients_count: number
          root_id: string
          subscription: Json | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          doctors_count?: number
          id?: string
          image?: string | null
          link?: string | null
          managers_count?: number
          name: string
          patients_count?: number
          root_id: string
          subscription?: Json | null
        }
        Update: {
          address?: string | null
          created_at?: string
          doctors_count?: number
          id?: string
          image?: string | null
          link?: string | null
          managers_count?: number
          name?: string
          patients_count?: number
          root_id?: string
          subscription?: Json | null
        }
        Relationships: []
      }
      patient_exercise_logs: {
        Row: {
          assignment_exercise_id: string
          created_at: string
          date: string
          duration_done: number
          feedback: string | null
          id: string
          pain_level: number | null
          patient_id: string
          reps_done: number
          status: string
        }
        Insert: {
          assignment_exercise_id: string
          created_at?: string
          date: string
          duration_done?: number
          feedback?: string | null
          id?: string
          pain_level?: number | null
          patient_id: string
          reps_done?: number
          status: string
        }
        Update: {
          assignment_exercise_id?: string
          created_at?: string
          date?: string
          duration_done?: number
          feedback?: string | null
          id?: string
          pain_level?: number | null
          patient_id?: string
          reps_done?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_exercise_logs_assignment_exercise_id_fkey"
            columns: ["assignment_exercise_id"]
            isOneToOne: false
            referencedRelation: "assignment_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_exercise_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          name: string
          organization_id: string
          profile_img: string | null
          role: string
          user_id: string
          user_metadata: Json | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          name: string
          organization_id: string
          profile_img?: string | null
          role: string
          user_id: string
          user_metadata?: Json | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          name?: string
          organization_id?: string
          profile_img?: string | null
          role?: string
          user_id?: string
          user_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
  public: {
    Enums: {},
  },
} as const
