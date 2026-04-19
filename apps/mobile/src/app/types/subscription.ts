// Subscription Plan Type
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity_per_day?: number;
  delivery_frequency?: string;
  pickup_enabled?: boolean;
  pickup_time_start?: string;
  pickup_time_end?: string;
  created_at?: string;
  updated_at?: string;
}

// Flower Bundle Type
export interface FlowerBundle {
  id: string;
  plan_id: string;
  bundle_name: string;
  description?: string;
  image_url?: string;
  contents?: string;
  badge?: string | null;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

// User Subscription Type (active subscription)
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'paused' | 'cancelled';
  start_date: string;
  next_billing_date: string;
  daily_selections: DailySelections;
  created_at?: string;
  updated_at?: string;
}

// Daily selections - key is date (YYYY-MM-DD), value is bundle_id
export interface DailySelections {
  [date: string]: string; // date string => bundle_id
}

// Delivery Schedule Type
export interface DeliverySchedule {
  id: string;
  subscription_id: string;
  delivery_date: string;
  flower_bundle_id?: string;
  status: 'pending' | 'delivered' | 'old_flowers_picked';
  pickup_time_slot?: string;
  created_at?: string;
  updated_at?: string;
}

// Extended types for UI
export interface SubscriptionWithBundles extends SubscriptionPlan {
  flower_bundles?: FlowerBundle[];
}

export interface SubscriptionSelectionState {
  planId: string;
  plan?: SubscriptionPlan;
  dailySelections: DailySelections;
  selectedMonth: Date;
}

export interface NextDayModificationState {
  nextDate: string;
  currentBundleId?: string;
  availableBundles: FlowerBundle[];
}
