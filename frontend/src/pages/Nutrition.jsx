import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PixelButton from "../components/PixelButton";
import PixelCard from "../components/PixelCard";
import PixelInput from "../components/PixelInput";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import GameNav from "../components/GameNav";
import EmptyState from "../components/EmptyState";
import {
  AppleIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  FlameIcon,
  SwordIcon,
  ShieldIcon,
  TargetIcon,
} from "../components/icons/PixelIcons";
import { FOOD_DATABASE, CATEGORIES, scaleFood, categoryLabel } from "../utils/foodDatabase";

// ---------------------------------------------------------------------
// This page frames food logging as managing the player's daily
// "Rations" rather than a plain calorie tracker: meals are ration
// slots, macros read like stat reserves (STR/STA/VIT), and the same
// add -> edit -> delete flow underneath is unchanged.
//
// Rations (add/edit/delete) are persisted per account, the same
// technique WaterContext/ProgressionContext use: localStorage keyed by
// user id, scoped to the current calendar day. That means:
//   - a brand-new account sees the starter sample rations below,
//   - logging out and back in (or refreshing) restores today's log,
//   - a new calendar day starts with an empty ration log instead of
//     yesterday's, and
//   - a second account never sees the first account's rations.
// ---------------------------------------------------------------------

const MEAL_META = {
  breakfast: { label: "Breakfast" },
  lunch: { label: "Lunch" },
  dinner: { label: "Dinner" },
  snacks: { label: "Snacks" },
};

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snacks"];

// Builds a logged ration entry the same way the Log Ration flow does: a
// snapshot of the food's per-serving macros plus the quantity-scaled
// totals actually shown/summed. Keeping `perServing` around means an
// existing (or legacy, pre-quantity) entry can still be edited later —
// its quantity can be changed and the totals rescale correctly.
function mealEntry(id, foodId, name, servingLabel, quantity, perServing) {
  return {
    id,
    foodId,
    name,
    servingLabel,
    quantity,
    perServing,
    ...scaleFood(perServing, quantity),
  };
}

const INITIAL_MEALS = {
  breakfast: [
    mealEntry("b1", null, "Oatmeal with Banana", "1 serving", 1, { calories: 320, protein: 10, carbs: 58, fats: 6 }),
    mealEntry("b2", null, "Scrambled Eggs (2)", "2 eggs", 1, { calories: 180, protein: 14, carbs: 2, fats: 12 }),
  ],
  lunch: [
    mealEntry("l1", null, "Grilled Chicken Bowl", "1 bowl", 1, { calories: 520, protein: 42, carbs: 48, fats: 14 }),
  ],
  dinner: [
    mealEntry("d1", null, "Salmon & Veggies", "1 plate", 1, { calories: 480, protein: 38, carbs: 22, fats: 24 }),
  ],
  snacks: [
    mealEntry("s1", null, "Greek Yogurt", "170g", 1, { calories: 140, protein: 12, carbs: 10, fats: 4 }),
    mealEntry("s2", null, "Almonds (1 oz)", "1 oz", 1, { calories: 160, protein: 6, carbs: 6, fats: 14 }),
  ],
};

const EMPTY_MEALS = { breakfast: [], lunch: [], dinner: [], snacks: [] };

// Keyed per-user (same technique as WaterContext/ProgressionContext) so a
// brand-new account starts with the starter sample rations instead of
// inheriting whatever the previous account logged on this device.
function storageKeyFor(userId) {
  return `fitcraft_nutrition_${userId}`;
}

// Local calendar day (not UTC) — same helper WaterContext/ProgressionContext
// use, so "a new day" for the ration log lines up with the user's clock.
function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function readStoredMeals(userId) {
  if (!userId) return INITIAL_MEALS;
  try {
    const raw = localStorage.getItem(storageKeyFor(userId));
    if (!raw) {
      // First time this account has ever been seen on this device — seed
      // it with the starter sample rations and persist immediately so
      // nothing else can race ahead of it.
      localStorage.setItem(storageKeyFor(userId), JSON.stringify({ date: todayKey(), meals: INITIAL_MEALS }));
      return INITIAL_MEALS;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.meals) return INITIAL_MEALS;
    // Only carry over today's log. A previous day's rations are stale —
    // today should start empty, not with yesterday's meals.
    return parsed.date === todayKey() ? parsed.meals : EMPTY_MEALS;
  } catch {
    return INITIAL_MEALS;
  }
}

