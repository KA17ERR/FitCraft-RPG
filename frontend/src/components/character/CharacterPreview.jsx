import Character from "./Character";

/**
 * CharacterPreview — the character customization screen's live preview.
 * Thin wrapper around the shared `Character` rig (the same component
 * used on the Dashboard, Workout Preview, and Workout screens) so the
 * hero shown here during creation is pixel-for-pixel the same rig the
 * player sees everywhere else, just standing in its idle pose.
 */
export default function CharacterPreview({ data, className = "" }) {
  return <Character data={data} pose="idle" playing className={className} />;
}
