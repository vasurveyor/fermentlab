export const LITERS_PER_GALLON = 3.78541;
export const KILOGRAMS_PER_POUND = 0.453592;
const POUNDS_PER_GALLON_OF_WATER = 8.34;
/** Gravity points one pound of pure sucrose adds to one gallon. */
export const SUCROSE_PPG = 46;

export type BrewingStage = "primary" | "secondary" | "finish";
export type UnitSystem = "us" | "metric";

export type BrewingIngredient = {
  amount: number;
  unit: string;
  ppg: number;
  sugar: number;
  stage: BrewingStage;
  /** Pounds per gallon, used to turn a volume into a weight. Water when missing. */
  density?: number;
  /** What PPG is measured against. Follows the unit (weight or volume) when missing. */
  basis?: "lb" | "gal";
};

const WEIGHT_UNITS: Record<string, number> = {
  lb: 1,
  oz: 1 / 16,
  kg: 1 / KILOGRAMS_PER_POUND,
  g: 1 / KILOGRAMS_PER_POUND / 1000,
};

const VOLUME_UNITS: Record<string, number> = {
  gal: 1,
  qt: 1 / 4,
  pt: 1 / 8,
  cup: 1 / 16,
  tbsp: 1 / 256,
  tsp: 1 / 768,
  L: 1 / LITERS_PER_GALLON,
  mL: 1 / LITERS_PER_GALLON / 1000,
};

export const UNITS: Record<UnitSystem, string[]> = {
  us: ["lb", "oz", "gal", "qt", "pt", "cup", "tbsp", "tsp", "each"],
  metric: ["kg", "g", "L", "mL", "each"],
};

export const isWeightUnit = (unit: string) => unit in WEIGHT_UNITS;
export const isVolumeUnit = (unit: string) => unit in VOLUME_UNITS;

export const gallonsToLiters = (gallons: number) =>
  gallons * LITERS_PER_GALLON;

export const litersToGallons = (liters: number) =>
  liters / LITERS_PER_GALLON;

export const poundsToKilograms = (pounds: number) =>
  pounds * KILOGRAMS_PER_POUND;

export const kilogramsToPounds = (kilograms: number) =>
  kilograms / KILOGRAMS_PER_POUND;

export const ingredientGallons = (ingredient: BrewingIngredient) => {
  if (isVolumeUnit(ingredient.unit)) {
    return ingredient.amount * VOLUME_UNITS[ingredient.unit];
  }
  if (isWeightUnit(ingredient.unit)) {
    return ingredientPounds(ingredient) / (ingredient.density || POUNDS_PER_GALLON_OF_WATER);
  }
  return 0;
};

export const ingredientPounds = (ingredient: BrewingIngredient) => {
  if (isWeightUnit(ingredient.unit)) {
    return ingredient.amount * WEIGHT_UNITS[ingredient.unit];
  }
  if (isVolumeUnit(ingredient.unit)) {
    return ingredient.amount * VOLUME_UNITS[ingredient.unit] *
      (ingredient.density || POUNDS_PER_GALLON_OF_WATER);
  }
  return 0;
};

export const sugarPounds = (ingredient: BrewingIngredient) =>
  ingredientPounds(ingredient) * ingredient.sugar / 100;

export const gravityPoints = (ingredient: BrewingIngredient) => {
  const basis = ingredient.basis ?? (isVolumeUnit(ingredient.unit) ? "gal" : "lb");
  return (basis === "gal" ? ingredientGallons(ingredient) : ingredientPounds(ingredient)) *
    ingredient.ppg;
};

export const calculateOriginalGravity = (
  ingredients: BrewingIngredient[],
  volumeGallons: number,
) =>
  1 +
  ingredients
    .filter((ingredient) => ingredient.stage !== "finish")
    .reduce((sum, ingredient) => sum + gravityPoints(ingredient), 0) /
    Math.max(volumeGallons, 0.01) /
    1000;

export const calculateAbv = (originalGravity: number, finalGravity: number) =>
  Math.max(0, (originalGravity - finalGravity) * 131.25);

export const calculateScaleFactor = (
  targetVolumeGallons: number,
  sourceVolumeGallons: number,
) => targetVolumeGallons / Math.max(sourceVolumeGallons, 0.01);

export const scaleAmount = (amount: number, factor: number) => amount * factor;

export const honeyNeededPounds = (
  currentOg: number,
  targetOg: number,
  volumeGallons: number,
  honeyPpg = 35,
) => Math.max(0, (targetOg - currentOg) * 1000 * volumeGallons / honeyPpg);

