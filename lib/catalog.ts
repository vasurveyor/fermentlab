export type IngredientPreset = {
  name: string;
  category: string;
  unit: string;
  ppg: number;
  sugar: number;
  note: string;
  /** Pounds per US gallon, used to convert cups and spoons to weight. Water (8.34) when missing. */
  density?: number;
};

export type YeastProfile = {
  type: string;
  abv: [number, number];
  temp: [number, number];
  uses: string;
  profile: string;
  nutrient: string;
  note: string;
  days: [number, number];
};

export const DEFAULT_YEAST = "Lalvin D-47";
export const NUTRIENT_LEVELS = ["Low", "Low–Medium", "Medium", "Medium–High", "High"];
export const YEAST_TYPES = ["Wine", "Champagne", "Mead", "Cider", "Ale", "Baking", "Other"];

export const FERMENTABLES: IngredientPreset[] = [
  {name:"Wildflower Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Floral, variable",density:11.9},
  {name:"Clover Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Mild, clean",density:11.9},
  {name:"Orange Blossom Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Citrus and floral",density:11.9},
  {name:"Buckwheat Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Dark, earthy, bold",density:11.9},
  {name:"Tupelo Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Smooth and buttery",density:11.9},
  {name:"Meadowfoam Honey",category:"Honey",unit:"lb",ppg:35,sugar:82,note:"Vanilla and marshmallow",density:11.9},
  {name:"Table Sugar",category:"Sugar",unit:"lb",ppg:46,sugar:100,note:"Neutral fermentable",density:7.1},
  {name:"Corn Sugar",category:"Sugar",unit:"lb",ppg:42,sugar:91,note:"Clean fermentable",density:6.6},
  {name:"Brown Sugar",category:"Sugar",unit:"lb",ppg:46,sugar:97,note:"Molasses notes",density:7.8},
  {name:"Demerara Sugar",category:"Sugar",unit:"lb",ppg:46,sugar:100,note:"Caramel and toffee",density:7.6},
  {name:"Maple Syrup",category:"Syrup",unit:"lb",ppg:30,sugar:66,note:"Maple character",density:11},
  {name:"Molasses",category:"Syrup",unit:"lb",ppg:36,sugar:75,note:"Dark and mineral",density:11.8},
  {name:"Dry Malt Extract",category:"Malt",unit:"lb",ppg:44,sugar:95,note:"Braggot and body",density:5.3},
  {name:"Liquid Malt Extract",category:"Malt",unit:"lb",ppg:36,sugar:80,note:"Braggot and body",density:11.7},
  {name:"Apple Juice",category:"Juice",unit:"gal",ppg:48,sugar:12,note:"Cyser, apple wine"},
  {name:"Concord Grape Juice",category:"Juice",unit:"gal",ppg:70,sugar:17,note:"Concord wine and pyment"},
  {name:"White Grape Juice",category:"Juice",unit:"gal",ppg:68,sugar:16,note:"White wine and pyment"},
  {name:"Cherry Juice",category:"Juice",unit:"gal",ppg:55,sugar:14,note:"Cherry wine and melomel"},
  {name:"Cranberry Juice",category:"Juice",unit:"gal",ppg:40,sugar:10,note:"Tart wine and melomel"},
  {name:"Blueberry Juice",category:"Juice",unit:"gal",ppg:50,sugar:12,note:"Berry wine"},
  {name:"Pomegranate Juice",category:"Juice",unit:"gal",ppg:55,sugar:14,note:"Tart, tannic fruit"},
  {name:"Pear Juice",category:"Juice",unit:"gal",ppg:50,sugar:12,note:"Perry and pear wine"},
  {name:"Peach Nectar",category:"Juice",unit:"gal",ppg:50,sugar:12,note:"Peach wine"},
  {name:"Pineapple Juice",category:"Juice",unit:"gal",ppg:52,sugar:13,note:"Tropical wine"},
  {name:"Blackberries",category:"Fruit",unit:"lb",ppg:4,sugar:5,note:"Variable; verify after crushing",density:5.1},
  {name:"Blueberries",category:"Fruit",unit:"lb",ppg:3.5,sugar:4,note:"Variable; verify after crushing",density:5.2},
  {name:"Strawberries",category:"Fruit",unit:"lb",ppg:2.5,sugar:3,note:"Variable; verify after crushing",density:5.9},
  {name:"Peaches",category:"Fruit",unit:"lb",ppg:2.5,sugar:3,note:"Variable; verify after crushing",density:5.4},
  {name:"Cherries",category:"Fruit",unit:"lb",ppg:3.5,sugar:4,note:"Variable; verify after crushing",density:5.4},
  {name:"Raisins",category:"Adjunct",unit:"lb",ppg:30,sugar:59,note:"Body and dried-fruit character",density:5.8},
  {name:"Oak Cubes",category:"Adjunct",unit:"oz",ppg:0,sugar:0,note:"Non-fermentable; structure and oak flavor"},
  {name:"Vanilla Bean",category:"Adjunct",unit:"each",ppg:0,sugar:0,note:"Non-fermentable; vanilla aroma"},
  {name:"Cinnamon Stick",category:"Adjunct",unit:"each",ppg:0,sugar:0,note:"Non-fermentable; spice"},
  {name:"Cacao Nibs",category:"Adjunct",unit:"oz",ppg:0,sugar:0,note:"Non-fermentable; chocolate aroma"},
];

