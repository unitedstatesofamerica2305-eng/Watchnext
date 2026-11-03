import React, { useEffect, useMemo, useState } from "react";
import { TITLES } from "./data.js";

/* ---------- helpers ---------- */

// Words in your prompt that map onto a genre in the database.
const GENRE_WORDS = {
  Heist: ["heist", "robbery", "robber", "thief", "thieves", "steal", "caper", "con"],
  Psychological: ["psychological", "psychology", "mind game", "mind games", "mindgame", "mind bending", "mind-bending", "twist", "manipulation", "mental"],
  Action: ["action", "fight", "fights", "fast paced"],
  Thriller: ["thriller", "suspense", "tense", "edge of my seat"],
  Strategy: ["strategy", "strategic", "chess", "tactic", "tactical", "planning", "genius", "smart"],
  Crime: ["crime", "criminal", "mafia", "detective"],
  Mystery: ["mystery", "whodunit", "puzzle", "clues"],
  Drama: ["drama", "emotional"],
  "Sci-Fi": ["sci-fi", "scifi", "sci fi", "science fiction", "time travel", "futuristic"],
  Fantasy: ["fantasy", "magic"],
  Comedy: ["comedy", "funny", "light"],
  Supernatural: ["supernatural"],
};
const TYPE_WORDS = {
  movie: ["movie", "movies", "film", "films"],
  series: ["series", "show", "shows", "tv"],
  anime: ["anime"],
};
const HINDI_WORDS = ["hindi", "dubbed", "dub"];

const has = (text, term) => new RegExp(`(^|[^a-z])${term.replace(/[-\s]/g, "[-\\s]?")}([^a-z]|$)`, "i").test(text);

function parseQuery(raw) {
  const text = raw.toLowerCase();
  const genres = Object.keys(GENRE_WORDS).filter((g) => GENRE_WORDS[g].some((w) => has(text, w)));
  const types = Object.keys(TYPE_WORDS).filter((t) => TYPE_WORDS[t].some((w) => has(text, w)));
  const hindi = HINDI_WORDS.some((w) => has(text, w));
  return { genres, types, hindi, text };
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const TYPE_STYLE = {
  movie: { label: "Movie", cls: "bg-amber-400 text-amber-950" },
  series: { label: "Series", cls: "bg-sky-400 text-sky-950" },
  anime: { label: "Anime", cls: "bg-rose-400 text-rose-950" },
};

const PILLS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies", type: "movie" },
  { id: "series", label: "Series", type: "series" },
  { id: "anime", label: "Anime", type: "anime" },
  { id: "Heist", label: "Heist", genre: "Heist" },
  { id: "Psychological", label: "Psychological", genre: "Psychological" },
  { id: "Strategy", label: "Strategy", genre: "Strategy" },
  { id: "Thriller", label: "Thriller", genre: "Thriller" },
];

const EXAMPLES = [
  "heist movie with action and mind games",
  "strategic anime in hindi",
  "psychological thriller series",
];

/* ---------- app ---------- */

