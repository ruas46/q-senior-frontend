/** Static test data for the collectible-asset dashboard (Task 3). */

export interface ValuePoint {
  readonly year: number;
  readonly value: number;
}

export interface ComparableSale {
  readonly date: string;
  readonly title: string;

  readonly price: number;
  readonly location: string;
}

export interface KeyFact {
  readonly label: string;
  readonly value: string;
}

export interface CollectibleAsset {
  readonly name: string;
  readonly attribution: string;
  readonly medium: string;
  readonly year: number;
  readonly imageUrl: string;

  readonly currentValue: number;
  readonly appraisalDate: string;
  readonly acquisitionDate: string;
  readonly acquisitionCost: number;

  readonly totalReturn: string;
  readonly annualisedReturn: string;
  readonly holdingPeriod: string;

  readonly condition: string;
  readonly conditionNote: string;
  readonly keyFacts: readonly KeyFact[];
  readonly provenance: readonly string[];

  readonly valueHistory: readonly ValuePoint[];
  readonly comparableSales: readonly ComparableSale[];
}

export const SMILEY_ASSET: CollectibleAsset = {
  name: 'Untitled (Smiley)',
  attribution: 'Unidentified hand',
  medium: 'Ballpoint pen on A4 paper',
  year: 2019,
  imageUrl: 'monet.png',

  currentValue: 4_200_000,
  appraisalDate: '2026-09-01',
  acquisitionDate: '2020-03-18',
  acquisitionCost: 850_000,

  totalReturn: '333%',
  annualisedReturn: '22%',
  holdingPeriod: '6 years',

  condition: 'Mint',
  conditionNote:
    'Original status. Never laminated or restored.',

  keyFacts: [
    { label: 'Attribution', value: 'Unidentified hand' },
    { label: 'Medium', value: 'Ballpoint pen on A4 paper' },
    { label: 'Dimensions', value: '30 × 20 cm' },
    { label: 'Reference No.', value: 'QPLIX·2019·001' },
  ],

  provenance: [
    'Executed by an unidentified hand, Munich, 2019',
    'Private collection, Munich 2019',
    'Acquired by the present owner, March 2020',
    'Exhibited: “Modern childish arts”, Munich, 2021',
  ],

  valueHistory: [
    { year: 2019, value: 620_000 },
    { year: 2020, value: 850_000 },
    { year: 2021, value: 1_300_000 },
    { year: 2022, value: 2_050_000 },
    { year: 2023, value: 1_780_000 },
    { year: 2024, value: 2_900_000 },
    { year: 2025, value: 3_600_000 },
    { year: 2026, value: 4_200_000 },
  ],

  comparableSales: [
    { date: '2021-03-14', title: 'Sad Face No. 1', price: 1_900_000, location: "Munich" },
    { date: '2022-11-09', title: 'Home: just a house and a tree', price: 3_400_000, location: "Berlin" },
    { date: '2023-06-27', title: 'Stick man', price: 2_750_000, location: 'Hamburg' },
    { date: '2024-02-15', title: 'Untitled (Tree)', price: 5_100_000, location: "Stuttgart" },
    { date: '2025-10-03', title: 'Two Dots and a Line', price: 6_800_000, location: "Nuremberg" },
  ],
};
