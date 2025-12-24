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
  public: {
    Tables: {
      coworking_bookings: {
        Row: {
          created_at: string
          end_time: string
          id: string
          meals_used: number
          payment_status: string
          space_id: string
          start_time: string
          tier: Database["public"]["Enums"]["coworking_tier"]
          total_amount: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          meals_used?: number
          payment_status?: string
          space_id: string
          start_time: string
          tier: Database["public"]["Enums"]["coworking_tier"]
          total_amount: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          meals_used?: number
          payment_status?: string
          space_id?: string
          start_time?: string
          tier?: Database["public"]["Enums"]["coworking_tier"]
          total_amount?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "coworking_bookings_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "coworking_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      coworking_spaces: {
        Row: {
          amenities: Json | null
          capacity: number
          created_at: string
          id: string
          is_available: boolean
          location: string | null
          name: string
          tier: Database["public"]["Enums"]["coworking_tier"]
        }
        Insert: {
          amenities?: Json | null
          capacity?: number
          created_at?: string
          id?: string
          is_available?: boolean
          location?: string | null
          name: string
          tier?: Database["public"]["Enums"]["coworking_tier"]
        }
        Update: {
          amenities?: Json | null
          capacity?: number
          created_at?: string
          id?: string
          is_available?: boolean
          location?: string | null
          name?: string
          tier?: Database["public"]["Enums"]["coworking_tier"]
        }
        Relationships: []
      }
      coworking_tier_configs: {
        Row: {
          amenities: Json | null
          created_at: string
          daily_rate: number
          description: string | null
          hourly_rate: number
          id: string
          meals_included: number
          monthly_rate: number | null
          name: string
          tier: Database["public"]["Enums"]["coworking_tier"]
          xp_multiplier: number
        }
        Insert: {
          amenities?: Json | null
          created_at?: string
          daily_rate: number
          description?: string | null
          hourly_rate: number
          id?: string
          meals_included?: number
          monthly_rate?: number | null
          name: string
          tier: Database["public"]["Enums"]["coworking_tier"]
          xp_multiplier?: number
        }
        Update: {
          amenities?: Json | null
          created_at?: string
          daily_rate?: number
          description?: string | null
          hourly_rate?: number
          id?: string
          meals_included?: number
          monthly_rate?: number | null
          name?: string
          tier?: Database["public"]["Enums"]["coworking_tier"]
          xp_multiplier?: number
        }
        Relationships: []
      }
      gaming_sessions: {
        Row: {
          created_at: string
          duration_hours: number | null
          end_time: string | null
          id: string
          payment_status: string
          start_time: string
          station_id: string
          total_amount: number | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          duration_hours?: number | null
          end_time?: string | null
          id?: string
          payment_status?: string
          start_time: string
          station_id: string
          total_amount?: number | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          duration_hours?: number | null
          end_time?: string | null
          id?: string
          payment_status?: string
          start_time?: string
          station_id?: string
          total_amount?: number | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "gaming_sessions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "gaming_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      gaming_stations: {
        Row: {
          created_at: string
          description: string | null
          hourly_rate: number
          id: string
          is_available: boolean
          name: string
          specs: Json | null
          station_type: Database["public"]["Enums"]["station_type"]
          xp_per_hour: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          hourly_rate: number
          id?: string
          is_available?: boolean
          name: string
          specs?: Json | null
          station_type: Database["public"]["Enums"]["station_type"]
          xp_per_hour?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          hourly_rate?: number
          id?: string
          is_available?: boolean
          name?: string
          specs?: Json | null
          station_type?: Database["public"]["Enums"]["station_type"]
          xp_per_hour?: number
        }
        Relationships: []
      }
      hotspots: {
        Row: {
          capacity: number | null
          created_at: string
          current_users: number | null
          id: string
          is_solar_powered: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          signal_strength: number | null
          status: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          current_users?: number | null
          id?: string
          is_solar_powered?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          signal_strength?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          current_users?: number | null
          id?: string
          is_solar_powered?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          signal_strength?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          payment_method: string
          status: string
          transaction_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_method: string
          status?: string
          transaction_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_method?: string
          status?: string
          transaction_hash?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          data_limit_mb: number | null
          description: string | null
          duration_hours: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          speed_mbps: number
        }
        Insert: {
          created_at?: string
          data_limit_mb?: number | null
          description?: string | null
          duration_hours: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          speed_mbps?: number
        }
        Update: {
          created_at?: string
          data_limit_mb?: number | null
          description?: string | null
          duration_hours?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          speed_mbps?: number
        }
        Relationships: []
      }
      player_did: {
        Row: {
          achievements: Json | null
          created_at: string
          did_address: string | null
          id: string
          metadata: Json | null
          reputation_score: number
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string
          did_address?: string | null
          id?: string
          metadata?: Json | null
          reputation_score?: number
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string
          did_address?: string | null
          id?: string
          metadata?: Json | null
          reputation_score?: number
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          payment_status: string
          placement: number | null
          registered_at: string
          tournament_id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          id?: string
          payment_status?: string
          placement?: number | null
          registered_at?: string
          tournament_id: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          id?: string
          payment_status?: string
          placement?: number | null
          registered_at?: string
          tournament_id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          current_participants: number
          description: string | null
          end_date: string | null
          entry_fee: number
          game: string
          id: string
          max_participants: number
          name: string
          prize_pool: number
          rules: Json | null
          start_date: string
          station_type: Database["public"]["Enums"]["station_type"] | null
          status: Database["public"]["Enums"]["tournament_status"]
          xp_reward_participation: number
          xp_reward_winner: number
        }
        Insert: {
          created_at?: string
          current_participants?: number
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          game: string
          id?: string
          max_participants?: number
          name: string
          prize_pool?: number
          rules?: Json | null
          start_date: string
          station_type?: Database["public"]["Enums"]["station_type"] | null
          status?: Database["public"]["Enums"]["tournament_status"]
          xp_reward_participation?: number
          xp_reward_winner?: number
        }
        Update: {
          created_at?: string
          current_participants?: number
          description?: string | null
          end_date?: string | null
          entry_fee?: number
          game?: string
          id?: string
          max_participants?: number
          name?: string
          prize_pool?: number
          rules?: Json | null
          start_date?: string
          station_type?: Database["public"]["Enums"]["station_type"] | null
          status?: Database["public"]["Enums"]["tournament_status"]
          xp_reward_participation?: number
          xp_reward_winner?: number
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          data_used_mb: number | null
          end_time: string
          id: string
          payment_status: string
          plan_id: string
          start_time: string
          status: string
          user_id: string
          voucher_id: string | null
        }
        Insert: {
          created_at?: string
          data_used_mb?: number | null
          end_time: string
          id?: string
          payment_status?: string
          plan_id: string
          start_time?: string
          status?: string
          user_id: string
          voucher_id?: string | null
        }
        Update: {
          created_at?: string
          data_used_mb?: number | null
          end_time?: string
          id?: string
          payment_status?: string
          plan_id?: string
          start_time?: string
          status?: string
          user_id?: string
          voucher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plans_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          created_at: string
          current_level: number
          id: string
          lifetime_xp: number
          total_xp: number
          updated_at: string
          user_id: string
          xp_to_next_level: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          lifetime_xp?: number
          total_xp?: number
          updated_at?: string
          user_id: string
          xp_to_next_level?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          lifetime_xp?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
          xp_to_next_level?: number
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          activated_at: string | null
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_used: boolean | null
          plan_id: string
          user_id: string | null
        }
        Insert: {
          activated_at?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          plan_id: string
          user_id?: string | null
        }
        Update: {
          activated_at?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          plan_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_transactions: {
        Row: {
          action_type: string
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: {
          _action_type: string
          _amount: number
          _description?: string
          _reference_id?: string
          _user_id: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      coworking_tier: "basic" | "standard" | "premium" | "vip"
      station_type:
        | "ps4"
        | "ps5"
        | "vr_racing"
        | "vr_immersive"
        | "mobile_esports"
      tournament_status:
        | "upcoming"
        | "registration"
        | "in_progress"
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
      app_role: ["admin", "moderator", "user"],
      coworking_tier: ["basic", "standard", "premium", "vip"],
      station_type: [
        "ps4",
        "ps5",
        "vr_racing",
        "vr_immersive",
        "mobile_esports",
      ],
      tournament_status: [
        "upcoming",
        "registration",
        "in_progress",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
