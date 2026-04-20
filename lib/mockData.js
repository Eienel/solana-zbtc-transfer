export const MOCK_TRENDS = [
  {
    id: "m1",
    slug: "renegade",
    name: "Renegade",
    tiktok_url: "https://www.tiktok.com/@global.jones/video/6798261050506808582",
    difficulty: "medium",
    thumbnail_url:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop",
    steps: [
      { order: 1, title: "Clap and cross", description: "Clap once, then cross your right hand over your left.", count: "1-2" },
      { order: 2, title: "Woah pop", description: "Pop both hands out to your left side.", count: "3-4" },
      { order: 3, title: "Wave", description: "Wave your right hand above your head.", count: "5-6" },
      { order: 4, title: "Hit it", description: "Drop your left hand down and hit the beat.", count: "7-8" },
    ],
  },
  {
    id: "m2",
    slug: "savage",
    name: "Savage",
    tiktok_url: "https://www.tiktok.com/@keke.janajah/video/6789818245620124933",
    difficulty: "easy",
    thumbnail_url:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    steps: [
      { order: 1, title: "Side step", description: "Step your left foot out and snap.", count: "1-2" },
      { order: 2, title: "Hip sway", description: "Sway hips right while rolling your right shoulder.", count: "3-4" },
      { order: 3, title: "Point", description: "Point your right hand forward.", count: "5-6" },
      { order: 4, title: "Strut", description: "Walk forward two steps with attitude.", count: "7-8" },
    ],
  },
  {
    id: "m3",
    slug: "say-so",
    name: "Say So",
    tiktok_url: "https://www.tiktok.com/@haleyysheldon/video/6786002242710588678",
    difficulty: "hard",
    thumbnail_url:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop",
    steps: [
      { order: 1, title: "Hair flick", description: "Flick your right hand through your hair.", count: "1-2" },
      { order: 2, title: "Phone", description: "Mime holding a phone to your left ear.", count: "3-4" },
      { order: 3, title: "Roll", description: "Roll both arms in front of you.", count: "5-6" },
      { order: 4, title: "Pose", description: "Pose with your left hand on your hip.", count: "7-8" },
    ],
  },
  {
    id: "m4",
    slug: "cupid-shuffle",
    name: "Cupid Shuffle",
    tiktok_url: "https://www.tiktok.com/@cupidwrotethat/video/7001234567890123456",
    difficulty: "easy",
    thumbnail_url:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&auto=format&fit=crop",
    steps: [
      { order: 1, title: "Right four", description: "Step right four times.", count: "1-2-3-4" },
      { order: 2, title: "Left four", description: "Step left four times.", count: "5-6-7-8" },
      { order: 3, title: "Kick", description: "Kick each foot twice.", count: "1-2-3-4" },
      { order: 4, title: "Walk it out", description: "Turn 90 degrees and walk it.", count: "5-6-7-8" },
    ],
  },
];

export function getMockTrendBySlug(slug) {
  return MOCK_TRENDS.find((t) => t.slug === slug) || null;
}
