// Friendly-name check for the Course Clear poster. It runs in the browser, so it is a first line of defence
// (it catches the common cases, including look-alike characters and spaced-out letters), not a guarantee.
const SEVERE = ["nigg", "faggot", "retard", "chink", "wetback", "raghead", "towelhead", "tranny", "beaner", "hitler", "terrorist", "fuck", "shit", "bitch", "cunt", "whore", "bastard", "pussy", "asshole", "bhenchod", "behenchod", "madarchod", "chutiya", "bhosdi"];
const EXACT = ["nazi", "kike", "slut", "rapist", "thevidiya", "pundai", "koothi", "punda", "gandu", "kutta", "kamina", "paki", "gook", "coon", "spic", "fag", "kkk", "dick", "cock", "ass", "arse", "damn", "penis", "vagina", "lund", "randi", "harami", "otha", "sex", "porn", "nude", "isis", "hell", "crap", "piss", "wtf", "idiot", "stupid", "ugly", "fat", "dumb", "loser", "nigga", "nigger", "niga"];

const LEET = { "0": "o", "1": "i", "!": "i", "|": "i", "3": "e", "4": "a", "@": "a", "5": "s", "$": "s", "7": "t", "8": "b", "+": "t", "€": "e", "£": "l" };

const fold = (s) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().split("").map((c) => LEET[c] || c).join("");

export function validateName(raw) {
  const name = (raw || "").replace(/\s+/g, " ").trim();
  if (name.length < 2) return { ok: false, reason: "Please type at least 2 letters." };
  if (name.length > 24) return { ok: false, reason: "Please keep it to 24 characters." };
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name)) return { ok: false, reason: "Letters only please (no numbers, links or symbols)." };
  const folded = fold(name);
  const words = folded.split(/[^a-z]+/).filter(Boolean).map((w) => w.replace(/(.)\1+/g, "$1"));
  const squashed = folded.replace(/[^a-z]/g, "");
  const squashedOne = squashed.replace(/(.)\1+/g, "$1");
  const SAFE = ["scunthorpe", "shiitake", "cocksburn"];
  const sq = SAFE.reduce((a, w) => a.split(w).join(""), squashed);
  const sq1 = sq.replace(/(.)\1+/g, "$1");
  const bad = SEVERE.some((w) => { const d = w.replace(/(.)\1+/g, "$1"); return sq.includes(w) || (d.length >= 4 && sq1.includes(d)); });
  const badWord = words.some((w) => EXACT.includes(w) || EXACT.includes(w.replace(/(.)\1+/g, "$1")));
  if (bad || badWord) return { ok: false, reason: "Let's keep the poster friendly. Please choose a kind name or nickname." };
  return { ok: true, clean: name.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) };
}