export default function App() {
  const [watched, setWatched] = useLocalStorage("watchnext:watched", []);
  const [hideWatched, setHideWatched] = useLocalStorage("watchnext:hideWatched", true);
  const [hindiOnly, setHindiOnly] = useLocalStorage("watchnext:hindiOnly", false);
  const [pill, setPill] = useState("all");
  const [query, setQuery] = useState("");

  const toggleWatched = (id) =>
    setWatched((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const { results, parsed } = useMemo(() => {
    const parsed = parseQuery(query);
    const activePill = PILLS.find((p) => p.id === pill);

    let list = TITLES.filter((t) => {
      if (hideWatched && watched.includes(t.id)) return false;
      if ((hindiOnly || parsed.hindi) && !t.hindiDubbed) return false; // strict
      if (activePill?.type && t.type !== activePill.type) return false;
      if (activePill?.genre && !t.genres.includes(activePill.genre)) return false;
      if (parsed.types.length && !parsed.types.includes(t.type)) return false;
      return true;
    });

    if (parsed.genres.length) {
      list = list
        .map((t) => ({ t, score: parsed.genres.filter((g) => t.genres.includes(g)).length }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || b.t.rating - a.t.rating)
        .map((x) => x.t);
    } else if (parsed.text.trim() && !parsed.types.length && !parsed.hindi) {
      // No mood words recognised: fall back to a plain title/genre text search.
      const words = parsed.text.split(/\s+/).filter((w) => w.length > 2);
      list = list.filter((t) =>
        words.some((w) => t.title.toLowerCase().includes(w) || t.genres.some((g) => g.toLowerCase().includes(w)))
      );
    } else {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return { results: list, parsed };
  }, [query, pill, hideWatched, hindiOnly, watched]);

  const understood = [
    ...parsed.genres,
    ...parsed.types.map((t) => TYPE_STYLE[t].label),
    ...(parsed.hindi ? ["Hindi dub"] : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-5 pt-10 pb-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">What are you in the mood for?</h1>
        <p className="mt-2 text-[#9a9fae]">
          Describe it in your own words. Titles you've watched stay out of the way.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I want a heist movie with action and mind games"
          className="mt-6 w-full rounded-xl border border-[#2a303d] bg-[#171b24] px-5 py-4 text-lg placeholder:text-[#6b7180] focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300/30"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#9a9fae]">
          {query ? (
            understood.length ? (
              <>
                <span>Matching:</span>
                {understood.map((u) => (
                  <span key={u} className="rounded-md bg-[#232938] px-2 py-0.5 text-[#ebe8e2]">{u}</span>
                ))}
              </>
            ) : (
              <span>No mood words recognised, searching titles and genres instead.</span>
            )
          ) : (
            <>
              <span>Try:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex} onClick={() => setQuery(ex)} className="rounded-md border border-[#2a303d] px-2 py-0.5 hover:border-teal-300 hover:text-teal-200">
                  {ex}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {PILLS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPill(p.id)}
              aria-pressed={pill === p.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                pill === p.id ? "bg-teal-300 text-teal-950" : "bg-[#1c212c] text-[#c9ccd6] hover:bg-[#262c3a]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6 text-sm">
          <Toggle label="Hide watched items" checked={hideWatched} onChange={setHideWatched} />
          <Toggle label="Hindi dub only" checked={hindiOnly} onChange={setHindiOnly} />
          <span className="text-[#9a9fae]">
            {results.length} shown · {watched.length} watched
          </span>
          {watched.length > 0 && (
            <button onClick={() => window.confirm("Clear your watched list?") && setWatched([])} className="text-[#9a9fae] underline hover:text-[#ebe8e2]">
              Clear watched list
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16">
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#2a303d] p-10 text-center text-[#9a9fae]">
            Nothing matches. Loosen the filters, turn off "Hindi dub only", or show watched items.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((t) => (
              <Card key={t.id} item={t} watched={watched.includes(t.id)} onToggle={() => toggleWatched(t.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-5 w-9 rounded-full bg-[#2a303d] transition peer-checked:bg-teal-300 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-300/50 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
      <span>{label}</span>
    </label>
  );
}

function Card({ item, watched, onToggle }) {
  const type = TYPE_STYLE[item.type];
  return (
    <article className={`flex flex-col overflow-hidden rounded-xl border border-[#242a37] bg-[#161a23] ${watched ? "opacity-60" : ""}`}>
      <div className="relative aspect-[2/3] bg-[#1c212c]">
        <img src={item.coverImage} alt={`${item.title} cover`} loading="lazy" className="h-full w-full object-cover" />
        <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-semibold ${type.cls}`}>{type.label}</span>
        <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-300">★ {item.rating.toFixed(1)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h2 className="font-semibold leading-snug">{item.title}</h2>
        <p className="text-xs text-[#9a9fae]">{item.genres.join(", ")}</p>
        <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-medium ${item.hindiDubbed ? "bg-emerald-400/15 text-emerald-300" : "bg-[#232938] text-[#8a90a0]"}`}>
          {item.hindiDubbed ? "Official Hindi dub" : "No Hindi dub"}
        </span>
        <button
          onClick={onToggle}
          aria-pressed={watched}
          className={`mt-auto rounded-lg px-3 py-2 text-sm font-medium transition ${
            watched ? "bg-teal-300 text-teal-950" : "border border-[#2a303d] hover:border-teal-300 hover:text-teal-200"
          }`}
        >
          {watched ? "✓ Watched (undo)" : "Mark as watched"}
        </button>
      </div>
    </article>
  );
}
