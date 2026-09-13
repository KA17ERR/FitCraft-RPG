import OptionCard from "./OptionCard";
import { JOURNEYS } from "../../utils/characterOptions";

/**
 * STEP 4 — Choose Your Journey
 * A single-select choice between AI Assisted and Custom Build. Purely a UI
 * selection for now — no AI API call is wired up yet, this just records
 * the hero's preference in state for a later round to act on.
 */
export default function StepJourneyChoice({ data, errors, touched, onChange, onBlur }) {
  return (
    <div>
      <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">
        How would you like to start?
      </span>
      <div role="radiogroup" aria-label="Journey choice" className="space-y-2.5">
        {JOURNEYS.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            selected={data.journey === opt.value}
            onSelect={() => {
              onChange({ journey: opt.value });
              onBlur("journey");
            }}
          />
        ))}
      </div>
      {touched.journey && errors.journey && <p className="mt-2 text-sm text-hp">{errors.journey}</p>}
    </div>
  );
}
