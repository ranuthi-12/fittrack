// ============================================================
// landingData.js
// Static content for the Landing Page
// When backend is connected, STATS can be fetched from API
// ============================================================
import { IdCard, Dumbbell, BarChart3, Bell, Users, Settings, Star } from "lucide-react";

export const FEATURES = [
  {
    icon: IdCard,
    title: "Membership tracking",
    desc: "Buy, renew, and monitor your membership status and expiry date — all online, no paperwork.",
  },
  {
    icon: Dumbbell,
    title: "Personalized workout plans",
    desc: "Your trainer assigns a workout plan tailored to your goals. View it anytime from your dashboard.",
  },
  {
    icon: BarChart3,
    title: "Progress monitoring",
    desc: "Log your daily workouts and track how far you've come with clear, visual progress indicators.",
  },
  {
    icon: Bell,
    title: "Smart notifications",
    desc: "Get notified before your membership expires so you never miss a day at the gym.",
  },
  {
    icon: Users,
    title: "Trainer management",
    desc: "Trainers can manage members, assign plans, and monitor progress from a dedicated panel.",
  },
  {
    icon: Settings,
    title: "Admin control panel",
    desc: "Gym owners get a full dashboard to manage members, payments, trainers, and reports.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Register your account",
    desc: "Create a member account and choose your membership plan — monthly, quarterly, or annual.",
  },
  {
    step: "02",
    title: "Get your workout plan",
    desc: "Your assigned trainer builds a personalized workout plan for your fitness goals.",
  },
  {
    step: "03",
    title: "Track your progress",
    desc: "Log workouts daily and watch your progress grow with clear visual tracking tools.",
  },
];

export const PLANS = [
  {
    name: "Monthly",
    price: "Rs. 2,500",
    period: "/ month",
    features: [
      "Full gym access",
      "Workout plan",
      "Progress tracking",
      "Email notifications",
    ],
    highlighted: false,
  },
  {
    name: "Quarterly",
    price: "Rs. 6,500",
    period: "/ 3 months",
    features: [
      "Full gym access",
      "Workout plan",
      "Progress tracking",
      "Email notifications",
      "Priority trainer support",
    ],
    highlighted: true,
  },
  {
    name: "Annual",
    price: "Rs. 22,000",
    period: "/ year",
    features: [
      "Full gym access",
      "Workout plan",
      "Progress tracking",
      "Email notifications",
      "Priority trainer support",
      "Free fitness assessment",
    ],
    highlighted: false,
  },
];

// TODO: Replace with API call → GET /api/gym/stats
export const STATS = [
  { value: "200+", label: "Active members" },
  { value: "15+",  label: "Expert trainers" },
  { value: "98%",  label: "Renewal rate" },
  { value: "5",    label: "Member rating", icon: Star },
];

export const MEMBERSHIP_PLANS = [
  { value: "MONTHLY",   label: "Monthly — Rs. 2,500" },
  { value: "QUARTERLY", label: "Quarterly — Rs. 6,500" },
  { value: "ANNUAL",    label: "Annual — Rs. 22,000" },
];

export const LOGIN_BENEFITS = [
  "Track your membership status",
  "View your workout plan",
  "Monitor your progress",
];

export const REGISTER_BENEFITS = [
  "Choose your membership plan",
  "Get assigned a personal trainer",
  "Track progress from day one",
];
