// Demo mode: an axios adapter that answers every /api/* request in the
// browser, so the frontend runs as a static site with no Django backend.
// Response shapes copy the real DRF views (see backend/*/views.py). State is
// kept per browser in localStorage, so progress survives a reload.
import {
  PLANT_NAMES, DEMO_PLANT_IMAGES, INSECTS, ITEMS, PRIZES, DAILY_REWARDS,
  QR_CODES, COMMUNITY, POSTS, avatar,
} from "./demoData";

const STORE_KEY = "leadgreen-demo-state-v1";
const PLAYER_ID = 1;


function freshState() {
  return {
    player: {
      id: PLAYER_ID,
      username: "you",
      points_balance: 1250,
      lifetime_points: 1250,
      tree_level: 1,
      tree_growth: 0.2,
      spins: 3,
      insect: null,
      shield_until: 0,
      boost_until: 0,
      boost: 1,
      streak: 2,
      current_day: 3,
      last_collected: 0,
    },
    inventory: { 1: 6, 2: 3, 3: 1 },
    liked: [],
    extraPosts: [],
    likeDelta: {},
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: fall back to in-memory state */
  }
  return freshState();
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function resetDemo() {
  state = freshState();
  save();
}

// ---------- helpers that build DRF-shaped payloads ----------

const plantFor = (level) => ({
  name: PLANT_NAMES[(level - 1) % PLANT_NAMES.length],
  image: `/media/plants/plant${Math.min(level, DEMO_PLANT_IMAGES)}.svg`,
});

const publicItem = ({ parameters, ...rest }) => rest;

function userSummary(id) {
  if (id === PLAYER_ID) {
    return { id, username: state.player.username, profile_picture: avatar(state.player.username) };
  }
  const u = COMMUNITY.find((c) => c.id === id);
  return { id, username: u.username, profile_picture: avatar(u.username) };
}

function allProfiles() {
  const p = state.player;
  return [
    ...COMMUNITY,
    { id: PLAYER_ID, username: p.username, points_balance: p.points_balance, lifetime_points: p.lifetime_points, tree_level: p.tree_level, tree_growth: p.tree_growth },
  ];
}

function gameProfile() {
  const p = state.player;
  const plant = plantFor(p.tree_level);
  return {
    points_balance: p.points_balance,
    tree: { name: plant.name, level: p.tree_level, growth: Math.round(p.tree_growth * 100) / 100, image: plant.image },
    insect: p.insect ? INSECTS.find((i) => i.name === p.insect) : null,
    spins: p.spins,
  };
}

function inventoryList() {
  return ITEMS.filter((i) => state.inventory[i.id] > 0).map((i) => ({ item: publicItem(i), quantity: state.inventory[i.id] }));
}

function serializePost(post) {
  const liked = state.liked.includes(post.id);
  return {
    id: post.id,
    user: userSummary(post.userId),
    image: post.image,
    caption: post.caption,
    created_at: post.created_at,
    private: false,
    approved: true,
    points_received: QR_CODES.find((q) => q.code === post.code)?.points ?? 0,
    likes_count: post.likes + (state.likeDelta[post.id] || 0),
    liked_by_user: liked,
  };
}

const allPosts = () => [...state.extraPosts, ...POSTS].sort((a, b) => b.created_at.localeCompare(a.created_at));

function paginate(list, page, size, path) {
  const start = (page - 1) * size;
  const next = start + size < list.length ? `/api/${path}?page=${page + 1}` : null;
  const previous = page > 1 ? `/api/${path}?page=${page - 1}` : null;
  return { count: list.length, next, previous, results: list.slice(start, start + size) };
}

function rankOf(id) {
  const all = allProfiles();
  const me = all.find((u) => u.id === id);
  return all.filter((u) => u.lifetime_points > me.lifetime_points).length + 1;
}

function fakeJwt() {
  const b64 = (o) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({ token_type: "access", exp, user_id: String(PLAYER_ID) })}.demo`;
}

function grow(amount) {
  const p = state.player;
  if (p.boost_until > Date.now()) amount *= p.boost;
  p.tree_growth += amount;
  while (p.tree_growth >= 1) {
    p.tree_growth -= 1;
    p.tree_level += 1;
  }
}

function spawnInsect() {
  const p = state.player;
  if (p.shield_until > Date.now()) return false;
  const pool = INSECTS.filter((i) => i.level <= p.tree_level);
  p.insect = pool[Math.floor(Math.random() * pool.length)].name;
  return true;
}

function canCollect() {
  return Date.now() - state.player.last_collected >= 24 * 3600 * 1000;
}

// ---------- routes ----------

function useItem(itemId) {
  const p = state.player;
  const item = ITEMS.find((i) => i.id === itemId);
  const respond = (success, message) => ({ ...gameProfile(), success, message, inventory: inventoryList() });

  if (!item || !(state.inventory[itemId] > 0)) return respond(false, "You don't have this item in your inventory!");
  const removesInsect = item.effects.some((e) => e.effect_type === "REMOVE_INSECT");
  if (p.insect && !removesInsect) return respond(false, "There is an insect on the tree! Use an appropriate item first.");

  state.inventory[itemId] -= 1;
  const messages = [];
  const { growth_amount, spawn_chance } = item.parameters;
  if (growth_amount) {
    grow(growth_amount);
    messages.push(`Tree grown by ${growth_amount}`);
  }
  // The demo spawns bugs a little more often than production so the glove has something to do.
  if (spawn_chance && Math.random() < spawn_chance * 3 && spawnInsect()) messages.push("An insect has appeared!");
  for (const effect of item.effects) {
    if (effect.effect_type === "REMOVE_INSECT" && p.insect) {
      p.insect = null;
      messages.push("Insect removed");
    } else if (effect.effect_type === "TEMPORARY_SHIELD") {
      p.shield_until = Date.now() + effect.parameters.duration_seconds * 1000;
      messages.push(`Shield active for ${effect.parameters.duration_seconds / 60} minutes`);
    } else if (effect.effect_type === "TIME_BOOST") {
      p.boost = effect.parameters.speed_multiplier;
      p.boost_until = Date.now() + effect.parameters.duration_seconds * 1000;
      messages.push(`Growth speed increased by x${p.boost}`);
    }
  }
  return respond(true, `Used ${item.name}: ${messages.join(", ")}`);
}

function spin() {
  const p = state.player;
  if (p.spins <= 0) return { success: false, message: "You have no spins left!", spins: 0, points_balance: p.points_balance, prize_amount: 0 };
  const total = PRIZES.reduce((a, x) => a + x.weight, 0);
  let r = Math.random() * total;
  let index = 0;
  while (r > PRIZES[index].weight) r -= PRIZES[index++].weight;
  const value = PRIZES[index].value;
  p.spins -= 1;
  p.points_balance += value;
  p.lifetime_points += value;
  return {
    success: true,
    message: value ? `Congratulations! You won ${value}!` : "Better luck next time! No points won.",
    spins: p.spins,
    points_balance: p.points_balance,
    prize_index: index,
    prize_amount: value,
  };
}

function dailyRewards() {
  const p = state.player;
  const can = canCollect();
  return [
    { streak: p.streak },
    ...DAILY_REWARDS.map((r) => ({
      day: r.day, reward: r.reward, amount: r.amount,
      isCollected: r.day < p.current_day,
      canCollect: can && r.day === p.current_day,
    })),
  ];
}

function collectReward() {
  const p = state.player;
  if (!canCollect()) return [400, {}];
  const r = DAILY_REWARDS[p.current_day - 1];
  if (r.itemId) state.inventory[r.itemId] = (state.inventory[r.itemId] || 0) + r.amount;
  else p.spins += r.amount;
  p.streak += 1;
  p.current_day = (p.current_day % 7) + 1;
  p.last_collected = Date.now();
  return [200, { message: "Reward collected" }];
}

function leaderboard(kind, page) {
  const key = { points: "points_balance", "tree-level": "tree_level", "lifetime-points": "lifetime_points" }[kind];
  const rows = allProfiles()
    .sort((a, b) => b[key] - a[key])
    .map((u, i) => ({ user: userSummary(u.id), points_balance: u.points_balance, lifetime_points: u.lifetime_points, tree_level: u.tree_level, rank: i + 1 }));
  return paginate(rows, page, 10, `leaderboard/${kind}/`);
}

function userProfile(id) {
  const u = allProfiles().find((x) => x.id === id);
  if (!u) return [404, { detail: "Not found." }];
  const plant = plantFor(u.tree_level);
  return [200, {
    user: { ...userSummary(id), points_balance: u.points_balance },
    tree: { name: plant.name, level: u.tree_level, growth: u.tree_growth, image: plant.image },
    posts: allPosts().filter((p) => p.userId === id).map(serializePost),
    rank: rankOf(id),
  }];
}

function readFormData(data) {
  if (data instanceof FormData) return Object.fromEntries(data.entries());
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return data || {};
}

async function createPost(data) {
  const form = readFormData(data);
  const qr = QR_CODES.find((q) => q.code === form.qr_code);
  let image = "/media/posts/recycling-coffee.jpeg";
  if (form.image instanceof Blob) {
    image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(form.image);
    });
  }
  const post = { id: Date.now(), userId: PLAYER_ID, image, caption: form.caption || "", code: form.qr_code, likes: 0, created_at: new Date().toISOString() };
  state.extraPosts.unshift(post);
  if (qr) {
    // In production a Game Keeper approves the post before points land; the demo auto-approves.
    state.player.points_balance += qr.points;
    state.player.lifetime_points += qr.points;
  }
  return [201, serializePost(post)];
}

function toggleLike(id, method) {
  const liked = state.liked.includes(id);
  if (method === "post") {
    if (liked) return [200, { message: "Already liked" }];
    state.liked.push(id);
    state.likeDelta[id] = (state.likeDelta[id] || 0) + 1;
    return [201, { message: "Liked post" }];
  }
  if (!liked) return [400, { message: "You haven't liked this post" }];
  state.liked = state.liked.filter((x) => x !== id);
  state.likeDelta[id] = (state.likeDelta[id] || 0) - 1;
  return [200, { message: "Unliked post" }];
}

async function route(method, path, query, data) {
  const body = () => readFormData(data);
  let m;

  if (path === "auth/login" || path === "auth/register") {
    const { username } = body();
    if (username) state.player.username = String(username).slice(0, 24);
    const tokens = { access: fakeJwt(), refresh: fakeJwt() };
    return [path.endsWith("register") ? 201 : 200, { tokens, user: userSummary(PLAYER_ID) }];
  }
  if (path === "auth/token/refresh") return [200, { access: fakeJwt(), refresh: fakeJwt() }];

  if (path === "game") return [200, gameProfile()];
  if (path === "game/inventory") return [200, inventoryList()];
  if (path === "game/items") return [200, { success: true, items: ITEMS.map(publicItem), points: state.player.points_balance }];
  if ((m = path.match(/^game\/items\/(\d+)\/purchase$/))) {
    const item = ITEMS.find((i) => i.id === Number(m[1]));
    const quantity = Math.max(1, parseInt(body().quantity || 1, 10));
    const total = item.price * quantity;
    if (state.player.points_balance < total) {
      return [400, { success: false, message: `Not enough points! You need ${total} points but have ${state.player.points_balance}`, required_points: total, current_points: state.player.points_balance }];
    }
    state.player.points_balance -= total;
    state.inventory[item.id] = (state.inventory[item.id] || 0) + quantity;
    return [201, {
      success: true,
      message: `Successfully purchased ${quantity} ${item.name}(s)`,
      transaction: { id: Date.now(), item: publicItem(item), quantity, total_price: total, timestamp: new Date().toISOString() },
      inventory: { item: publicItem(item), quantity: state.inventory[item.id] },
      remaining_points: state.player.points_balance,
    }];
  }
  if ((m = path.match(/^game\/use-item\/(\d+)$/))) return [200, useItem(Number(m[1]))];
  if (path === "game/spin/prizes") return [200, { success: true, prizes: PRIZES }];
  if (path === "game/spin") return [200, spin()];
  if (path === "game/reward") return method === "post" ? collectReward() : [200, dailyRewards()];
  if (path === "game/streak") return [200, { streak: state.player.streak }];

  if ((m = path.match(/^leaderboard\/(points|tree-level|lifetime-points)$/))) return [200, leaderboard(m[1], Number(query.get("page") || 1))];

  if (path === "posts") {
    if (method === "post") return createPost(data);
    return [200, paginate(allPosts().map(serializePost), Number(query.get("page") || 1), 5, "posts")];
  }
  if ((m = path.match(/^posts\/(\d+)\/like$/))) return toggleLike(Number(m[1]), method);

  if (path === "qrcodes") return [200, { exists: QR_CODES.some((q) => q.code === query.get("qr_code")) }];

  if ((m = path.match(/^users\/(\d+)$/))) {
    if (method === "patch" && Number(m[1]) === PLAYER_ID && body().username) state.player.username = body().username;
    return userProfile(Number(m[1]));
  }
  if ((m = path.match(/^users\/(\d+)\/posts$/))) {
    const posts = allPosts().filter((p) => p.userId === Number(m[1])).map(serializePost);
    return [200, paginate(posts, Number(query.get("page") || 1), 5, `users/${m[1]}/posts/`)];
  }
  if (path === "users/picture") return [200, { profile_picture: avatar(state.player.username) }];

  return [404, { detail: `Demo mode has no handler for ${method.toUpperCase()} /api/${path}/` }];
}

export async function demoAdapter(config) {
  const base = config.baseURL || "";
  const raw = /^https?:\/\//.test(config.url) || config.url.startsWith("/api") ? config.url : `${base.replace(/\/$/, "")}/${config.url.replace(/^\//, "")}`;
  const url = new URL(raw, window.location.origin);
  if (config.params) Object.entries(config.params).forEach(([k, v]) => url.searchParams.set(k, v));
  const path = url.pathname.replace(/^.*?\/api\//, "").replace(/\/+$/, "");
  const method = (config.method || "get").toLowerCase();

  // A short, human-feeling latency so loading states and animations still play.
  await new Promise((r) => setTimeout(r, 120 + Math.random() * 180));

  const [status, data] = await route(method, path, url.searchParams, config.data);
  save();
  const response = { data, status, statusText: String(status), headers: {}, config, request: {} };
  if (status >= 400) {
    const error = new Error(`Request failed with status code ${status}`);
    error.response = response;
    error.config = config;
    error.isAxiosError = true;
    throw error;
  }
  return response;
}
