import { motion } from "framer-motion";
import CharacterPreview from "./character/CharacterPreview";
import { useCharacter } from "../context/CharacterContext";

/**
 * ExerciseCharacter — wraps the pixel-art CharacterPreview sprite with a
 * squat/rep bounce loop while a workout is active, a calmer idle sway
 * otherwise, an energetic little victory hop when `celebrate` is set
 * (used by QuestCompleteModal), or any custom `pose` — a plain
 * `{ animate, transition }` framer-motion pair — for playing back an
 * unlocked emote (used by EmotesPanel/EmoteUnlockModal). Purely
 * presentational, no gameplay logic.
 */
export default function ExerciseCharacter({ active = false, celebrate = false, pose = null, className = "" }) {
  // Reads the same saved build as the Dashboard and Character Creator —
  // emotes and quest celebrations always show the hero's actual look.
  const { character } = useCharacter();
  const { animate, transition } = pose
    ? pose
    : celebrate
      ? {
          animate: { y: [0, -14, 0, -8, 0], rotate: [0, -6, 6, -4, 0], scaleY: [1, 1.05, 0.95, 1.05, 1] },
          transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
        }
      : active
        ? {
            animate: { scaleY: [1, 0.86, 1], y: [0, 6, 0] },
            transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
          }
        : {
            animate: { y: [0, -4, 0], rotate: [0, -1, 1, 0] },
            transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
          };

  return (
    <div className={className}>
      <motion.div
        animate={animate}
        transition={transition}
        style={{ transformOrigin: "bottom center" }}
        className="h-full w-full"
      >
        <CharacterPreview data={character} className="h-full w-full" />
      </motion.div>
    </div>
  );
}
