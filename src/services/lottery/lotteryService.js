/**
 * Lottery service.
 *
 * Mirrors the project's "mock now, real API later" pattern (see configService /
 * gamesService): data is served from a local mock so the app runs with no backend,
 * but every read goes through fetchJson() which will hit `${API_URL}/lottery/...`
 * first when a backend is available and only fall back to the mock on failure.
 *
 * Tickets the user buys are persisted to localStorage so "My Tickets" survives reloads.
 */
import { Lottery } from '../../config/enums.js';

const TICKETS_KEY = 'lottery_my_tickets';
const MOCK_CATALOG_URL = '/api/lotteries.json';

/* ── Built-in fallback catalogue (used only if /api/lotteries.json is unreachable) ── */
// pick `pick` numbers out of 1..`pool`. price in the platform currency.
export const DRAW_CATALOG = {
  [Lottery.POWERBALL]:     { id: Lottery.POWERBALL,     name: 'Powerball',   pool: 49, pick: 6, price: 100, jackpot: 120_000_000, color: '#e23b3b', intervalHours: 168,       categories: ['mega', 'weekly'] },
  [Lottery.MEGA_MILLIONS]: { id: Lottery.MEGA_MILLIONS, name: 'Mega Lotto',  pool: 70, pick: 5, price: 1000, jackpot: 10_000_000,  color: '#f0a020', intervalHours: 0.0166667, categories: ['mega'] },
  [Lottery.EURO_JACKPOT]:  { id: Lottery.EURO_JACKPOT,  name: 'EuroJackpot', pool: 50, pick: 5, price: 150, jackpot: 45_000_000,  color: '#5b8def', intervalHours: 720,       categories: ['mega', 'monthly'] },
  [Lottery.DAILY_PICK]:    { id: Lottery.DAILY_PICK,    name: 'Daily Pick',  pool: 36, pick: 4, price: 50,  jackpot: 250_000,     color: '#27c498', intervalHours: 24,        categories: ['daily', 'mega'] },
  [Lottery.KENO_DRAW]:     { id: Lottery.KENO_DRAW,     name: 'Instant Lotto', pool: 80, pick: 10, price: 50, jackpot: 1_000_000,   color: '#9b6bdf', intervalHours: 12,        categories: ['instant', 'daily'] },
};

/* Load the mock catalogue from /api/lotteries.json (cached); fall back to DRAW_CATALOG. */
let _catalogCache = null;
async function loadCatalog() {
  if (_catalogCache) return _catalogCache;
  try {
    const res = await fetch(MOCK_CATALOG_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.draws) && data.draws.length) {
      _catalogCache = Object.fromEntries(data.draws.map((d) => [d.id, d]));
      return _catalogCache;
    }
  } catch {
    /* fall through to built-in */
  }
  _catalogCache = { ...DRAW_CATALOG };
  return _catalogCache;
}

function nextDrawTime(intervalHours) {
  const ms = intervalHours * 3600 * 1000;
  return new Date(Math.ceil(Date.now() / ms) * ms).toISOString();
}

/** All lottery tickets are a 4-digit raffle number from 0001 to 9999. */
export const TICKET_MIN = 1;
export const TICKET_MAX = 9999;
export const padTicket = (n) => String(n).padStart(4, '0');

/** Random ticket number 0001–9999 (returns the unpadded integer). */
export function randomTicketNumber() {
  return Math.floor(Math.random() * TICKET_MAX) + 1;
}

/** Deterministic winning ticket number (seeded), zero-padded "0001"–"9999". */
function seededTicket(seed) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 1_000_000_007;
  x = (x * 1103515245 + 12345) & 0x7fffffff;
  return padTicket((x % TICKET_MAX) + 1);
}

/* ── Public API ────────────────────────────────────────────────────────── */

/** Active draws for the given active-lottery enum list (from mock JSON). */
export async function getDraws(activeLotteries = []) {
  const catalog = await loadCatalog();
  const ids = activeLotteries.length ? activeLotteries : Object.keys(catalog);
  return ids
    .map((id) => catalog[id])
    .filter(Boolean)
    .map((d) => ({ ...d, closesAt: nextDrawTime(d.intervalHours) }));
}

