import {
  Dumbbell, Settings, Trophy, Gem,
} from "lucide-react";

// ------------------------------------------------------------
// WORKOUT PLAN — WorkoutPlan.jsx
// Static UI constants only. Actual plan/exercise data comes from
// GET /api/workout/my-plan (see services/api.js -> workoutAPI)
// ------------------------------------------------------------

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MUSCLE_FILTERS = [
  "All", "Chest", "Back", "Shoulders",
  "Quads", "Hamstrings", "Glutes",
  "Biceps", "Triceps", "Core", "Calves",
];

// ------------------------------------------------------------
// PROGRESS — Progress.jsx
// Static UI constant only. Actual progress logs come from
// GET /api/progress/my (see services/api.js -> progressAPI)
// ------------------------------------------------------------

export const PERIOD_OPTIONS = ["Week", "Month", "3 Months", "Year"];

// ------------------------------------------------------------
// MEMBERSHIP — Membership.jsx
// Static plan/pricing config (like a pricing table), not user data.
// The member's actual current plan & billing history come from
// GET /api/membership/my and GET /api/membership/payments.
// ------------------------------------------------------------

export const UPGRADE_PLANS = [
  {
    name:     "Monthly",
    price:    "Rs. 2,500",
    period:   "/ month",
    current:  true,
    features: ["Full gym access", "Workout plan", "Progress tracking", "Email notifications"],
  },
  {
    name:     "Quarterly",
    price:    "Rs. 6,500",
    period:   "/ 3 months",
    current:  false,
    features: ["Full gym access", "Workout plan", "Progress tracking", "Email notifications", "Priority trainer support"],
  },
  {
    name:     "Annual",
    price:    "Rs. 22,000",
    period:   "/ year",
    current:  false,
    features: ["Full gym access", "Workout plan", "Progress tracking", "Email notifications", "Priority trainer support", "Free fitness assessment"],
  },
];

// ------------------------------------------------------------
// NOTIFICATIONS — Notifications.jsx
// Static UI constants only. Actual notifications come from
// GET /api/notifications/my (see services/api.js -> notificationAPI)
// ------------------------------------------------------------

export const NOTIFICATION_FILTER_TABS = [
  "All", "Workouts", "Membership", "System", "Achievements",
];

export const NOTIFICATION_TYPE_MAP = {
  workout:     { icon: Dumbbell, cls: "nf-icon-workout"     },
  membership:  { icon: Gem, cls: "nf-icon-membership"  },
  system:      { icon: Settings, cls: "nf-icon-system"      },
  achievement: { icon: Trophy, cls: "nf-icon-achievement" },
};

export const NOTIFICATION_FILTER_TYPE_MAP = {
  All:          null,
  Workouts:     "workout",
  Membership:   "membership",
  System:       "system",
  Achievements: "achievement",
};
