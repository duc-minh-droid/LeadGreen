// Canned data for demo mode. The catalog (plants, insects, items, prizes, QR
// codes, daily rewards) mirrors backend/game/fixtures/seed.json so the demo
// behaves like the real game. The community (users, posts) is made up.

export const PLANT_NAMES = [
  "Leafy", "Sprouto", "Thorny", "Fuzzbloom", "Budster", "Twigsy", "Fernie", "Petali", "Saply", "Bloomy",
  "Vineo", "Frondie", "Stemy", "Pluff", "Verdan", "Bristle", "Mossby", "Cloverly", "Tendril", "Barky",
];
// Only the first few plant images are bundled for the demo; later levels reuse the last one.
export const DEMO_PLANT_IMAGES = 16;

export const INSECTS = [
  "Buzzly", "Creepsy", "Chitter", "Zigzag", "Flutter", "Stingster",
  "Munchy", "Gnatso", "Beetlo", "Clicksy", "Mosquibo", "Nettlebug",
].map((name, i) => ({ name, level: i + 1, spawn_chance: 0.2, image: `/media/insects/insect${i + 1}.svg` }));

const EFFECTS = {
  1: { id: 1, name: "REMOVE_INSECT", effect_type: "REMOVE_INSECT", parameters: {} },
  2: { id: 2, name: "Insect Shield (5 minutes)", effect_type: "TEMPORARY_SHIELD", parameters: { duration_seconds: 300 } },
  3: { id: 3, name: "Insect Shield (1 hour)", effect_type: "TEMPORARY_SHIELD", parameters: { duration_seconds: 300 } },
  5: { id: 5, name: "Growth Boost (x3 - 1 day)", effect_type: "TIME_BOOST", parameters: { speed_multiplier: 3, duration_seconds: 86400 } },
};

// `parameters` stays internal (the real serializer does not expose it either).
export const ITEMS = [
  { id: 1, name: "Water", description: "Hydrate your plants", price: 30, image: "/media/items/water_nNK5ICg.png", effects: [], cooldown_seconds: 0, parameters: { growth_amount: 0.1, spawn_chance: 0.02 } },
  { id: 3, name: "Glove", description: "Remove those pests", price: 65, image: "/media/items/glove_RvSlwKO.png", effects: [EFFECTS[1]], cooldown_seconds: 0, parameters: {} },
  { id: 2, name: "Soil", description: "Premium soil from the finest land", price: 80, image: "/media/items/soil_7Ew1uHl.png", effects: [], cooldown_seconds: 3, parameters: { growth_amount: 0.3, spawn_chance: 0.06 } },
  { id: 4, name: "Basic Pesticide", description: "Insect repellent", price: 100, image: "/media/items/pesticide.png", effects: [EFFECTS[2]], cooldown_seconds: 5, parameters: {} },
  { id: 5, name: "Super Pesticide", description: "Those pests are not coming back.", price: 150, image: "/media/items/pesticide-2.png", effects: [EFFECTS[3]], cooldown_seconds: 30, parameters: {} },
  { id: 6, name: "Fertiliser", description: "Enrich your plants with nutrients.", price: 200, image: "/media/items/fertiliser.png", effects: [EFFECTS[5]], cooldown_seconds: 5, parameters: { growth_amount: 0.5 } },
].map((i) => ({ item_type: "CONSUMABLE", ...i }));

export const PRIZES = [
  { id: 1, value: 0, option: "🎁 No Reward", weight: 0.15, style: { backgroundColor: "red", color: "white" } },
  { id: 2, value: 50, option: "🔥 50 Points", weight: 0.35, style: { backgroundColor: "black", color: "white" } },
  { id: 3, value: 100, option: "🌟 100 Points", weight: 0.3, style: { backgroundColor: "red", color: "white" } },
  { id: 4, value: 200, option: "💎 200 Points", weight: 0.15, style: { backgroundColor: "black", color: "white" } },
  { id: 5, value: 500, option: "☘️ 500 Points", weight: 0.4, style: { backgroundColor: "red", color: "white" } },
  { id: 6, value: 1000, option: "🏆 1000 Points", weight: 0.1, style: { backgroundColor: "black", color: "white" } },
];

