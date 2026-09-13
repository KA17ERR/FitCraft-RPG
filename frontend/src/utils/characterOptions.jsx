// Shared option data for Character Customization (Step 3) and Journey
// Choice (Step 4). Centralized here so the preview, the step UI, and
// validation all read from one source of truth — add a new swatch or
// option by editing this file only.

import {
  DumbbellIcon,
  ShieldIcon,
  FlameIcon,
  StarIcon,
  SwordIcon,
  WaterDropIcon,
  ChartIcon,
} from "../components/icons/PixelIcons";

export const BODY_TYPES = [
  { value: "lean", title: "Lean", description: "Slim, agile build.", torsoWidth: 34, armWidth: 8 },
  { value: "athletic", title: "Athletic", description: "Balanced, toned build.", torsoWidth: 42, armWidth: 10 },
  { value: "mighty", title: "Mighty", description: "Broad, powerful build.", torsoWidth: 50, armWidth: 13 },
];

// Skin tone swatches — a small, respectful spread of tones.
export const SKIN_TONES = [
  { value: "porcelain", hex: "#ffe0bd" },
  { value: "fair", hex: "#f1c27d" },
  { value: "tan", hex: "#e0ac69" },
  { value: "brown", hex: "#c68642" },
  { value: "deep", hex: "#8d5524" },
  { value: "espresso", hex: "#5a3825" },
];

export const HAIR_COLORS = [
  { value: "black", hex: "#1a1a1a" },
  { value: "brown", hex: "#4a2c1a" },
  { value: "blonde", hex: "#e8c26a" },
  { value: "red", hex: "#a84b2a" },
  { value: "silver", hex: "#c7cbd6" },
  { value: "teal", hex: "#3ecfc0" },
];

export const HAIRSTYLES = [
  { value: "bald", title: "Bald" },
  { value: "short", title: "Short" },
  { value: "long", title: "Long" },
  { value: "mohawk", title: "Mohawk" },
  { value: "ponytail", title: "Ponytail" },
];

export const OUTFITS = [
  {
    value: "warrior",
    title: "Warrior",
    description: "Battle-worn crimson armor.",
    icon: <SwordIcon size={18} />,
    primary: "#b3452f",
    secondary: "#7a2c1d",
  },
  {
    value: "runner",
    title: "Runner",
    description: "Light gear built for speed.",
    icon: <WaterDropIcon size={18} />,
    primary: "#3e7ecf",
    secondary: "#254e82",
  },
  {
    value: "monk",
    title: "Monk",
    description: "Calm, disciplined robes.",
    icon: <FlameIcon size={18} />,
    primary: "#d68a3c",
    secondary: "#8a5623",
  },
  {
    value: "tech",
    title: "Tech",
    description: "Futuristic training suit.",
    icon: <ChartIcon size={18} />,
    primary: "#3ecfc0",
    secondary: "#1f7a70",
  },
];

export const ACCESSORIES = [
  { value: "headband", label: "Headband", icon: <StarIcon size={14} /> },
  { value: "gloves", label: "Gloves", icon: <DumbbellIcon size={14} /> },
  { value: "cape", label: "Cape", icon: <ShieldIcon size={14} /> },
  { value: "glasses", label: "Glasses", icon: <ChartIcon size={14} /> },
];

export const JOURNEYS = [
  {
    value: "ai_assisted",
    title: "AI Assisted",
    description: "Let FitCraft build a personalized plan for you automatically.",
    icon: <StarIcon size={20} />,
  },
  {
    value: "custom_build",
    title: "Custom Build",
    description: "Design your own training path by hand, step by step.",
    icon: <DumbbellIcon size={20} />,
  },
];

export function findOption(list, value) {
  return list.find((opt) => opt.value === value);
}

// The single canonical fallback look, used whenever a screen needs to show
// *a* hero before/without a saved character (or if a saved character is
// missing a field). Every other spot that used to hardcode this same shape
// (Dashboard's old MOCK_CHARACTER, ExerciseCharacter's old MOCK_CHARACTER,
// ExerciseAnimation's local DEFAULT_CHARACTER) now imports it from here
// instead, so there's exactly one default to keep in sync.
export const DEFAULT_CHARACTER = {
  bodyType: "athletic",
  skinTone: "tan",
  hairColor: "brown",
  hairstyle: "short",
  outfit: "warrior",
  accessories: [],
};

// The subset of character-creation fields that actually affect how the
// sprite looks. Used to pull just the visual data out of the full
// onboarding payload (which also includes fitness profile/goal/journey).
export const CHARACTER_VISUAL_KEYS = [
  "bodyType",
  "skinTone",
  "hairColor",
  "hairstyle",
  "outfit",
  "accessories",
];