const round = (value: number) =>
  value >= 100 ? Math.round(value * 10) / 10 : Math.round(value * 1000) / 1000;

/** The same kind of unit (weight, volume or each) in the other measuring system. */
const unitInSystem = (unit: string, amount: number, system: UnitSystem) => {
  if (UNITS[system].includes(unit)) return unit;
  if (isWeightUnit(unit)) {
    return system === "metric" ? (unit === "oz" ? "g" : "kg") : (unit === "g" ? "oz" : "lb");
  }
  if (isVolumeUnit(unit)) {
    if (system === "us") {
      const cups = amount * VOLUME_UNITS[unit] / VOLUME_UNITS.cup;
      return cups >= 0.25 ? (cups >= 8 ? "gal" : "cup") : cups >= 1 / 16 ? "tbsp" : "tsp";
    }
    return amount * VOLUME_UNITS[unit] >= 1 / 4 ? "L" : "mL";
  }
  return unit;
};

export const unitForSystem = (unit: string, system: UnitSystem) =>
  unitInSystem(unit, 1, system);

/** Re-expresses an ingredient amount in the other measuring system without changing the quantity. */
export const convertToSystem = <T extends { amount: number; unit: string }>(
  item: T,
  system: UnitSystem,
): T => {
  const unit = unitInSystem(item.unit, item.amount, system);
  if (unit === item.unit) return item;
  const factors = isWeightUnit(item.unit) ? WEIGHT_UNITS : VOLUME_UNITS;
  return { ...item, unit, amount: round(item.amount * factors[item.unit] / factors[unit]) };
};

export type IngredientCheck = {
  level: "error" | "warn";
  message: string;
  suggestedPpg?: number;
};

/**
 * Cross-checks an ingredient's PPG against its sugar percentage. Pure sucrose
 * gives 46 points per pound in a gallon, so PPG should be close to
 * 46 x sugar fraction (x density for things measured by the gallon).
 */
export const checkIngredient = (item: {
  unit: string;
  ppg: number;
  sugar: number;
  density?: number;
}): IngredientCheck[] => {
  const checks: IngredientCheck[] = [];
  const { ppg, sugar } = item;
  if (!Number.isFinite(ppg) || !Number.isFinite(sugar)) {
    return [{ level: "error", message: "Enter numbers for PPG and sugar." }];
  }
  if (ppg < 0 || sugar < 0) {
    checks.push({ level: "error", message: "PPG and sugar can't be negative." });
  }
  if (sugar > 100) {
    checks.push({ level: "error", message: "Sugar can't be more than 100%." });
  }
  if (checks.length) return checks;

  const byVolume = isVolumeUnit(item.unit);
  const per = byVolume ? "gallon" : "pound";
  if (item.unit === "each") {
    if (ppg > 0 || sugar > 0) {
      checks.push({
        level: "warn",
        message: "Items counted \"each\" don't add gravity, so PPG and sugar are ignored.",
        suggestedPpg: 0,
      });
    }
    return checks;
  }
  const expected = SUCROSE_PPG * (byVolume ? item.density || POUNDS_PER_GALLON_OF_WATER : 1) * sugar / 100;
  if (!byVolume && ppg > SUCROSE_PPG) {
    checks.push({
      level: "error",
      message: `${ppg} PPG is more than pure sugar can give (${SUCROSE_PPG} per pound).`,
      suggestedPpg: Math.round(expected),
    });
  } else if (sugar === 0 && ppg > 0) {
    checks.push({
      level: "warn",
      message: `PPG is ${ppg} but sugar is 0%. Something with no sugar shouldn't add gravity.`,
      suggestedPpg: 0,
    });
  } else if (sugar > 0 && ppg === 0) {
    checks.push({
      level: "warn",
      message: `Sugar is ${sugar}% but PPG is 0. Expect about ${Math.round(expected)} PPG per ${per}.`,
      suggestedPpg: Math.round(expected),
    });
  } else if (ppg > 0 && Math.abs(ppg - expected) > 3 && Math.abs(ppg - expected) / expected > 0.25) {
    checks.push({
      level: "warn",
      message: `${ppg} PPG and ${sugar}% sugar don't line up. At ${sugar}% sugar, expect about ${Math.round(expected)} PPG per ${per}.`,
      suggestedPpg: Math.round(expected),
    });
  }
  return checks;
};
