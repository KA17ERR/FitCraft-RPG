import OptionCard from "./OptionCard";
import { FlameIcon, DumbbellIcon, ShieldIcon, HeartIcon } from "../icons/PixelIcons";

const GOAL_OPTIONS = [
  {
    value: "lose_fat",
    title: "Lose Fat",
    description: "Trim down and reveal a leaner build.",
    icon: <FlameIcon size={18} />,
  },
  {
    value: "build_muscle",
    title: "Build Muscle",
    description: "Pack on strength and size over time.",
    icon: <DumbbellIcon size={18} />,
  },
  {
    value: "maintain_fitness",
    title: "Maintain Fitness",
    description: "Stay consistent and hold your current level.",
    icon: <ShieldIcon size={18} />,
  },
  {
    value: "improve_endurance",
    title: "Improve Endurance",
    description: "Build stamina for longer, harder efforts.",
    icon: <HeartIcon size={18} />,
  },
];

/**
 * STEP 2 — Fitness Goal
 * A single-select choice of the hero's primary quest line. Controlled by
 * the parent, same pattern as StepFitnessProfile, so later steps can reuse
 * OptionCard for their own single/multi-select choices.
 */
export default function StepFitnessGoal({ data, errors, touched, onChange, onBlur }) {
  return (
    <div>
      <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">
        Choose Your Quest
      </span>
      <div role="radiogroup" aria-label="Fitness goal" className="space-y-2.5">
        {GOAL_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            selected={data.goal === opt.value}
            onSelect={() => {
              onChange({ goal: opt.value });
              onBlur("goal", opt.value);
            }}
          />
        ))}
      </div>
      {touched.goal && errors.goal && <p className="mt-2 text-sm text-hp">{errors.goal}</p>}
    </div>
  );
}
