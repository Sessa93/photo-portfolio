export interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  camera?: string;
  lens?: string;
  settings?: string;
  location?: string;
}

export const photos: Photo[] = [
  {
    id: "mountain-sunrise",
    title: "Mountain Sunrise",
    description:
      "Golden light spills over jagged peaks as dawn breaks across the alpine ridge. Captured at 5,200 meters during a week-long trek through the Himalayas.",
    url: "https://www.amazon.it/photos/share/5WUBeQHd3cQ6An7L2Emvv3eLK087wadOImHV1ohgkDH",
    camera: "Sony A7R IV",
    lens: "24-70mm f/2.8 GM",
    settings: "f/8 · 1/250s · ISO 100",
    location: "Himalayas, Nepal",
  },
  {
    id: "ocean-mist",
    title: "Ocean Mist",
    description:
      "Waves crash against weathered basalt columns while sea mist softens the horizon. A long exposure transforms the Atlantic into silk.",
    url: "https://www.amazon.it/photos/share/mAU0n5Ji0iVPXYMbwH8nb3OdXEH5PopalUJuAf5XeMI",
    camera: "Canon EOS R5",
    lens: "16-35mm f/2.8L",
    settings: "f/11 · 8s · ISO 50",
    location: "Reynisfjara, Iceland",
  },
  {
    id: "forest-path",
    title: "Forest Path",
    description:
      "Sunbeams filter through a canopy of ancient oaks, illuminating a carpet of fallen leaves on a quiet autumn morning in the Pacific Northwest.",
    url: "https://www.amazon.it/photos/share/x3vLkDlRNshweZVhbdDgCtjtGiXvozOjhptiXkoMrle",
    camera: "Nikon Z7 II",
    lens: "50mm f/1.4",
    settings: "f/2.8 · 1/125s · ISO 400",
    location: "Olympic National Park, USA",
  },
  {
    id: "desert-dunes",
    title: "Desert Dunes",
    description:
      "Wind-sculpted sand dunes stretch to the horizon under a pale lavender sky. The Sahara at twilight reveals textures invisible in the midday sun.",
    url: "https://www.amazon.it/photos/share/LJjLUQdP6TAsio8OdvWNQteIXilmQakKi1l1rDaouDy",
    camera: "Sony A7R IV",
    lens: "70-200mm f/2.8 GM",
    settings: "f/5.6 · 1/500s · ISO 200",
    location: "Sahara Desert, Morocco",
  },
  {
    id: "city-rain",
    title: "City Rain",
    description:
      "Neon reflections ripple across rain-soaked streets in downtown Tokyo. A solitary umbrella punctuates the electric blur of a late-night crossing.",
    url: "https://www.amazon.it/photos/share/TH5FNk7sOTgkTNDBEgkrU3Ir1WbBs3QmVYxHfNWtHJn",
    camera: "Fujifilm X-T5",
    lens: "23mm f/1.4",
    settings: "f/1.4 · 1/60s · ISO 1600",
    location: "Shibuya, Tokyo",
  },
  {
    id: "arctic-light",
    title: "Arctic Light",
    description:
      "The Northern Lights dance in emerald ribbons above a frozen fjord. Shot on a clear February night in Tromsø, Norway, at −18°C.",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=80",
    camera: "Nikon Z7 II",
    lens: "14-24mm f/2.8",
    settings: "f/2.8 · 15s · ISO 3200",
    location: "Tromsø, Norway",
  },
  {
    id: "wildflower-meadow",
    title: "Wildflower Meadow",
    description:
      "A tapestry of lupines and poppies blankets a hillside in Provence. The late-afternoon light lends warmth to an already vivid palette.",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    camera: "Canon EOS R5",
    lens: "100mm f/2.8L Macro",
    settings: "f/4 · 1/320s · ISO 100",
    location: "Provence, France",
  },
  {
    id: "foggy-bridge",
    title: "Foggy Bridge",
    description:
      "The Golden Gate Bridge emerges from a bank of fog rolling in from the Pacific. Only the rust-red towers pierce the grey, standing like sentinels.",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    camera: "Sony A7 III",
    lens: "24-105mm f/4",
    settings: "f/8 · 1/125s · ISO 200",
    location: "San Francisco, USA",
  },
  {
    id: "lake-reflection1",
    title: "Lake Reflection",
    description:
      "A perfectly still alpine lake mirrors snow-capped peaks and a cloudless sky. The symmetry is so precise it's hard to tell which half is real.",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    camera: "Sony A7R IV",
    lens: "16-35mm f/2.8 GM",
    settings: "f/11 · 1/60s · ISO 100",
    location: "Dolomites, Italy",
  },
    {
    id: "lake-reflection2",
    title: "Lake Reflection",
    description:
      "A perfectly still alpine lake mirrors snow-capped peaks and a cloudless sky. The symmetry is so precise it's hard to tell which half is real.",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    camera: "Sony A7R IV",
    lens: "16-35mm f/2.8 GM",
    settings: "f/11 · 1/60s · ISO 100",
    location: "Dolomites, Italy",
  },
    {
    id: "lake-reflection3",
    title: "Lake Reflection",
    description:
      "A perfectly still alpine lake mirrors snow-capped peaks and a cloudless sky. The symmetry is so precise it's hard to tell which half is real.",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    camera: "Sony A7R IV",
    lens: "16-35mm f/2.8 GM",
    settings: "f/11 · 1/60s · ISO 100",
    location: "Dolomites, Italy",
  },
{
    id: "lake-reflection4",
    title: "Lake Reflection",
    description:
      "A perfectly still alpine lake mirrors snow-capped peaks and a cloudless sky. The symmetry is so precise it's hard to tell which half is real.",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&q=80",
    camera: "Sony A7R IV",
    lens: "16-35mm f/2.8 GM",
    settings: "f/11 · 1/60s · ISO 100",
    location: "Dolomites, Italy",
  },
];
