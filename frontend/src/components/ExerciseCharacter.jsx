import Character from "./character/Character";
import { useCharacter } from "../context/CharacterContext";

/**
 * ExerciseCharacter — thin wrapper around the shared pixel-art `Character`
 * rig for the screens that show the hero performing a lightweight
 * (non-workout) animation: emotes (EmotesPanel/EmoteUnlockModal) and the
 * quest-complete celebration (QuestCompleteModal).
 *
 * `pose` names one of the rig's own poses (see character/Character.jsx —
 * the same rig/pose system every workout exercise already uses), so each
 * emote genuinely moves the hero's joints into a distinct stance instead
 * of just wobbling a frozen idle sprite from the outside at a different
 * rhythm. `celebrate` reuses the rig's existing "celebrate" pose (arms
 * thrown up, energetic hop). With neither set, the rig just holds its
 * normal idle sway. Purely presentational, no gameplay logic.
 */
export default function ExerciseCharacter({ celebrate = false, pose = null, className = "" }) {
  // Reads the same saved build as the Dashboard and Character Creator —
  // emotes and quest celebrations always show the hero's actual look.
  const { character } = useCharacter();
  const activePose = pose || (celebrate ? "celebrate" : "idle");

  return (
    <div className={className}>
      <Character data={character} pose={activePose} playing className="h-full w-full" />
    </div>
  );
}
