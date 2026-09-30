export const LITERS_PER_GALLON = 3.78541;
export const KILOGRAMS_PER_POUND = 0.453592;
const POUNDS_PER_GALLON_OF_WATER = 8.34;

export type BrewingStage = "primary" | "secondary" | "finish";

export type BrewingIngredient = {
  amount: number;
  unit: string;
  ppg: number;
  sugar: number;
  stage: BrewingStage;
};

export const gallonsToLiters = (gallons: number) =>
  gallons * LITERS_PER_GALLON;

export const litersToGallons = (liters: number) =>
  liters / LITERS_PER_GALLON;

export const poundsToKilograms = (pounds: number) =>
  pounds * KILOGRAMS_PER_POUND;

export const kilogramsToPounds = (kilograms: number) =>
  kilograms / KILOGRAMS_PER_POUND;

export const ingredientPounds = (ingredient: BrewingIngredient) =>
  ingredient.unit === "lb"
    ? ingredient.amount
    : ingredient.unit === "oz"
      ? ingredient.amount / 16
      : ingredient.unit === "kg"
        ? kilogramsToPounds(ingredient.amount)
        : 0;

export const sugarPounds = (ingredient: BrewingIngredient) => {
  const totalWeight =
    ingredient.unit === "gal"
      ? ingredient.amount * POUNDS_PER_GALLON_OF_WATER
      : ingredient.unit === "L"
        ? litersToGallons(ingredient.amount) * POUNDS_PER_GALLON_OF_WATER
        : ingredientPounds(ingredient);

  return totalWeight * ingredient.sugar / 100;
};

export const gravityPoints = (ingredient: BrewingIngredient) =>
  ingredient.unit === "gal"
    ? ingredient.amount * ingredient.ppg
    : ingredient.unit === "L"
      ? litersToGallons(ingredient.amount) * ingredient.ppg
      : ingredientPounds(ingredient) * ingredient.ppg;

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
