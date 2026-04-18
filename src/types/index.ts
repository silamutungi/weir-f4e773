export type DetectionStatus = 'pending' | 'approved' | 'takedown' | 'monetized' | 'disputed'

export interface Detection {
  id: string
  user_id: string
  platform: string
  url: string
  title: string
  thumbnail_url: string | null
  status: DetectionStatus
  match_confidence: number
  detected_at: string
  created_at: string
  deleted_at: string | null
}

export interface License {
  id: string
  user_id: string
  name: string
  platform: string
  usage_type: string
  price_usd: number
  duration_days: number
  terms: string
  active: boolean
  created_at: string
  deleted_at: string | null
}

export interface Earning {
  id: string
  user_id: string
  detection_id: string | null
  platform: string
  amount_usd: number
  cpm: number
  impressions: number
  earned_at: string
  created_at: string
}

export interface Dispute {
  id: string
  user_id: string
  detection_id: string
  reason: string
  status: 'open' | 'under_review' | 'resolved' | 'rejected'
  resolution_notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  display_name: string
  bio: string
  platform_handles: Record<string, string>
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}
