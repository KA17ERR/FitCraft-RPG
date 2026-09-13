import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelCard from "../components/PixelCard";
import PixelButton from "../components/PixelButton";
import Badge from "../components/Badge";
import CreationProgress from "../components/character/CreationProgress";
import StepFitnessProfile from "../components/character/StepFitnessProfile";
import StepFitnessGoal from "../components/character/StepFitnessGoal";
import StepCharacterCustomization from "../components/character/StepCharacterCustomization";
import StepJourneyChoice from "../components/character/StepJourneyChoice";
import { DumbbellIcon, QuestIcon, ShieldIcon, SwordIcon, StarIcon } from "../components/icons/PixelIcons";
import { STEP_VALIDATORS } from "../utils/characterValidation";
import { useToast } from "../context/ToastContext";
import { useCharacter } from "../context/CharacterContext";

// ---------------------------------------------------------------------
// Step registry — this is the single place to extend the flow later
// (e.g. an AI-generated plan step). Each entry needs: key, label
// (progress indicator), icon, fields (for touched/blur bookkeeping), and
// the component that renders it. The component always receives
// { data, errors, touched, onChange, onBlur }.
// ---------------------------------------------------------------------
const STEPS = [
  {
    key: "profile",
    label: "Profile",
    icon: <DumbbellIcon size={16} />,
    fields: ["height", "weight", "experience"],
    subtitle: "Tell us about yourself so we can build your stats.",
    Component: StepFitnessProfile,
  },
  {
    key: "goal",
    label: "Goal",
    icon: <QuestIcon size={16} />,
    fields: ["goal"],
    subtitle: "What's the main quest you're training for?",
    Component: StepFitnessGoal,
  },
  {
    key: "customization",
    label: "Hero",
    icon: <ShieldIcon size={16} />,
    fields: ["bodyType", "skinTone", "hairColor", "hairstyle", "outfit"],
    subtitle: "Customize your hero's look. Changes preview live.",
    Component: StepCharacterCustomization,
  },
  {
    key: "journey",
    label: "Journey",
    icon: <SwordIcon size={16} />,
    fields: ["journey"],
    subtitle: "One last choice before your legend begins.",
    Component: StepJourneyChoice,
  },
];

const INITIAL_DATA = {
  // Step 1 — Fitness Profile
  heightUnit: "metric", // "metric" (cm) | "imperial" (ft/in)
  heightCm: "",
  heightImperial: { feet: "", inches: "" },
  weightUnit: "metric", // "metric" (kg) | "imperial" (lb)
  weight: "",
  experience: "", // "beginner" | "intermediate" | "advanced"

  // Step 2 — Fitness Goal
  goal: "", // "lose_fat" | "build_muscle" | "maintain_fitness" | "improve_endurance"

  // Step 3 — Character Customization
  bodyType: "", // "lean" | "athletic" | "mighty"
  skinTone: "",
  hairColor: "",
  hairstyle: "", // "bald" | "short" | "long" | "mohawk" | "ponytail"
  outfit: "", // "warrior" | "runner" | "monk" | "tech"
  accessories: [], // any of "headband" | "gloves" | "cape" | "glasses"

  // Step 4 — Choose Your Journey
  journey: "", // "ai_assisted" | "custom_build"
};

export default function CharacterCreate() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { fullData: savedCharacter, saveCharacter } = useCharacter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  // If the hero already has a saved build (e.g. they navigated back here to
  // tweak their look), start from that instead of a blank sheet. New heroes
  // with nothing saved yet still get the plain INITIAL_DATA.
  const [data, setData] = useState(() => (savedCharacter ? { ...INITIAL_DATA, ...savedCharacter } : INITIAL_DATA));
  const [touched, setTouched] = useState({});

  const currentStep = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const errors = useMemo(() => {
    const validator = STEP_VALIDATORS[currentStep.key];
    return validator ? validator(data) : {};
  }, [currentStep.key, data]);

  function updateData(patch) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function touchAllCurrentFields() {
    setTouched((prev) => {
      const next = { ...prev };
      currentStep.fields.forEach((f) => {
        next[f] = true;
      });
      return next;
    });
  }

  function isCurrentStepValid() {
    return Object.values(errors).every((msg) => !msg);
  }

  function handleNext() {
    touchAllCurrentFields();
    if (!isCurrentStepValid()) return;

    if (isLastStep) {
      // Persist the finished build to CharacterContext — the same shared,
      // per-user state the Dashboard and every in-game sprite read from —
      // so it's there immediately on the next screen and survives
      // navigation, refreshes, and logout/login.
      saveCharacter(data);
      showToast({
        title: "Hero Created!",
        description:
          data.journey === "ai_assisted"
            ? "FitCraft will build your personalized plan next."
            : "Time to start building your own path.",
        type: "success",
      });
      navigate("/dashboard");
      return;
    }

    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function handleBack() {
    if (isFirstStep) return;
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const StepComponent = currentStep.Component;

  return (
    <div className="relative z-10 min-h-screen overflow-hidden px-4 py-10 sm:py-14">
      {/* backdrop grid glow — a light extra flourish specific to this
          screen; it layers on top of the shared global RPGWorldBackground
          (see App.jsx) rather than replacing it, since this wrapper no
          longer paints its own opaque background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(253,224,71,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(253,224,71,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 20%, black, transparent 75%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="pixel-corners-sm flex h-9 w-9 items-center justify-center border-2 border-accent-light bg-accent/20">
              <StarIcon size={20} />
            </span>
            <span className="font-heading text-xs uppercase tracking-widest text-[#fffffe]">
              FitCraft <span className="text-accent-light">RPG</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <PixelCard variant="accent" className="pixel-scanlines">
            <div className="mb-6 text-center">
              <Badge variant="xp" size="sm" icon={<StarIcon size={12} />} className="mb-3">
                Character Creation
              </Badge>
              <h1 className="pixel-text-shadow font-heading text-lg uppercase text-[#fffffe] sm:text-xl">
                Forge Your Hero
              </h1>
              <p className="mt-2 text-base text-muted">{currentStep.subtitle}</p>
            </div>

            <div className="mb-8">
              <CreationProgress steps={STEPS} currentIndex={stepIndex} />
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep.key}
                  custom={direction}
                  initial={{ opacity: 0, x: 40 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * direction }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <StepComponent
                    data={data}
                    errors={errors}
                    touched={touched}
                    onChange={updateData}
                    onBlur={markTouched}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex gap-3">
              {!isFirstStep && (
                <div className="flex-1">
                  <PixelButton variant="secondary" fullWidth onClick={handleBack}>
                    Back
                  </PixelButton>
                </div>
              )}
              <div className="flex-1">
                <PixelButton fullWidth onClick={handleNext}>
                  {isLastStep ? "Enter FitCraft" : "Next"}
                </PixelButton>
              </div>
            </div>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}
