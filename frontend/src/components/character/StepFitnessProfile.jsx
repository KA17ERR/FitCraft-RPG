import PixelInput from "../PixelInput";
import OptionCard from "./OptionCard";
import { cx } from "../../utils/cx";
import { FlameIcon, ShieldIcon, StarIcon } from "../icons/PixelIcons";

const EXPERIENCE_OPTIONS = [
  {
    value: "beginner",
    title: "Beginner",
    description: "New to training, or getting back into it.",
    icon: <StarIcon size={18} />,
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "Training consistently for a while now.",
    icon: <ShieldIcon size={18} />,
  },
  {
    value: "advanced",
    title: "Advanced",
    description: "Experienced with structured, heavy training.",
    icon: <FlameIcon size={18} />,
  },
];

/**
 * STEP 1 — Fitness Profile
 * Collects height, current weight, and self-rated fitness experience.
 * Fully controlled: all state and unit-conversion logic lives in the
 * parent (CharacterCreate) so this stays a dumb, easy-to-extend view.
 */
export default function StepFitnessProfile({ data, errors, touched, onChange, onBlur }) {
  const isImperialHeight = data.heightUnit === "imperial";
  const isImperialWeight = data.weightUnit === "imperial";

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-[10px] uppercase tracking-widest text-muted">Height</span>
          <UnitToggle
            value={data.heightUnit}
            onChange={(unit) => onChange({ heightUnit: unit })}
            options={[
              { value: "metric", label: "cm" },
              { value: "imperial", label: "ft/in" },
            ]}
          />
        </div>

        {isImperialHeight ? (
          <div className="grid grid-cols-2 gap-3">
            <PixelInput
              label="Feet"
              type="number"
              name="heightFeet"
              value={data.heightImperial.feet}
              onChange={(e) =>
                onChange({ heightImperial: { ...data.heightImperial, feet: e.target.value } })
              }
              onBlur={() => onBlur("height")}
              error={touched.height ? errors.height : ""}
              placeholder="5"
            />
            <PixelInput
              label="Inches"
              type="number"
              name="heightInches"
              value={data.heightImperial.inches}
              onChange={(e) =>
                onChange({ heightImperial: { ...data.heightImperial, inches: e.target.value } })
              }
              onBlur={() => onBlur("height")}
              error=""
              placeholder="9"
            />
          </div>
        ) : (
          <PixelInput
            label="Centimeters"
            type="number"
            name="heightCm"
            value={data.heightCm}
            onChange={(e) => onChange({ heightCm: e.target.value })}
            onBlur={() => onBlur("height")}
            error={touched.height ? errors.height : ""}
            placeholder="175"
          />
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-[10px] uppercase tracking-widest text-muted">Current Weight</span>
          <UnitToggle
            value={data.weightUnit}
            onChange={(unit) => onChange({ weightUnit: unit })}
            options={[
              { value: "metric", label: "kg" },
              { value: "imperial", label: "lb" },
            ]}
          />
        </div>
        <PixelInput
          label={isImperialWeight ? "Pounds" : "Kilograms"}
          type="number"
          name="weight"
          value={data.weight}
          onChange={(e) => onChange({ weight: e.target.value })}
          onBlur={() => onBlur("weight")}
          error={touched.weight ? errors.weight : ""}
          placeholder={isImperialWeight ? "165" : "75"}
        />
      </div>

      <div>
        <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">
          Fitness Experience
        </span>
        <div role="radiogroup" aria-label="Fitness experience" className="space-y-2.5">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              selected={data.experience === opt.value}
              onSelect={() => {
                onChange({ experience: opt.value });
                onBlur("experience", opt.value);
              }}
            />
          ))}
        </div>
        {touched.experience && errors.experience && (
          <p className="mt-2 text-sm text-hp">{errors.experience}</p>
        )}
      </div>
    </div>
  );
}

function UnitToggle({ value, onChange, options }) {
  return (
    <div className="inline-flex border-2 border-border pixel-corners-sm">
      {options.map((opt, i) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cx(
            "px-2.5 py-1 font-heading text-[9px] uppercase tracking-widest transition-colors",
            value === opt.value ? "bg-accent text-[#fffffe]" : "bg-panel text-muted hover:text-[#fffffe]",
            i !== 0 && "border-l-2 border-border"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
