import PixelCard from "./PixelCard";
import Badge from "./Badge";
import ExerciseCharacter from "./ExerciseCharacter";
import { LockIcon } from "./icons/PixelIcons";
import { cx } from "../utils/cx";

/**
 * EmotesPanel — the "Emotes" section: a preview stage (the shared
 * character sprite performing whichever emote is selected) plus a grid of
 * every emote in the catalog. Unlocked emotes are clickable and play on
 * the stage; locked ones are dimmed, badge as "Locked", and show a lock
 * icon instead of their real icon. Reuses the existing character sprite
 * (via ExerciseCharacter's `pose` prop) rather than any new art — only
 * one instance animates at a time, so this stays lightweight even as the
 * catalog grows.
 */
export default function EmotesPanel({ emotes, unlockedIds, activeEmoteId, onSelect }) {
  const activeEmote = emotes.find((e) => e.id === activeEmoteId && unlockedIds.includes(e.id)) || null;
  const unlockedCount = emotes.filter((e) => unlockedIds.includes(e.id)).length;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="pixel-text-shadow font-heading text-sm uppercase tracking-widest text-[#fffffe] sm:text-base">
          Emotes
        </h2>
        <Badge variant="accent" size="sm">
          {unlockedCount}/{emotes.length} Unlocked
        </Badge>
      </div>

      {/* preview stage */}
      <PixelCard variant="panel" className="mb-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex h-28 w-24 shrink-0 items-end justify-center">
            {activeEmote ? (
              <ExerciseCharacter pose={activeEmote.pose} className="h-full w-full" />
            ) : (
              <ExerciseCharacter className="h-full w-full opacity-70" />
            )}
          </div>
          <p className="text-center font-heading text-[10px] uppercase tracking-widest text-muted sm:text-right">
            {activeEmote ? `Playing: ${activeEmote.name}` : "Tap an unlocked emote to preview it"}
          </p>
        </div>
      </PixelCard>

      {/* emote grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {emotes.map((emote) => {
          const unlocked = unlockedIds.includes(emote.id);
          const isActive = unlocked && activeEmoteId === emote.id;
          const Icon = emote.icon;
          return (
            <button
              key={emote.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(emote.id)}
              aria-pressed={isActive}
              className="text-left disabled:cursor-not-allowed"
            >
              <PixelCard
                variant={isActive ? "accent" : unlocked ? "raised" : "panel"}
                interactive={unlocked}
                className={cx(!unlocked && "opacity-60")}
              >
                <div className="flex flex-col items-center gap-2 py-1 text-center">
                  <div className="flex h-9 w-9 items-center justify-center border-2 border-border bg-ink pixel-corners-sm">
                    {unlocked ? <Icon size={18} /> : <LockIcon size={16} />}
                  </div>
                  <span className="truncate font-heading text-[10px] uppercase tracking-widest text-[#fffffe]">
                    {emote.name}
                  </span>
                  <Badge variant={unlocked ? "success" : "default"} size="sm">
                    {unlocked ? "Ready" : "Locked"}
                  </Badge>
                </div>
              </PixelCard>
            </button>
          );
        })}
      </div>
    </section>
  );
}
