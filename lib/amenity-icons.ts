import {
  AirVent, Bath, BedDouble, BellOff, Briefcase, Check, ChefHat, CircleParking, Coffee, ConciergeBell, DoorClosed,
  Dumbbell, Gem, HeartHandshake, KeyRound, Laptop, LockKeyhole, MapPin, Presentation, Scissors, Shirt, ShowerHead,
  Sofa, Sparkles, Tv, Users, Utensils, UtensilsCrossed, WashingMachine, Waves, Wifi, Wine, type LucideIcon,
} from 'lucide-react';

// First matching pattern wins. Unknown amenities fall back to a check mark.
const rules: [RegExp, LucideIcon][] = [
  [/wi[-‑]?fi/i, Wifi],
  [/air ?con/i, AirVent],
  [/tv/i, Tv],
  [/minibar/i, Wine],
  [/tea|coffee|cafeteria|café/i, Coffee],
  [/safe/i, LockKeyhole],
  [/desk/i, Laptop],
  [/key/i, KeyRound],
  [/shower/i, ShowerHead],
  [/bathrobe/i, Shirt],
  [/grooming/i, Scissors],
  [/wardrobe/i, DoorClosed],
  [/disturb/i, BellOff],
  [/jacuzzi/i, Bath],
  [/pool/i, Waves],
  [/gym|fitness/i, Dumbbell],
  [/parking/i, CircleParking],
  [/laundry/i, WashingMachine],
  [/in-room dining/i, ConciergeBell],
  [/rooftop/i, UtensilsCrossed],
  [/multi-cuisine/i, ChefHat],
  [/dining|restaurant/i, Utensils],
  [/conference|meeting/i, Presentation],
  [/banquet|event|guests/i, Users],
  [/business/i, Briefcase],
  [/location/i, MapPin],
  [/hospitality/i, HeartHandshake],
  [/comfort/i, Sofa],
  [/premium|luxur/i, Gem],
  [/room/i, BedDouble],
  [/experience/i, Sparkles],
];

export function amenityIcon(label: string): LucideIcon {
  return rules.find(([re]) => re.test(label))?.[1] ?? Check;
}