// Same cycle as reward_day_cycle in backend/game/views.py
export const DAILY_REWARDS = [
  { day: 1, reward: "water", amount: 5, itemId: 1 },
  { day: 2, reward: "spin", amount: 2 },
  { day: 3, reward: "soil", amount: 3, itemId: 2 },
  { day: 4, reward: "spin", amount: 4 },
  { day: 5, reward: "glove", amount: 2, itemId: 3 },
  { day: 6, reward: "spin", amount: 6 },
  { day: 7, reward: "pest", amount: 2, itemId: 5 },
];

export const QR_CODES = [
  { code: "bus-stop-1", location: "Campus Bus Stop", category: "Public Transport", points: 250 },
  { code: "cycling-1", location: "Forum Bike Shed", category: "Cycling", points: 400 },
  { code: "forum-bins-1", location: "Forum Recycling Bins", category: "Recycling", points: 300 },
  { code: "water-refill-1", location: "Marketplace", category: "Reusable", points: 350 },
  { code: "amory-lights", location: "Amory Building", category: "Power", points: 600 },
];

// Simple generated avatars so the demo does not ship anyone's photo.
const AVATAR_COLOURS = ["#1DB954", "#168d40", "#0f766e", "#65a30d", "#15803d", "#047857", "#4d7c0f", "#0e7490"];
export function avatar(name) {
  const colour = AVATAR_COLOURS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLOURS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${colour}"/><text x="32" y="41" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">${name.slice(0, 1).toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// id 1 is reserved for the demo player.
export const COMMUNITY = [
  { id: 2, username: "Amara", points_balance: 1840, lifetime_points: 4650, tree_level: 9, tree_growth: 0.4 },
  { id: 3, username: "Oliver", points_balance: 1320, lifetime_points: 3900, tree_level: 7, tree_growth: 0.7 },
  { id: 4, username: "Priya", points_balance: 960, lifetime_points: 3350, tree_level: 8, tree_growth: 0.2 },
  { id: 5, username: "Jonah", points_balance: 1510, lifetime_points: 2800, tree_level: 5, tree_growth: 0.5 },
  { id: 6, username: "Mei", points_balance: 540, lifetime_points: 2450, tree_level: 6, tree_growth: 0.1 },
  { id: 7, username: "Callum", points_balance: 720, lifetime_points: 1900, tree_level: 4, tree_growth: 0.9 },
  { id: 8, username: "Sofia", points_balance: 380, lifetime_points: 1500, tree_level: 4, tree_growth: 0.3 },
  { id: 9, username: "Theo", points_balance: 610, lifetime_points: 1250, tree_level: 3, tree_growth: 0.6 },
  { id: 10, username: "Hana", points_balance: 220, lifetime_points: 900, tree_level: 3, tree_growth: 0.1 },
  { id: 11, username: "Ravi", points_balance: 150, lifetime_points: 650, tree_level: 2, tree_growth: 0.8 },
  { id: 12, username: "Lucy", points_balance: 300, lifetime_points: 400, tree_level: 2, tree_growth: 0.2 },
];

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

export const POSTS = [
  { id: 105, userId: 2, image: "/media/posts/recycling-coffee.jpeg", caption: "Cup in the right bin for once. Forum bins sorted!", code: "forum-bins-1", likes: 12, created_at: hoursAgo(2) },
  { id: 104, userId: 3, image: "/media/posts/bike-lock.jpg", caption: "Cycled in instead of driving, bike locked up at the Forum.", code: "cycling-1", likes: 9, created_at: hoursAgo(5) },
  { id: 103, userId: 5, image: "/media/posts/waiting-bus.jpg", caption: "Bus to campus this morning. Saved the fuel and the parking.", code: "bus-stop-1", likes: 7, created_at: hoursAgo(9) },
  { id: 102, userId: 4, image: "/media/posts/turning-lights.jpg", caption: "Last one out of the Amory turns off the lights.", code: "amory-lights", likes: 15, created_at: hoursAgo(20) },
  { id: 101, userId: 6, image: "/media/posts/Water-Refill.jpg", caption: "Refilled my bottle at the Marketplace, no plastic today.", code: "water-refill-1", likes: 6, created_at: hoursAgo(30) },
];
