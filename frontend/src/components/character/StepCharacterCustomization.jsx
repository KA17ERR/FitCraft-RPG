import PixelCard from "../PixelCard";
import OptionCard from "./OptionCard";
import ColorSwatchPicker from "./ColorSwatchPicker";
import ToggleChip from "./ToggleChip";
import CharacterPreview from "./CharacterPreview";
import { BODY_TYPES, SKIN_TONES, HAIR_COLORS, HAIRSTYLES, OUTFITS, ACCESSORIES } from "../../utils/characterOptions";

/**
 * STEP 3 — Character Customization
 * Every choice here feeds CharacterPreview directly through `data`, so the
 * sprite at the top updates live as the hero picks options. Accessories are
 * the one multi-select field (toggle on/off independently); everything
 * else is single-select via OptionCard/ColorSwatchPicker.
 */
export default function StepCharacterCustomization({ data, errors, touched, onChange, onBlur }) {
  function toggleAccessory(value) {
    const current = data.accessories || [];
    const next = current.includes(value) ? current.filter((a) => a !== value) : [...current, value];
    onChange({ accessories: next });
  }

  return (
    <div className="space-y-6">
      <PixelCard variant="raised">
        <div className="mx-auto flex h-48 w-32 items-center justify-center">
          <CharacterPreview data={data} className="h-full w-full" />
        </div>
      </PixelCard>

      <div>
        <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">Body Type</span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {BODY_TYPES.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              description={opt.description}
              selected={data.bodyType === opt.value}
              onSelect={() => {
                onChange({ bodyType: opt.value });
                onBlur("bodyType");
              }}
            />
          ))}
        </div>
        {touched.bodyType && errors.bodyType && <p className="mt-2 text-sm text-hp">{errors.bodyType}</p>}
      </div>

      <ColorSwatchPicker
        label="Skin Tone"
        options={SKIN_TONES}
        value={data.skinTone}
        onSelect={(value) => {
          onChange({ skinTone: value });
          onBlur("skinTone");
        }}
        error={touched.skinTone ? errors.skinTone : ""}
      />

      <ColorSwatchPicker
        label="Hair Color"
        options={HAIR_COLORS}
        value={data.hairColor}
        onSelect={(value) => {
          onChange({ hairColor: value });
          onBlur("hairColor");
        }}
        error={touched.hairColor ? errors.hairColor : ""}
      />

      <div>
        <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">Hairstyle</span>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {HAIRSTYLES.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              selected={data.hairstyle === opt.value}
              onSelect={() => {
                onChange({ hairstyle: opt.value });
                onBlur("hairstyle");
              }}
            />
          ))}
        </div>
        {touched.hairstyle && errors.hairstyle && <p className="mt-2 text-sm text-hp">{errors.hairstyle}</p>}
      </div>

      <div>
        <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">Outfit</span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {OUTFITS.map((opt) => (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              selected={data.outfit === opt.value}
              onSelect={() => {
                onChange({ outfit: opt.value });
                onBlur("outfit");
              }}
            />
          ))}
        </div>
        {touched.outfit && errors.outfit && <p className="mt-2 text-sm text-hp">{errors.outfit}</p>}
      </div>

      <div>
        <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">
          Accessories <span className="normal-case text-muted/70">(optional)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {ACCESSORIES.map((opt) => (
            <ToggleChip
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              selected={(data.accessories || []).includes(opt.value)}
              onToggle={() => toggleAccessory(opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
