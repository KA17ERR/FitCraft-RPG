import {
  DumbbellIcon,
  TrophyIcon,
  StarIcon,
  CheckIcon,
  LevelUpIcon,
  FlameIcon,
  HeartIcon,
} from "../components/icons/PixelIcons";

// ---------------------------------------------------------------------
// Emote catalog — frontend-only mock data. Each emote reuses the same
// pixel-art icon set already in the app (no new/copyrighted assets) and
// a lightweight `pose` — a plain transform (x/y/rotate/scale) keyframe
// list applied to the existing character sprite via ExerciseCharacter's
// `pose` prop. No new sprites or media, just different motion on the
// character we already have.
//
// Listed in unlock order: the first entry is unlocked from the start,
// and each exercise completion unlocks the next locked entry in order.
// ---------------------------------------------------------------------

export const EMOTES = [
  {
    id: "thumbs-up",
    name: "Thumbs Up",
    icon: CheckIcon,
    unlockedByDefault: true,
    pose: {
      animate: { y: [0, -4, 0], scale: [1, 1.04, 1] },
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "flex",
    name: "Flex",
    icon: DumbbellIcon,
    pose: {
      animate: { scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "victory",
    name: "Victory",
    icon: TrophyIcon,
    pose: {
      animate: { y: [0, -10, 0], rotate: [0, 5, -5, 0] },
      transition: { duration: 1.1, repeat: Infinity, ease: "easeOut" },
    },
  },
  {
    id: "muscle-pose",
    name: "Muscle Pose",
    icon: FlameIcon,
    pose: {
      animate: { scaleX: [1, 1.08, 1], rotate: [0, 4, -4, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "jump",
    name: "Jump",
    icon: LevelUpIcon,
    pose: {
      animate: { y: [0, -18, 0], scaleY: [1, 0.9, 1.05, 1] },
      transition: { duration: 0.8, repeat: Infinity, ease: "easeOut" },
    },
  },
  {
    id: "celebration",
    name: "Celebration",
    icon: StarIcon,
    pose: {
      animate: { y: [0, -12, 0, -6, 0], rotate: [0, -8, 8, -4, 0], scale: [1, 1.05, 1] },
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "happy-dance",
    name: "Happy Dance",
    icon: HeartIcon,
    pose: {
      animate: { x: [0, -6, 6, 0], rotate: [0, -5, 5, 0], y: [0, -3, 0] },
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
];

export const DEFAULT_UNLOCKED_EMOTE_IDS = EMOTES.filter((e) => e.unlockedByDefault).map((e) => e.id);
