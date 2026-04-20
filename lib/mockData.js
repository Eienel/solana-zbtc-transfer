// Mock data that mirrors the real shape: trend → many tutorials → many steps.
// Used when Supabase env vars are missing so you can test the UI on phone.

export const MOCK_TRENDS = [
  {
    id: "m1",
    slug: "renegade",
    name: "Renegade",
    music_id: "6798261050506808582",
    music_title: "Lottery - K CAMP",
    difficulty: "medium",
    tutorials: [
      {
        id: "m1t1",
        tiktok_url:
          "https://www.tiktok.com/@global.jones/video/6798261050506808582",
        author_handle: "@global.jones",
        author_name: "Global Jones",
        thumbnail_url:
          "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop",
        vote_count: 124,
        steps: [
          { order: 1, title: "Clap and cross", description: "Clap once, then cross your right hand over your left.", count: "1-2" },
          { order: 2, title: "Woah pop",      description: "Pop both hands out to your left side.",             count: "3-4" },
          { order: 3, title: "Wave",          description: "Wave your right hand above your head.",             count: "5-6" },
          { order: 4, title: "Hit it",        description: "Drop your left hand down and hit the beat.",        count: "7-8" },
        ],
      },
      {
        id: "m1t2",
        tiktok_url: "https://www.tiktok.com/@charlidamelio/video/6798261050506808583",
        author_handle: "@charlidamelio",
        author_name: "charli d'amelio",
        thumbnail_url:
          "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop",
        vote_count: 62,
        steps: [
          { order: 1, title: "Slower clap",   description: "Clap twice then cross your right hand.",            count: "1-2-3-4" },
          { order: 2, title: "Slide it",      description: "Slide both hands out to your left.",                count: "5-6" },
          { order: 3, title: "Overhead",      description: "Bring your right hand over your head smooth.",      count: "7-8" },
        ],
      },
    ],
  },
  {
    id: "m2",
    slug: "savage",
    name: "Savage",
    music_id: "6789818245620124933",
    music_title: "Savage - Megan Thee Stallion",
    difficulty: "easy",
    tutorials: [
      {
        id: "m2t1",
        tiktok_url:
          "https://www.tiktok.com/@keke.janajah/video/6789818245620124933",
        author_handle: "@keke.janajah",
        author_name: "Keara Wilson",
        thumbnail_url:
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
        vote_count: 210,
        steps: [
          { order: 1, title: "Side step", description: "Step your left foot out and snap.",              count: "1-2" },
          { order: 2, title: "Hip sway",  description: "Sway hips right while rolling your right shoulder.", count: "3-4" },
          { order: 3, title: "Point",     description: "Point your right hand forward.",                 count: "5-6" },
          { order: 4, title: "Strut",     description: "Walk forward two steps with attitude.",          count: "7-8" },
        ],
      },
    ],
  },
  {
    id: "m3",
    slug: "say-so",
    name: "Say So",
    music_id: "6786002242710588678",
    music_title: "Say So - Doja Cat",
    difficulty: "hard",
    tutorials: [
      {
        id: "m3t1",
        tiktok_url:
          "https://www.tiktok.com/@haleyysheldon/video/6786002242710588678",
        author_handle: "@haleyysheldon",
        author_name: "Haley Sheldon",
        thumbnail_url:
          "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop",
        vote_count: 88,
        steps: [
          { order: 1, title: "Hair flick", description: "Flick your right hand through your hair.", count: "1-2" },
          { order: 2, title: "Phone",      description: "Mime holding a phone to your left ear.",   count: "3-4" },
          { order: 3, title: "Roll",       description: "Roll both arms in front of you.",          count: "5-6" },
          { order: 4, title: "Pose",       description: "Pose with your left hand on your hip.",    count: "7-8" },
        ],
      },
    ],
  },
];

export function searchMockTrends(q) {
  if (!q) return MOCK_TRENDS;
  const needle = q.toLowerCase();
  return MOCK_TRENDS.filter(
    (t) =>
      t.name.toLowerCase().includes(needle) ||
      (t.music_title || "").toLowerCase().includes(needle)
  );
}

export function getMockTrendBySlug(slug) {
  return MOCK_TRENDS.find((t) => t.slug === slug) || null;
}
