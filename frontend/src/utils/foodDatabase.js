// ---------------------------------------------------------------------
// Frontend-only mock food database for the Nutrition search/select flow.
// Every entry's calories/protein/carbs/fats are "per standard serving"
// values (see `servingLabel`) — they get multiplied by whatever quantity
// the player enters before being logged to a meal. No network calls, no
// persistence.
//
// TO ADD A NEW FOOD: append an object to FOOD_DATABASE below with a
// unique `id`, a `category` matching one of the CATEGORIES ids, a
// `servingLabel` describing what one serving is, and the four macro
// values for that single serving. Nothing else needs to change — search
// and category filtering both read straight from this array.
// ---------------------------------------------------------------------

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "protein", label: "Protein" },
  { id: "legumes", label: "Legumes" },
  { id: "grains", label: "Grains" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "dairy", label: "Dairy" },
  { id: "nuts", label: "Nuts & Spreads" },
];

export const FOOD_DATABASE = [
  // -- Protein --------------------------------------------------------
  { id: "eggs", name: "Eggs", category: "protein", servingLabel: "1 large egg", calories: 78, protein: 6, carbs: 0.6, fats: 5 },
  { id: "chicken-breast", name: "Chicken Breast (grilled)", category: "protein", servingLabel: "100g", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { id: "fish", name: "Fish (grilled)", category: "protein", servingLabel: "100g", calories: 206, protein: 22, carbs: 0, fats: 12 },
  { id: "paneer", name: "Paneer", category: "protein", servingLabel: "100g", calories: 265, protein: 18, carbs: 6, fats: 20 },
  { id: "tofu", name: "Tofu", category: "protein", servingLabel: "100g", calories: 76, protein: 8, carbs: 1.9, fats: 4.8 },
  { id: "protein-shake", name: "Whey Protein Shake", category: "protein", servingLabel: "1 scoop", calories: 120, protein: 24, carbs: 3, fats: 1.5 },

  // -- Legumes ----------------------------------------------------------
  { id: "dal", name: "Dal (cooked lentils)", category: "legumes", servingLabel: "1 cup", calories: 230, protein: 18, carbs: 40, fats: 1 },

  // -- Grains -------------------------------------------------------------
  { id: "rice", name: "Rice (cooked)", category: "grains", servingLabel: "1 cup", calories: 205, protein: 4.3, carbs: 45, fats: 0.4 },
  { id: "brown-rice", name: "Brown Rice (cooked)", category: "grains", servingLabel: "1 cup", calories: 216, protein: 5, carbs: 45, fats: 1.8 },
  { id: "roti", name: "Roti", category: "grains", servingLabel: "1 medium", calories: 71, protein: 3, carbs: 15, fats: 0.4 },
  { id: "oats", name: "Oats (cooked)", category: "grains", servingLabel: "1 cup", calories: 166, protein: 6, carbs: 28, fats: 3.6 },
  { id: "bread", name: "Whole Wheat Bread", category: "grains", servingLabel: "1 slice", calories: 81, protein: 4, carbs: 14, fats: 1.1 },

  // -- Vegetables -----------------------------------------------------------
  { id: "potato", name: "Potato (boiled)", category: "vegetables", servingLabel: "1 medium", calories: 161, protein: 4.3, carbs: 37, fats: 0.2 },
  { id: "sweet-potato", name: "Sweet Potato (baked)", category: "vegetables", servingLabel: "1 medium", calories: 112, protein: 2, carbs: 26, fats: 0.1 },
  { id: "vegetables", name: "Mixed Vegetables (steamed)", category: "vegetables", servingLabel: "1 cup", calories: 50, protein: 2, carbs: 10, fats: 0.3 },
  { id: "broccoli", name: "Broccoli (steamed)", category: "vegetables", servingLabel: "1 cup", calories: 55, protein: 3.7, carbs: 11, fats: 0.6 },

  // -- Fruits ---------------------------------------------------------------
  { id: "banana", name: "Banana", category: "fruits", servingLabel: "1 medium", calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
  { id: "apple", name: "Apple", category: "fruits", servingLabel: "1 medium", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
  { id: "avocado", name: "Avocado", category: "fruits", servingLabel: "1/2 fruit", calories: 120, protein: 1.5, carbs: 6, fats: 11 },

  // -- Dairy ------------------------------------------------------------------
  { id: "milk", name: "Milk", category: "dairy", servingLabel: "1 cup", calories: 149, protein: 8, carbs: 12, fats: 8 },
  { id: "curd", name: "Curd (Dahi)", category: "dairy", servingLabel: "100g", calories: 60, protein: 3.1, carbs: 4.7, fats: 3.3 },
  { id: "greek-yogurt", name: "Greek Yogurt (plain)", category: "dairy", servingLabel: "170g", calories: 100, protein: 17, carbs: 6, fats: 0.7 },

  // -- Nuts & Spreads -------------------------------------------------------
  { id: "almonds", name: "Almonds", category: "nuts", servingLabel: "1 oz (23 nuts)", calories: 164, protein: 6, carbs: 6, fats: 14 },
  { id: "peanut-butter", name: "Peanut Butter", category: "nuts", servingLabel: "2 tbsp", calories: 190, protein: 7, carbs: 7, fats: 16 },
];

/**
 * Scale a food's per-serving macros by quantity, rounded for display.
 * This is a straight proportional scale: quantity 1 = the per-serving
 * values as-is, quantity 2 = double, quantity 1.5 = 1.5x, etc.
 * e.g. 1 serving = 100 calories -> 2 servings = 200 calories.
 */
export function scaleFood(perServing, quantity) {
  const q = Number(quantity) || 0;
  const round1 = (n) => Math.round(n * q * 10) / 10;
  return {
    calories: Math.round(perServing.calories * q),
    protein: round1(perServing.protein),
    carbs: round1(perServing.carbs),
    fats: round1(perServing.fats),
  };
}

/** Look up a category's display label, falling back to the raw id. */
export function categoryLabel(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
}
