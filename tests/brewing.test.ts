import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAbv,
  calculateOriginalGravity,
  calculateScaleFactor,
  gallonsToLiters,
  honeyNeededPounds,
  kilogramsToPounds,
  litersToGallons,
  poundsToKilograms,
  scaleAmount,
  sugarPounds,
  type BrewingIngredient,
} from "../lib/brewing.ts";

const closeTo = (actual: number, expected: number, tolerance = 0.00001) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
};

test("calculates original gravity and excludes finish additions", () => {
  const ingredients: BrewingIngredient[] = [
    { amount: 3, unit: "lb", ppg: 35, sugar: 82, stage: "primary" },
    { amount: 1, unit: "gal", ppg: 48, sugar: 12, stage: "primary" },
    { amount: 1, unit: "lb", ppg: 46, sugar: 100, stage: "finish" },
  ];

  closeTo(calculateOriginalGravity(ingredients, 1), 1.153);
});

test("calculates ABV and never returns a negative value", () => {
  closeTo(calculateAbv(1.1, 1.01), 11.8125);
  assert.equal(calculateAbv(1.01, 1.02), 0);
});

test("calculates fermentable sugar from pounds and gallons", () => {
  closeTo(sugarPounds({ amount: 3, unit: "lb", ppg: 35, sugar: 82, stage: "primary" }), 2.46);
  closeTo(sugarPounds({ amount: 1, unit: "gal", ppg: 48, sugar: 12, stage: "primary" }), 1.0008);
});

test("scales ingredient quantities", () => {
  const factor = calculateScaleFactor(5, 1);
  assert.equal(factor, 5);
  assert.equal(scaleAmount(3, factor), 15);
});

test("converts US and metric units round trip", () => {
  closeTo(litersToGallons(gallonsToLiters(5)), 5);
  closeTo(kilogramsToPounds(poundsToKilograms(10)), 10);
});

test("calculates honey required to reach a target gravity", () => {
  closeTo(honeyNeededPounds(1.06, 1.1, 1), 1.1428571429);
  assert.equal(honeyNeededPounds(1.11, 1.1, 1), 0);
});