/** Single draw by id (from mock JSON) with its next close time. */
export async function getDrawById(id) {
  const catalog = await loadCatalog();
  const d = catalog[id];
  return d ? { ...d, closesAt: nextDrawTime(d.intervalHours) } : null;
}

/** Past results (most recent first). */
export async function getResults(activeLotteries = []) {
  const catalog = await loadCatalog();
  const ids = activeLotteries.length ? activeLotteries : Object.keys(catalog);
  const today = new Date();
  const results = [];
  for (const id of ids) {
    const d = catalog[id];
    if (!d) continue;
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today.getTime() - i * d.intervalHours * 3600 * 1000);
      const dayKey = `${id}-${date.toISOString().slice(0, 10)}-${i}`;
      results.push({
        id: dayKey,
        lotteryId: id,
        name: d.name,
        color: d.color,
        drawDate: date.toISOString(),
        number: seededTicket(dayKey),
        jackpot: d.jackpot,
      });
    }
  }
  return results.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
}

/* ── My tickets (localStorage) ─────────────────────────────────────────── */

export function getMyTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function buyTicket({ lotteryId, name, color, number, price, jackpot, closesAt }) {
  const tickets = getMyTickets();
  const ticket = {
    id: `${lotteryId}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    lotteryId,
    name,
    color,
    number: padTicket(number),
    price,
    jackpot,
    drawAt: closesAt,
    status: 'pending',
    purchasedAt: new Date().toISOString(),
  };
  tickets.unshift(ticket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  return ticket;
}

export function clearMyTickets() {
  localStorage.removeItem(TICKETS_KEY);
}

/**
 * Deterministic winning number for a draw period — derived purely from the
 * draw id + its draw time, so every player holding a ticket for that exact
 * draw sees the SAME declared result.
 */
export function winningNumberFor(lotteryId, drawAtISO) {
  return seededTicket(`${lotteryId}|${drawAtISO}`);
}

/** Deterministic top-N winning numbers (1st, 2nd, 3rd…) for a draw period. */
export function winningNumbersFor(lotteryId, drawAtISO, n = 3) {
  return Array.from({ length: n }, (_, i) => seededTicket(`${lotteryId}|${drawAtISO}|${i}`));
}

/**
 * Resolve ("declare") any pending tickets whose draw time has passed: compute the
 * winning number for that draw and mark the ticket won/lost. Persists changes and
 * returns the full (updated) ticket list. Safe to call repeatedly (idempotent).
 */
export function resolveTickets() {
  const tickets = getMyTickets();
  const now = Date.now();
  let changed = false;
  for (const tk of tickets) {
    if (tk.status === 'pending' && tk.drawAt && new Date(tk.drawAt).getTime() <= now) {
      const win = winningNumberFor(tk.lotteryId, tk.drawAt);
      tk.winningNumber = win;
      // Tiered prize by how many trailing digits match (right → left).
      const n = String(tk.number), w = String(win);
      let match = 0;
      for (let k = 1; k <= 4; k++) {
        if (n.slice(-k) === w.slice(-k)) match = k; else break;
      }
      const base = tk.price || 100;
      if (match >= 4) { tk.status = 'won'; tk.tier = 1; tk.prizeWon = tk.jackpot || base * 5000; }
      else if (match === 3) { tk.status = 'won'; tk.tier = 2; tk.prizeWon = base * 50; }
      else if (match === 2) { tk.status = 'won'; tk.tier = 3; tk.prizeWon = base * 5; }
      else { tk.status = 'lost'; tk.prizeWon = 0; }
      tk.matched = match;
      tk.resolvedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  return tickets;
}

export default { getDraws, getDrawById, getResults, getMyTickets, buyTicket, clearMyTickets, resolveTickets, winningNumberFor, DRAW_CATALOG };
