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
// pixel-art icon set already in the app (no new/copyrighted assets).
// `pose` names one of the shared Character rig's own poses (the same
// rig/pose system every workout exercise uses) — so each emote actually
// moves the hero's joints into a distinct stance (arm up, arms bent into
// a curl, elbows out, legs airborne, etc.) instead of just wobbling the
// same frozen idle sprite from the outside at a different rhythm.
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
    pose: "thumbs-up",
  },
  {
    id: "flex",
    name: "Flex",
    icon: DumbbellIcon,
    pose: "flex",
  },
  {
    id: "victory",
    name: "Victory",
    icon: TrophyIcon,
    pose: "victory",
  },
  {
    id: "muscle-pose",
    name: "Muscle Pose",
    icon: FlameIcon,
    pose: "muscle-pose",
  },
  {
    id: "jump",
    name: "Jump",
    icon: LevelUpIcon,
    pose: "jump",
  },
  {
    id: "celebration",
    name: "Celebration",
    icon: StarIcon,
    // Reuses the rig's existing "celebrate" pose (arms thrown up,
    // energetic hop) — the same one already used for quest completion.
    pose: "celebrate",
  },
  {
    id: "happy-dance",
    name: "Happy Dance",
    icon: HeartIcon,
    pose: "happy-dance",
  },
];

export const DEFAULT_UNLOCKED_EMOTE_IDS = EMOTES.filter((e) => e.unlockedByDefault).map((e) => e.id);
