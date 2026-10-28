import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAbv,
  calculateOriginalGravity,
  calculateScaleFactor,
  checkIngredient,
  convertToSystem,
  gallonsToLiters,
  gravityPoints,
  honeyNeededPounds,
  kilogramsToPounds,
  litersToGallons,
  poundsToKilograms,
  scaleAmount,
  sugarPounds,
  unitForSystem,
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

test("converts cups, spoons, quarts and pints", () => {
  const juice = (unit: string, amount: number): BrewingIngredient =>
    ({ amount, unit, ppg: 48, sugar: 12, stage: "primary" });
  closeTo(gravityPoints(juice("qt", 4)), 48);
  closeTo(gravityPoints(juice("pt", 8)), 48);
  closeTo(gravityPoints(juice("cup", 16)), 48);
  closeTo(gravityPoints(juice("tbsp", 256)), 48);
  closeTo(gravityPoints(juice("tsp", 768)), 48);
  closeTo(gravityPoints(juice("mL", 3785.41)), 48);
});

test("measures honey by volume using its density", () => {
  const honey = (unit: string, amount: number): BrewingIngredient =>
    ({ amount, unit, ppg: 35, sugar: 82, stage: "primary", density: 12, basis: "lb" });
  // 1 cup of honey at 12 lb/gal is 0.75 lb
  closeTo(gravityPoints(honey("cup", 1)), 0.75 * 35);
  closeTo(sugarPounds(honey("cup", 1)), 0.75 * 0.82);
  closeTo(gravityPoints(honey("lb", 0.75)), 0.75 * 35);
});

test("switches an ingredient to the other measuring system without changing the quantity", () => {
  const metric = convertToSystem({ amount: 3, unit: "lb" }, "metric");
  assert.equal(metric.unit, "kg");
  closeTo(metric.amount, 1.361, 0.0005);
  assert.equal(convertToSystem({ amount: 2, unit: "oz" }, "metric").unit, "g");
  const juice = convertToSystem({ amount: 1, unit: "gal" }, "metric");
  assert.equal(juice.unit, "L");
  closeTo(juice.amount, 3.785, 0.0005);
  assert.equal(convertToSystem({ amount: 1, unit: "cup" }, "metric").unit, "mL");
  assert.equal(convertToSystem({ amount: 250, unit: "mL" }, "us").unit, "cup");
  assert.equal(convertToSystem({ amount: 5, unit: "mL" }, "us").unit, "tsp");
  const same = { amount: 3, unit: "lb" };
  assert.equal(convertToSystem(same, "us"), same);
  assert.equal(unitForSystem("each", "metric"), "each");
});

test("accepts a consistent PPG and sugar percentage", () => {
  assert.deepEqual(checkIngredient({ unit: "lb", ppg: 35, sugar: 82 }), []);
  assert.deepEqual(checkIngredient({ unit: "gal", ppg: 48, sugar: 12 }), []);
  assert.deepEqual(checkIngredient({ unit: "oz", ppg: 0, sugar: 0 }), []);
});

test("flags a PPG that doesn't match the sugar percentage", () => {
  const off = checkIngredient({ unit: "lb", ppg: 20, sugar: 82 });
  assert.equal(off.length, 1);
  assert.equal(off[0].level, "warn");
  assert.equal(off[0].suggestedPpg, 38);
  const tooHigh = checkIngredient({ unit: "lb", ppg: 60, sugar: 100 });
  assert.equal(tooHigh[0].level, "error");
  assert.equal(checkIngredient({ unit: "lb", ppg: 10, sugar: 0 })[0].suggestedPpg, 0);
  assert.equal(checkIngredient({ unit: "lb", ppg: 0, sugar: 50 })[0].suggestedPpg, 23);
  assert.equal(checkIngredient({ unit: "lb", ppg: 30, sugar: 120 })[0].level, "error");
  assert.equal(checkIngredient({ unit: "lb", ppg: -1, sugar: 10 })[0].level, "error");
  assert.equal(checkIngredient({ unit: "each", ppg: 5, sugar: 0 })[0].suggestedPpg, 0);
});
