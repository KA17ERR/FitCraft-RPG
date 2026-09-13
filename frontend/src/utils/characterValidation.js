// Client-side validation for the Character Creation flow.
// Kept separate from utils/validation.js (auth forms) since the rules,
// unit conversions, and error copy here are specific to hero stats.

const HEIGHT_CM_MIN = 120;
const HEIGHT_CM_MAX = 230;
const WEIGHT_KG_MIN = 30;
const WEIGHT_KG_MAX = 300;

export const LBS_PER_KG = 2.20462;
export const CM_PER_IN = 2.54;

export function cmToFeetInches(cm) {
  const totalInches = cm / CM_PER_IN;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToCm(feet, inches) {
  const totalInches = Number(feet || 0) * 12 + Number(inches || 0);
  return totalInches * CM_PER_IN;
}

export function kgToLbs(kg) {
  return kg * LBS_PER_KG;
}

export function lbsToKg(lbs) {
  return lbs / LBS_PER_KG;
}

/**
 * Validates a height field. `unit` is "metric" (cm) or "imperial" (ft/in).
 * `value` is either a cm number/string (metric) or { feet, inches } (imperial).
 */
export function validateHeight(unit, value) {
  if (unit === "imperial") {
    const { feet, inches } = value || {};
    if (feet === "" || feet === undefined || feet === null) return "Enter your height";
    const cm = feetInchesToCm(feet, inches || 0);
    if (Number.isNaN(cm) || cm <= 0) return "Enter a valid height";
    if (cm < HEIGHT_CM_MIN || cm > HEIGHT_CM_MAX) return "Height must be between 3'11\" and 7'6\"";
    return "";
  }

  const raw = value;
  if (raw === "" || raw === undefined || raw === null) return "Enter your height";
  const cm = Number(raw);
  if (Number.isNaN(cm) || cm <= 0) return "Enter a valid height";
  if (cm < HEIGHT_CM_MIN || cm > HEIGHT_CM_MAX) return `Height must be between ${HEIGHT_CM_MIN}–${HEIGHT_CM_MAX} cm`;
  return "";
}

/**
 * Validates a weight field. `unit` is "metric" (kg) or "imperial" (lb).
 */
export function validateWeight(unit, value) {
  if (value === "" || value === undefined || value === null) return "Enter your current weight";
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return "Enter a valid weight";

  const kg = unit === "imperial" ? lbsToKg(num) : num;
  if (kg < WEIGHT_KG_MIN || kg > WEIGHT_KG_MAX) {
    return unit === "imperial"
      ? `Weight must be between ${Math.round(kgToLbs(WEIGHT_KG_MIN))}–${Math.round(kgToLbs(WEIGHT_KG_MAX))} lb`
      : `Weight must be between ${WEIGHT_KG_MIN}–${WEIGHT_KG_MAX} kg`;
  }
  return "";
}

export function validateExperience(value) {
  if (!value) return "Choose your fitness experience";
  return "";
}

export function validateGoal(value) {
  if (!value) return "Choose a fitness goal";
  return "";
}

export function validateRequiredChoice(value, message) {
  return value ? "" : message;
}

// Per-step validators, keyed the same way the step definitions are keyed in
// CharacterCreate.jsx. Each returns a { field: message } error map — an
// empty message means that field is valid. Add an entry here whenever a
// new step is added to the flow.
export const STEP_VALIDATORS = {
  profile: (data) => ({
    height: validateHeight(data.heightUnit, data.heightUnit === "imperial" ? data.heightImperial : data.heightCm),
    weight: validateWeight(data.weightUnit, data.weight),
    experience: validateExperience(data.experience),
  }),
  goal: (data) => ({
    goal: validateGoal(data.goal),
  }),
  customization: (data) => ({
    bodyType: validateRequiredChoice(data.bodyType, "Choose a body type"),
    skinTone: validateRequiredChoice(data.skinTone, "Choose a skin tone"),
    hairColor: validateRequiredChoice(data.hairColor, "Choose a hair color"),
    hairstyle: validateRequiredChoice(data.hairstyle, "Choose a hairstyle"),
    outfit: validateRequiredChoice(data.outfit, "Choose an outfit"),
    // accessories is intentionally optional — a hero can go without any.
  }),
  journey: (data) => ({
    journey: validateRequiredChoice(data.journey, "Choose how you'd like to start"),
  }),
};

export function isStepValid(stepKey, data) {
  const validator = STEP_VALIDATORS[stepKey];
  if (!validator) return true;
  return Object.values(validator(data)).every((msg) => !msg);
}