export const YEASTS: Record<string, YeastProfile> = {
  "Lalvin D-47":{type:"Wine",abv:[15,15],temp:[59,68],uses:"Traditional mead, white wine",profile:"Round mouthfeel",nutrient:"Medium",note:"Keep cool",days:[10,18]},
  "Lalvin 71B-1122":{type:"Wine",abv:[14,14],temp:[59,72],uses:"Fruit mead, young reds",profile:"Fruity; softens malic acid",nutrient:"Medium",note:"Excellent for melomel",days:[8,16]},
  "Lalvin EC-1118":{type:"Champagne",abv:[18,18],temp:[45,95],uses:"High gravity, restart, sparkling",profile:"Neutral and vigorous",nutrient:"Low–Medium",note:"Can ferment very dry",days:[7,14]},
  "Lalvin K1-V1116":{type:"Wine",abv:[18,18],temp:[50,95],uses:"Fruit wine and mead",profile:"Strong fruity aromatics",nutrient:"Medium",note:"Robust fermenter",days:[7,15]},
  "Lalvin QA23":{type:"Wine",abv:[16,16],temp:[59,86],uses:"White wine and light mead",profile:"Crisp, tropical",nutrient:"Medium",note:"Good for whites",days:[8,16]},
  "Lalvin RC-212":{type:"Wine",abv:[16,16],temp:[68,86],uses:"Red grape wine",profile:"Color and structure",nutrient:"High",note:"Needs good nutrition",days:[9,18]},
  "Red Star Premier Blanc":{type:"Wine",abv:[16,16],temp:[64,86],uses:"General wine, sparkling",profile:"Clean, reliable",nutrient:"Medium",note:"Strong finisher",days:[8,16]},
  "Red Star Côte des Blancs":{type:"Wine",abv:[14,14],temp:[64,86],uses:"Fruit wine, aromatic whites",profile:"Fruity, slower",nutrient:"Medium",note:"May retain sweetness",days:[12,22]},
  "Mangrove Jack M05":{type:"Mead",abv:[18,18],temp:[59,86],uses:"Mead",profile:"Floral and clean",nutrient:"Medium",note:"Mead-specific",days:[9,18]},
  "SafCider AB-1":{type:"Cider",abv:[12,12],temp:[50,82],uses:"Cider and cyser",profile:"Fresh apple",nutrient:"Low–Medium",note:"Good cider profile",days:[7,14]},
  "Bread Yeast":{type:"Baking",abv:[8,12],temp:[68,86],uses:"JAOM-style and budget mead",profile:"Bready/estery; unpredictable",nutrient:"Medium",note:"Not ideal for precise attenuation",days:[7,18]},
};
