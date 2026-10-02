import {
  Binoculars, Bird, Camera, Compass, FerrisWheel, Landmark, PawPrint, Tent, Users, Zap,
  Mountain, Sailboat, Utensils, ShoppingBag, Sparkles, Building2, Drama,
  type LucideIcon,
} from 'lucide-react';

// Names come from the admin-managed categories (/api/v1/category), which have no icon
// field — so each one is mapped here. Keys are normalised (lowercase, trimmed,
// straight apostrophes) because project data has variants like a trailing space.
const exactIcons: Record<string, LucideIcon> = {
  'adventure and entertainment': FerrisWheel,
  "arabia's wildlife centre": Bird,
  'entertainment and sightseeing': Camera,
  'extreme adventure': Zap,
  'family attraction': Users,
  'museum & culture': Landmark,
  'safari adventures': Tent,
  'sightseeing & adventure': Binoculars,
  'zoo & wildlife attractions': PawPrint,
};

// Fallback for categories added later in the admin
const keywordIcons: [RegExp, LucideIcon][] = [
  [/zoo|wildlife|animal|aquarium/, PawPrint],
  [/safari|desert|camp/, Tent],
  [/museum|culture|heritage|histor/, Landmark],
  [/family|kids/, Users],
  [/extreme|thrill|sky ?div/, Zap],
  [/water|beach|marine|boat|cruise|yacht/, Sailboat],
  [/theme park|amusement/, FerrisWheel],
  [/entertainment|show|theat/, Drama],
  [/sightseeing|tour/, Binoculars],
  [/observ|tower|skyline/, Building2],
  [/adventure|hike|mountain/, Mountain],
  [/food|dining|restaurant/, Utensils],
  [/shopping|mall|market/, ShoppingBag],
  [/spa|wellness|relax/, Sparkles],
];

const normalise = (name: string) => name.trim().toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ');

export const getCategoryIconComponent = (name: string): LucideIcon => {
  const key = normalise(name || '');
  if (exactIcons[key]) return exactIcons[key];
  for (const [pattern, icon] of keywordIcons) {
    if (pattern.test(key)) return icon;
  }
  return Compass;
};