const GOALS = { calories: 2400, protein: 150, carbs: 280, fats: 70 };

// Each macro reads as a player stat: Protein -> Strength, Carbs ->
// Stamina, Fat -> Vitality. Purely cosmetic framing over the same
// grams/goals used everywhere else.
const MACRO_META = {
  protein: { tag: "STR", icon: SwordIcon, accent: "from-hp to-[#ff9d9d]" },
  carbs: { tag: "STA", icon: TargetIcon, accent: "from-xp to-xp-light" },
  fats: { tag: "VIT", icon: ShieldIcon, accent: "from-gold to-xp-light" },
};

const EMPTY_DRAFT = { meal: "breakfast", food: null, quantity: 1, editingId: null };

function sumMeals(meals) {
  return MEAL_ORDER.reduce(
    (totals, key) => {
      for (const item of meals[key]) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fats += item.fats;
      }
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}

// A number that quietly "pops" in whenever its value changes — used
// everywhere a total updates (daily reserves, meal totals, stat bars)
// so progress changes read as a small confirming beat rather than an
// instant, silent swap. Deliberately not wrapped in AnimatePresence:
// this is an inline text swap, and animating an exit+enter pair inline
// would briefly overlap the old and new value; a plain keyed remount
// (old gone instantly, new pops in) reads cleaner at this size.
function PulseValue({ value, className = "" }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, scale: 0.82, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

function MacroBar({ label, tag, icon: Icon, value, goal, accent }) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-heading text-[9px] uppercase tracking-widest text-muted">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon size={11} className="text-border-light" />}
          {label}
          {tag && <span className="text-border-light">&middot; {tag}</span>}
        </span>
        <span className="text-[#fffffe]">
          <PulseValue value={value} />g <span className="text-muted">/ {goal}g</span>
        </span>
      </div>
      <div className={`h-2.5 w-full overflow-hidden border-2 border-border bg-ink pixel-corners-sm ${pct >= 100 ? "animate-glow-pulse" : ""}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${accent}`}
        />
      </div>
    </div>
  );
}

function FoodItemCard({ item, pulsing, onEdit, onDelete }) {
  return (
    <PixelCard
      variant="panel"
      interactive
      layout
      exit={{ opacity: 0, scale: 0.85, x: -10, transition: { duration: 0.2, ease: "easeIn" } }}
      className={`!p-3 ${pulsing ? "animate-glow-pulse" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate font-heading text-xs text-[#fffffe]">{item.name}</h4>
          <p className="mt-0.5 text-sm text-muted">
            {item.quantity}&times; {item.servingLabel}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 font-heading text-xs text-accent-light">
          <FlameIcon size={11} />
          <PulseValue value={item.calories} /> kcal
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1" title="Strength (protein)">
          <SwordIcon size={11} /> <PulseValue value={item.protein} />g
        </span>
        <span className="inline-flex items-center gap-1" title="Stamina (carbs)">
          <TargetIcon size={11} /> <PulseValue value={item.carbs} />g
        </span>
        <span className="inline-flex items-center gap-1" title="Vitality (fat)">
          <ShieldIcon size={11} /> <PulseValue value={item.fats} />g
        </span>
      </div>
      <div className="mt-2 flex items-center justify-end gap-3 border-t-2 border-border pt-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 font-heading text-[9px] uppercase tracking-widest text-muted transition-colors hover:text-accent-light"
        >
          <EditIcon size={12} /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 font-heading text-[9px] uppercase tracking-widest text-muted transition-colors hover:text-hp"
        >
          <TrashIcon size={12} /> Delete
        </button>
      </div>
    </PixelCard>
  );
}

function PreviewStat({ label, value }) {
  return (
    <div className="min-w-0 text-center">
      <p className="truncate font-heading text-xs text-accent-light">
        <PulseValue value={value} />
      </p>
      <p className="break-words font-heading text-[8px] uppercase leading-snug tracking-widest text-muted">
        {label}
      </p>
    </div>
  );
}

// ---- Log Ration wizard steps -----------------------------------------
// Three small, fully-controlled steps (meal -> search -> quantity),
// switched on by the parent's `step` state. None of these hold their
// own state, so they're safe to define once at module scope instead of
// being recreated (and remounted) on every Nutrition render.

function MealStep({ selectedMeal, onSelectMeal }) {
  return (
    <div>
      <span className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted">
        Which ration slot is this for?
      </span>
      <div className="flex flex-wrap gap-2">
        {MEAL_ORDER.map((key) => (
          <button key={key} type="button" onClick={() => onSelectMeal(key)}>
            <span
              className={`pixel-corners-sm flex items-center gap-1.5 border-2 px-2.5 py-1.5 font-heading text-[9px] uppercase tracking-widest transition-colors ${
                selectedMeal === key
                  ? "border-accent bg-accent/20 text-accent-light"
                  : "border-border bg-panel text-muted hover:border-border-light hover:text-[#fffffe]"
              }`}
            >
              {MEAL_META[key].label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FoodSearchStep({
  query,
  onQueryChange,
  category,
  onSelectCategory,
  foods,
  onSelectFood,
  mealLabel,
  onChangeMeal,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-[10px] uppercase tracking-widest text-muted">
          Logging to <span className="text-accent-light">{mealLabel}</span>
        </span>
        <button
          type="button"
          onClick={onChangeMeal}
          className="shrink-0 font-heading text-[9px] uppercase tracking-widest text-accent-light hover:text-accent"
        >
          Change Slot
        </button>
      </div>

      <PixelInput
        label="Search Rations"
        name="foodSearch"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="e.g. chicken, rice, banana..."
      />

      <div>
        <span className="mb-1.5 block font-heading text-[9px] uppercase tracking-widest text-muted">Category</span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" onClick={() => onSelectCategory(c.id)}>
              <span
                className={`pixel-corners-sm inline-block border-2 px-2 py-1 font-heading text-[8px] uppercase tracking-widest transition-colors ${
                  category === c.id
                    ? "border-accent bg-accent/20 text-accent-light"
                    : "border-border bg-panel text-muted hover:border-border-light hover:text-[#fffffe]"
                }`}
              >
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {foods.length > 0 ? (
          foods.map((food) => (
            <button key={food.id} type="button" onClick={() => onSelectFood(food)} className="block w-full text-left">
              <PixelCard variant="panel" interactive className="!p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-heading text-xs text-[#fffffe]">{food.name}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {food.servingLabel} &middot; {categoryLabel(food.category)}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 font-heading text-xs text-accent-light">
                    <FlameIcon size={11} />
                    {food.calories} kcal
                  </span>
                </div>
              </PixelCard>
            </button>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-muted">
            No rations match &quot;{query}&quot;{category !== "all" ? ` in ${categoryLabel(category)}` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}

function QuantityStep({ food, quantity, onQuantityChange, mealLabel, isEditing, onChangeFood, onSubmit, previewTotals }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm text-[#fffffe]">{food?.name}</p>
          <p className="text-sm text-muted">
            {food?.servingLabel} &middot; {mealLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeFood}
          className="shrink-0 font-heading text-[9px] uppercase tracking-widest text-accent-light hover:text-accent"
        >
          Change Ration
        </button>
      </div>

      <PixelInput
        label="Ration Size (servings)"
        type="number"
        name="quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(e.target.value)}
        placeholder="1"
        required
      />

      <div>
        <span className="mb-1.5 block font-heading text-[9px] uppercase tracking-widest text-muted">Ration Breakdown</span>
        <div className="grid grid-cols-2 gap-2 border-2 border-border bg-ink/60 p-3 pixel-corners-sm sm:grid-cols-4">
          <PreviewStat label="Calories" value={previewTotals.calories} />
          <PreviewStat label="Protein" value={`${previewTotals.protein}g`} />
          <PreviewStat label="Carbs" value={`${previewTotals.carbs}g`} />
          <PreviewStat label="Fat" value={`${previewTotals.fats}g`} />
        </div>
      </div>

      <PixelButton type="submit" variant="primary" icon={<PlusIcon size={14} />}>
        {isEditing ? "Save Changes" : `Log to ${mealLabel}`}
      </PixelButton>
    </form>
  );
}

export default function Nutrition() {
  const { user } = useAuth();
  const userId = user?.id || null;
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [loadedForUserId, setLoadedForUserId] = useState(userId);
  // Lazy initializer: resolves the correct starting log for "now" up
  // front, same pattern WaterContext uses.
  const [meals, setMeals] = useState(() => readStoredMeals(userId));

  // Re-derive state during render whenever the signed-in user changes, so
  // switching accounts never shows the previous user's rations for a
  // frame (same pattern as Water/Progression/CharacterContext).
  if (userId !== loadedForUserId) {
    setLoadedForUserId(userId);
    setMeals(readStoredMeals(userId));
  }

  // Persist on every change. Never fires on its own — only after setMeals
  // is called explicitly by an add/edit/delete below.
  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(storageKeyFor(userId), JSON.stringify({ date: todayKey(), meals }));
    } catch {
      // ignore storage failures (e.g. private browsing quota)
    }
  }, [meals, userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState("meal"); // "meal" | "search" | "quantity"
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Transient feel-good feedback state — neither of these affects the
  // actual ration data, they just drive short-lived animations:
  //  - pulsingId: the card that should glow (just logged or just edited)
  //  - rationGain: a "+123 kcal" flash next to a meal's total on add
  const [pulsingId, setPulsingId] = useState(null);
  const [rationGain, setRationGain] = useState(null);
  const pulseTimeoutRef = useRef(null);
  const gainTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(pulseTimeoutRef.current);
      clearTimeout(gainTimeoutRef.current);
    };
  }, []);

  // Arriving here via the Dashboard's "Log Food" quick action carries
  // `openAddFood` in router state so the hand-off drops the player
  // straight into the Log Ration wizard instead of an empty screen. The
  // state is cleared right after so refreshing or navigating back here
  // later doesn't reopen the modal on its own.
  useEffect(() => {
    if (location.state?.openAddFood) {
      openAddFood();
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const totals = useMemo(() => sumMeals(meals), [meals]);
  const caloriePct = Math.min(100, Math.round((totals.calories / GOALS.calories) * 100));

  // Search text and category filter combine: a food must match the
  // query (if any) AND be in the selected category (or "all").
  const filteredFoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FOOD_DATABASE.filter((food) => {
      const matchesQuery = !q || food.name.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const previewTotals = draft.food ? scaleFood(draft.food, draft.quantity) : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  // Opening for a specific meal (the per-slot "+ Ration" link, or the
  // empty-state button) skips straight to search since the meal is
  // already known. Opening from the header button with no meal lets the
  // player pick a slot first.
  function openAddFood(mealKey) {
    setDraft({ ...EMPTY_DRAFT, meal: mealKey || "breakfast" });
    setSearchQuery("");
    setCategoryFilter("all");
    setStep(mealKey ? "search" : "meal");
    setIsModalOpen(true);
  }

  function openEditFood(mealKey, item) {
    setDraft({
      meal: mealKey,
      food: { id: item.foodId, name: item.name, servingLabel: item.servingLabel, ...item.perServing },
      quantity: item.quantity,
      editingId: item.id,
    });
    setSearchQuery(item.name);
    setCategoryFilter("all");
    setStep("quantity");
    setIsModalOpen(true);
  }

  function handleSelectFood(food) {
    setDraft((prev) => ({ ...prev, food, quantity: 1 }));
    setStep("quantity");
  }

  function handleDeleteFood(mealKey, item) {
    setMeals((prev) => ({ ...prev, [mealKey]: prev[mealKey].filter((i) => i.id !== item.id) }));
    showToast({
      title: "Ration Removed",
      description: `${item.name} removed from ${MEAL_META[mealKey].label}`,
      type: "default",
    });
  }

  function handleSaveFood(e) {
    e.preventDefault();
    if (!draft.food) return;
    const quantity = Number(draft.quantity);
    if (!quantity || quantity <= 0) return;

    const isNewRation = !draft.editingId;
    const entry = mealEntry(
      draft.editingId || `food-${Date.now()}`,
      draft.food.id || null,
      draft.food.name,
      draft.food.servingLabel,
      quantity,
      { calories: draft.food.calories, protein: draft.food.protein, carbs: draft.food.carbs, fats: draft.food.fats }
    );

    setMeals((prev) => {
      // Drop the old entry from wherever it currently lives (only
      // matters when editing — and covers moving it to a new meal too),
      // then place the fresh/updated entry into the target meal.
      const withoutOld = {};
      for (const key of MEAL_ORDER) {
        withoutOld[key] = prev[key].filter((i) => i.id !== entry.id);
      }
      return { ...withoutOld, [draft.meal]: [...withoutOld[draft.meal], entry] };
    });

    setIsModalOpen(false);

    // Glow the affected card briefly, and — only for a brand new ration —
    // float a "+kcal" gain indicator next to that slot's total.
    setPulsingId(entry.id);
    clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setPulsingId(null), 1500);

    if (isNewRation) {
      setRationGain({ mealKey: draft.meal, amount: entry.calories, nonce: Date.now() });
      clearTimeout(gainTimeoutRef.current);
      gainTimeoutRef.current = setTimeout(() => setRationGain(null), 1300);
    }

    showToast({
      title: isNewRation ? "Ration Logged!" : "Ration Updated!",
      description: `${entry.name} ${isNewRation ? "added to" : "updated in"} ${MEAL_META[draft.meal].label}`,
      type: "success",
    });
  }

  const modalTitle = step === "quantity" && draft.editingId ? "Edit Ration" : "Log Ration";

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
            <h1 className="pixel-text-shadow truncate font-heading text-base text-[#fffffe] sm:text-lg">
              {user?.username ? `${user.username}'s Daily Rations` : "Daily Rations"}
            </h1>
            <p className="mt-0.5 hidden text-sm text-muted sm:block">Fuel your quest — log today&apos;s rations below.</p>
          </div>
          <div className="w-40 shrink-0">
            <PixelButton variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={() => openAddFood()}>
              Log Ration
            </PixelButton>
          </div>
        </header>

        <GameNav />

        {/* Daily ration reserves */}
        <PixelCard variant="accent" className="mb-6">
          <div className="mb-4 flex items-center gap-2 border-b-2 border-border/60 pb-3">
            <TargetIcon size={16} className="text-accent-light" />
            <h2 className="pixel-text-shadow font-heading text-xs uppercase tracking-widest text-[#fffffe] sm:text-sm">
              Ration Reserves
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="mx-auto flex flex-col items-center gap-1.5">
              <div className="relative flex h-28 w-28 items-center justify-center border-4 border-border bg-ink pixel-corners">
                <div className="text-center">
                  <p className="font-heading text-lg text-accent-light">
                    <PulseValue value={totals.calories} />
                  </p>
                  <p className="font-heading text-[8px] uppercase tracking-widest text-muted">
                    / {GOALS.calories} kcal
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1 font-heading text-[8px] uppercase tracking-widest text-gold">
                <FlameIcon size={10} /> Energy
              </span>
              <Badge variant="accent" size="sm" icon={<TargetIcon size={10} />}>
                {caloriePct}% of Quota
              </Badge>
            </div>

            <div className="min-w-0 space-y-3">
              <MacroBar
                label="Protein"
                tag={MACRO_META.protein.tag}
                icon={MACRO_META.protein.icon}
                value={totals.protein}
                goal={GOALS.protein}
                accent={MACRO_META.protein.accent}
              />
              <MacroBar
                label="Carbs"
                tag={MACRO_META.carbs.tag}
                icon={MACRO_META.carbs.icon}
                value={totals.carbs}
                goal={GOALS.carbs}
                accent={MACRO_META.carbs.accent}
              />
              <MacroBar
                label="Fat"
                tag={MACRO_META.fats.tag}
                icon={MACRO_META.fats.icon}
                value={totals.fats}
                goal={GOALS.fats}
                accent={MACRO_META.fats.accent}
              />
            </div>
          </div>
        </PixelCard>

        {/* Ration slots (meals) */}
        {MEAL_ORDER.map((mealKey) => {
          const items = meals[mealKey];
          const mealCalories = items.reduce((sum, item) => sum + item.calories, 0);
          return (
            <section key={mealKey} className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-border pb-2">
                <div className="flex items-center gap-2">
                  <AppleIcon size={16} />
                  <h2 className="pixel-text-shadow font-heading text-xs uppercase tracking-widest text-[#fffffe] sm:text-sm">
                    {MEAL_META[mealKey].label}
                  </h2>
                  <span className="relative font-heading text-[9px] uppercase tracking-widest text-muted">
                    <PulseValue value={mealCalories} /> kcal
                    <AnimatePresence>
                      {rationGain?.mealKey === mealKey && (
                        <motion.span
                          key={rationGain.nonce}
                          initial={{ opacity: 0, y: 4, scale: 0.9 }}
                          animate={{ opacity: 1, y: -18, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-accent-light"
                        >
                          +{rationGain.amount} kcal
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openAddFood(mealKey)}
                  className="flex items-center gap-1 font-heading text-[9px] uppercase tracking-widest text-accent-light hover:text-accent"
                >
                  <PlusIcon size={12} /> Ration
                </button>
              </div>

              {items.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <FoodItemCard
                        key={item.id}
                        item={item}
                        pulsing={item.id === pulsingId}
                        onEdit={() => openEditFood(mealKey, item)}
                        onDelete={() => handleDeleteFood(mealKey, item)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <EmptyState
                  icon={<AppleIcon size={22} />}
                  title="No Rations Logged"
                  description={`Log your first ${MEAL_META[mealKey].label.toLowerCase()} ration to keep today's stats topped up.`}
                  action={
                    <PixelButton size="sm" variant="secondary" icon={<PlusIcon size={12} />} onClick={() => openAddFood(mealKey)}>
                      Log Ration
                    </PixelButton>
                  }
                />
              )}
            </section>
          );
        })}

        {/* Log/Edit Ration modal — a small three-step wizard: pick the
            ration slot (skipped when opened from a slot's own "+
            Ration"), search/select a food, then set quantity/servings. */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
          {step === "meal" && (
            <MealStep
              selectedMeal={draft.meal}
              onSelectMeal={(meal) => {
                setDraft((prev) => ({ ...prev, meal }));
                setStep("search");
              }}
            />
          )}

          {step === "search" && (
            <FoodSearchStep
              query={searchQuery}
              onQueryChange={setSearchQuery}
              category={categoryFilter}
              onSelectCategory={setCategoryFilter}
              foods={filteredFoods}
              onSelectFood={handleSelectFood}
              mealLabel={MEAL_META[draft.meal].label}
              onChangeMeal={() => setStep("meal")}
            />
          )}

          {step === "quantity" && (
            <QuantityStep
              food={draft.food}
              quantity={draft.quantity}
              onQuantityChange={(quantity) => setDraft((prev) => ({ ...prev, quantity }))}
              mealLabel={MEAL_META[draft.meal].label}
              isEditing={Boolean(draft.editingId)}
              onChangeFood={() => setStep("search")}
              onSubmit={handleSaveFood}
              previewTotals={previewTotals}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
