import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSiteConfig, publishSiteConfig } from "@/lib/site-config.functions";
import heroBg from "@/assets/hero-bg.jpg";

import longevityPeachAsset from "@/assets/longevity-peach.png.asset.json";
import peachBotanical from "@/assets/peach-botanical.png";
import motif1 from "@/assets/motif-1.png";
import motif2 from "@/assets/motif-2.png";
import motif3 from "@/assets/motif-3.png";
import motif4 from "@/assets/motif-4.png";
import motif5 from "@/assets/motif-5.png";
import cloudMotif from "@/assets/cloud-motif.png";
import timelineVine from "@/assets/timeline-vine.png";
const longevityPeach = longevityPeachAsset.url;

import custom1 from "@/assets/custom/1.webp";
import custom2 from "@/assets/custom/2.webp";
import custom3 from "@/assets/custom/3.webp";
import custom4 from "@/assets/custom/4.webp";
import custom5 from "@/assets/custom/5.webp";
import custom6 from "@/assets/custom/6.webp";
import custom7 from "@/assets/custom/7.webp";
import custom8 from "@/assets/custom/8.webp";
import custom9 from "@/assets/custom/9.webp";
import custom10 from "@/assets/custom/10.webp";

export const Route = createFileRoute("/")({
  component: Invitation,
});

const MOTIFS = [motif2, motif1, motif4, motif3, motif2, motif5, motif4, motif1];
const rose2 = motif2;
const ROSES = MOTIFS;

/* ── Types ─────────────────────────────────────────────── */
type Milestone = {
  year: string;
  title: string;
  caption: string;
  tag: string;
  photo?: string;
};

type Content = {
  heroEyebrow: string;
  heroName: string;
  heroChar: string;
  heroTurns: string;
  heroTurnsEmph: string;
  heroTagline: string;
  invEyebrow: string;
  invHeading: string;
  invDate: string;
  invDateSub: string;
  invVenue: string;
  invVenueSub: string;
  invFamily: string;
  invFamilySub: string;
  invPhoto: string;
  rsvpCta: string;
  rsvpReplyBy: string;
  timelineEyebrow: string;
  timelineHeading: string;
  timelineBody: string;
  closingHeading: string;
  closingBody: string;
  closingReplyLabel: string;
  closingReplyName: string;
  closingReplySub: string;
  facebookCaption: string;
  closingPhoto: string;
};

type Fonts = { serif: string; sans: string; hant: string };

type Design = {
  fonts: Fonts;
  heroImageOpacity: number; // 0..100 for the surrounding hero art
  craneX: number;     // horizontal offset in %, from left edge of hero
  craneY: number;     // vertical offset in %, from top edge of hero
  craneScale: number; // 20..250, percentage of base width
  crane2X: number;
  crane2Y: number;
  crane2Scale: number;
};

/* ── Presets ───────────────────────────────────────────── */
const FONT_PRESETS: Record<"serif" | "sans" | "hant", { label: string; family: string; google: string }[]> = {
  serif: [
    { label: "Cormorant Garamond (current)", family: '"Cormorant Garamond", serif', google: "Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500" },
    { label: "Playfair Display", family: '"Playfair Display", serif', google: "Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500" },
    { label: "Libre Caslon Text", family: '"Libre Caslon Text", serif', google: "Libre+Caslon+Text:ital,wght@0,400;1,400" },
    { label: "EB Garamond", family: '"EB Garamond", serif', google: "EB+Garamond:ital,wght@0,400;0,500;1,400" },
    { label: "Cardo", family: '"Cardo", serif', google: "Cardo:ital,wght@0,400;1,400" },
    { label: "DM Serif Display", family: '"DM Serif Display", serif', google: "DM+Serif+Display:ital@0;1" },
  ],
  sans: [
    { label: "Montserrat (current)", family: '"Montserrat", sans-serif', google: "Montserrat:wght@300;400;500" },
    { label: "Inter", family: '"Inter", sans-serif', google: "Inter:wght@300;400;500" },
    { label: "Work Sans", family: '"Work Sans", sans-serif', google: "Work+Sans:wght@300;400;500" },
    { label: "Jost", family: '"Jost", sans-serif', google: "Jost:wght@300;400;500" },
    { label: "Nunito Sans", family: '"Nunito Sans", sans-serif', google: "Nunito+Sans:wght@300;400;600" },
  ],
  hant: [
    { label: "Noto Serif SC (current)", family: '"Noto Serif SC", serif', google: "Noto+Serif+SC:wght@400;500;700" },
    { label: "Ma Shan Zheng (brush)", family: '"Ma Shan Zheng", serif', google: "Ma+Shan+Zheng" },
    { label: "ZCOOL XiaoWei", family: '"ZCOOL XiaoWei", serif', google: "ZCOOL+XiaoWei" },
    { label: "Liu Jian Mao Cao", family: '"Liu Jian Mao Cao", cursive', google: "Liu+Jian+Mao+Cao" },
    { label: "Noto Sans SC", family: '"Noto Sans SC", sans-serif', google: "Noto+Sans+SC:wght@400;500;700" },
  ],
};

const DEFAULT_CONTENT: Content = {
  heroEyebrow: "You are invited to celebrate",
  heroName: "Linda",
  heroChar: "蔷薇",
  heroTurns: "turning",
  heroTurnsEmph: "ninety",
  heroTagline:
    "Her Chinese name, 蔷薇, is named after the wild rose — bright, resilient, and quietly commanding. Ninety years on, she is all of it, still.",
  invEyebrow: "INVITATION DETAILS",
  invHeading: "Please join us for a celebratory dinner for Linda's 90th birthday.",
  invDate: "18 July 26",
  invDateSub: "Saturday 6.30 pm",
  invVenue: "Spring Court",
  invVenueSub: "52-56 Upper Cross St",
  invFamily: "All of us",
  invFamilySub: "Children, grandchildren, nieces & nephews",
  invPhoto: custom3,
  rsvpCta: "Let us know you're coming",
  rsvpReplyBy: "Kindly reply by 4 July",
  timelineEyebrow: "A life in bloom",
  timelineHeading: "Linda Yu's story",
  timelineBody:
    "A remarkable journey of resilience, sacrifice, and unwavering love.",
  closingHeading: "Keep making memories",
  closingBody:
    "Linda always cherishes good company. If you have some time, give her a call, or simply spend an afternoon catching up. She'd be so happy to see you 😊",
  closingReplyLabel: "Reply to",
  closingReplyName: "Her children",
  closingReplySub: "For more photos and story, add Linda on Facebook",
  facebookCaption: "",
  closingPhoto: custom5,
};

const DEFAULT_DESIGN: Design = {
  fonts: {
    serif: FONT_PRESETS.serif[0].family,
    sans: FONT_PRESETS.sans[0].family,
    hant: FONT_PRESETS.hant[0].family,
  },
  heroImageOpacity: 91,
  craneX: 2,
  craneY: 30.5,
  craneScale: 117,
  crane2X: 3.5,
  crane2Y: 0,
  crane2Scale: 193,
};


const DEFAULT_MILESTONES: Milestone[] = [
  { year: "1936", tag: "The Beginning",  title: "A star is born",
    caption: "Born in Selangor, Malaysia to parents Qiu De and Wu GuanYin, on a summer afternoon, her parents named her - Yu Ah Hoi.",
    photo: custom10 },
  { year: "Childhood", tag: "Carefree days", title: "Curiosity, in bloom",
    caption: "One of her fondest memories when she was 6 years old, was spending her days exploring the countryside, swimming in rivers, and playing from sunrise to sunset with her sister, cousins, and friends from her kampong in Malaysia.",
    photo: custom2 },
  { year: "Singapore", tag: "Migration", title: "Courage to begin",
    caption: "Guided by courage and determination, Linda was the first in her family to move to Singapore, followed by her mum, then her elder brother, then lastly her younger brother. That one brave decision paved the way for generations of the family to call Singapore home.",
    photo: custom4 },
  { year: "Her 30s", tag: "Passion", title: "Finding her voice",
    caption: "Linda stumbled upon singing and it became one of her greatest joys. Whether performing or singing with friends, it brought happiness to her life and to those around her.",
    photo: custom1 },
  { year: "Her 40s", tag: "Motherhood", title: "A mother's strength",
    caption: "Despite heartbreak and life's many obstacles, Linda remained strong. She courageously raised her five children as a single mother, always looking ahead with hope.",
    photo: custom8 },
  { year: "Her 50s", tag: "The Next Generation", title: "Grandmother, matriarch, keeper of stories",
    caption: "The first grandchild arrived, then another, and another. Before long, Linda's family grew to include even great-grandchildren, filling her life with even more love and laughter.",
    photo: custom9 },
  { year: "Her 80s", tag: "A new faith", title: "Accepting Christ",
    caption: "Linda discovered a deeper sense of peace, joy, and purpose through her faith in Christ.",
    photo: custom7 },
  { year: "2026", tag: "Today", title: "Cherishing moments together",
    caption: "After a lifetime of resilience, sacrifice, and love, there's no greater joy than being together—sharing stories, laughter, and moments we'll treasure for years to come.",
    photo: custom6 },
];

const KEYS = {
  milestones: "linda-90-milestones-v1",
  content: "linda-90-content-v1",
  design: "linda-90-design-v1",
  hidden: "linda-90-hidden-v3", // bumped again to recover hero text hidden by delete mode
};

/* ── Shared-state URL hash (design + content + milestones + hidden) rrr─── */
const HASH_KEY = "s";
type HashState = Partial<{ design: Design; content: Content; milestones: Milestone[]; hidden: string[] }>;
function readHashState(): HashState | null {
  if (typeof window === "undefined") return null;
  try {
    const h = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(h);
    const raw = params.get(HASH_KEY);
    if (!raw) return null;
    const json = decodeURIComponent(escape(atob(raw.replace(/-/g, "+").replace(/_/g, "/"))));
    return JSON.parse(json);
  } catch { return null; }
}
function writeHashState(state: { design: Design; content: Content; milestones: Milestone[]; hidden: string[] }): string {
  const json = JSON.stringify(state);
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const url = `${window.location.origin}${window.location.pathname}#${HASH_KEY}=${b64}`;
  window.history.replaceState(null, "", `#${HASH_KEY}=${b64}`);
  return url;
}

/* ── Stable DOM paths (for click-to-delete persistence) ─────────────── */
function pathFor(el: Element, root: Element): string | null {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== root) {
    const p: Element | null = cur.parentElement;
    if (!p) return null;
    const idx = Array.from(p.children).indexOf(cur);
    parts.unshift(`${cur.tagName}:${idx}`);
    cur = p;
  }
  return parts.join(">");
}
function findByPath(root: Element, path: string): Element | null {
  const parts = path.split(">");
  let cur: Element | null = root;
  for (const part of parts) {
    if (!cur) return null;
    const [tag, idxStr] = part.split(":");
    const child: Element | undefined = cur.children[Number(idxStr)];
    if (!child || child.tagName !== tag) return null;
    cur = child;
  }
  return cur;
}

/* ── Persisted state hooks ─────────────────────────────── */
function usePersisted<T>(key: string, fallback: T, hashKey?: "design" | "content" | "milestones" | "hidden") {
  const [val, setVal] = useState<T>(fallback);
  useEffect(() => {
    // URL hash wins over localStorage (so a shared/published link overrides drafts)
    if (hashKey) {
      const hs = readHashState();
      const fromHash = hs && (hs as Record<string, unknown>)[hashKey];
      if (fromHash !== undefined && fromHash !== null) {
        setVal(fromHash as T);
        return;
      }
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback)) {
        if (Array.isArray(parsed)) setVal(parsed as T);
      } else if (parsed && typeof parsed === "object") {
        setVal({ ...(fallback as object), ...parsed } as T);
      } else {
        setVal(parsed as T);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (next: T) => {
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, save] as const;
}

/* ── Google Fonts loader (dynamic — supports any Google family) ─── */
function familyNameFromCss(css: string): string {
  const m = css.match(/["']([^"']+)["']/);
  return (m ? m[1] : css.split(",")[0]).trim();
}
function googleParamFor(css: string): string {
  for (const role of ["serif", "sans", "hant"] as const) {
    const hit = FONT_PRESETS[role].find((p) => p.family === css);
    if (hit) return hit.google;
  }
  const name = familyNameFromCss(css);
  return `${encodeURIComponent(name).replace(/%20/g, "+")}:ital,wght@0,300;0,400;0,500;0,600;1,400`;
}
function useLoadFonts(fonts: Fonts) {
  useEffect(() => {
    const params = new Set<string>();
    (["serif", "sans", "hant"] as const).forEach((role) => {
      params.add(googleParamFor(fonts[role]));
    });
    const href = `https://fonts.googleapis.com/css2?${[...params]
      .map((f) => `family=${f}`)
      .join("&")}&display=swap`;
    const id = "dynamic-fonts-link";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [fonts.serif, fonts.sans, fonts.hant]);
}

/* ── Reveal on scroll ──────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            if (e.target.hasAttribute("data-watercolor")) e.target.classList.add("watercolor-in");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Rose vine ─────────────────────────────────────────── */
// Peach decoration positions: side alternates, tied to milestone midpoints dynamically
const PEACH_SIDES = [1, -1, 1] as const; // right, left, right for 3 peaches across 8 milestones

function RoseVine({ progress, peachTops }: { progress: number; peachTops: number[] }) {
  // Reveal the painted vine top-to-bottom based on scroll progress.
  const revealPct = Math.max(0, Math.min(1, progress)) * 100;
  const mask = `linear-gradient(to bottom, #000 0%, #000 ${revealPct}%, transparent ${Math.min(revealPct + 6, 100)}%, transparent 100%)`;
  return (
    <div
      className="absolute left-5 sm:left-6 md:left-1/2 top-0 h-full w-16 sm:w-20 md:w-32 -translate-x-1/2 pointer-events-none"
      aria-hidden
    >
      {/* Illustrated vine, revealed as you scroll */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${timelineVine})`,
          backgroundRepeat: "repeat-y",
          backgroundPosition: "center top",
          backgroundSize: "100% auto",
          WebkitMaskImage: mask,
          maskImage: mask,
          transition: "-webkit-mask-image 1800ms cubic-bezier(0.25, 1, 0.5, 1), mask-image 1800ms cubic-bezier(0.25, 1, 0.5, 1)",
          opacity: 0.9,
        }}
      />
      {/* Longevity peaches bloom at milestone midpoints as the vine reveals */}
      {peachTops.map((topPct, i) => {
        const side = PEACH_SIDES[i % PEACH_SIDES.length];
        const visible = revealPct >= topPct - 2;
        return (
          <img
            key={i}
            src={longevityPeach}
            alt="longevity peach"
            loading="lazy"
            style={{
              position: "absolute",
              top: `${topPct}%`,
              left: side > 0 ? "78%" : "22%",
              width: "clamp(2.4rem, 12vw, 4.8rem)",
              opacity: visible ? 1 : 0,
              transform: `translate(-50%, -50%) rotate(${side * 10}deg) scale(${visible ? 1 : 0.3})`,
              transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
              filter: "drop-shadow(0 8px 14px rgba(160,60,40,0.22))",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────── */
function Invitation() {
  const [milestones, setMilestones] = usePersisted<Milestone[]>(KEYS.milestones, DEFAULT_MILESTONES, "milestones");
  const [content, setContent] = usePersisted<Content>(KEYS.content, DEFAULT_CONTENT, "content");
  const [design, setDesign] = usePersisted<Design>(KEYS.design, DEFAULT_DESIGN, "design");
  const [hidden, setHidden] = usePersisted<string[]>(KEYS.hidden, [], "hidden");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vineProgress, setVineProgress] = useState(0);
  const [peachTops, setPeachTops] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Hydrate from the published DB copy on first load. URL hash still wins (drafts/previews).
  // Note: hidden blocks are intentionally NOT restored from the published copy — they are a
  // local editing convenience and should never hide content from live visitors.
  const fetchSiteConfig = useServerFn(getSiteConfig);
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("s=")) return;
    let alive = true;
    fetchSiteConfig().then((res) => {
      if (!alive || !res?.payload) return;
      try {
        const p = JSON.parse(res.payload) as {
          design?: Design; content?: Content; milestones?: Milestone[]; hidden?: string[];
        };
        if (p.design) setDesign({ ...DEFAULT_DESIGN, ...p.design });
        if (p.content) setContent({ ...DEFAULT_CONTENT, ...p.content });
        if (Array.isArray(p.milestones) && p.milestones.length) setMilestones(p.milestones);
      } catch { /* ignore malformed payloads */ }
    }).catch(() => { /* offline / not configured yet — keep local */ });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply hidden paths to DOM (runs after every render so it survives re-renders)
  useLayoutEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>('[data-hidden-by-editor="1"]').forEach((el) => {
      el.style.display = "";
      el.removeAttribute("data-hidden-by-editor");
    });
    hidden.forEach((p) => {
      const el = findByPath(root, p) as HTMLElement | null;
      if (el) {
        el.style.display = "none";
        el.setAttribute("data-hidden-by-editor", "1");
      }
    });
  });

  // Click-to-delete in edit mode
  useEffect(() => {
    if (!editMode) return;
    const root = mainRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("[data-no-edit]")) return;
      e.preventDefault();
      e.stopPropagation();
      const p = pathFor(t, root);
      if (!p) return;
      if (!confirm("Delete this element? You can restore it from the control panel.")) return;
      setHidden([...hidden, p]);
    };
    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, [editMode, hidden, setHidden]);


  useReveal();
  useLoadFonts(design.fonts);

  // Apply font CSS variables live
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-serif", design.fonts.serif);
    root.style.setProperty("--font-sans", design.fonts.sans);
    root.style.setProperty("--font-hant", design.fonts.hant);
  }, [design.fonts.serif, design.fonts.sans, design.fonts.hant]);

  useEffect(() => {
    const computePeachTops = () => {
      const el = timelineRef.current;
      if (!el) return;
      const containerHeight = el.offsetHeight;
      if (containerHeight === 0) return;
      const items = el.querySelectorAll<HTMLElement>("ol > li");
      if (items.length === 0) return;
      // Place peaches at every 3rd milestone (indices 1, 4, 7 → i.e., 2nd, 5th, 8th)
      const peachIndices = [1, 4, 7].filter((idx) => idx < items.length);
      // Use offsetTop which is layout-stable (not scroll-dependent)
      const tops = peachIndices.map((idx) => {
        const item = items[idx];
        // offsetTop is relative to the offsetParent; walk up to el if needed
        let offsetTop = item.offsetTop + item.offsetHeight * 0.35;
        let cur: HTMLElement | null = item.offsetParent as HTMLElement | null;
        while (cur && cur !== el) {
          offsetTop += cur.offsetTop;
          cur = cur.offsetParent as HTMLElement | null;
        }
        return Math.max(2, Math.min(98, (offsetTop / containerHeight) * 100));
      });
      setPeachTops(tops);
    };

    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const containerRect = el.getBoundingClientRect();
      const containerHeight = el.offsetHeight;
      if (containerHeight === 0) return;

      // Progress = how far the vine container has been scrolled through
      // 0 when container top enters viewport bottom, 1 when container bottom exits viewport top
      const vh = window.innerHeight;
      // Slow reveal: starts when top of container is 80% down the viewport, completes at bottom
      const scrolled = vh * 0.9 - containerRect.top;
      const total = containerHeight + vh * 0.9;
      const rawProgress = scrolled / total;
      setVineProgress(Math.max(0, Math.min(1, rawProgress)));
    };

    const onLayout = () => {
      computePeachTops();
      onScroll();
    };

    onLayout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayout);
    };
  }, [milestones.length]);

  const heroMask = useMemo(
    () =>
      // Radial: opaque at outer edges, transparent through the middle band → text area stays blank paper
      "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 0%, transparent 45%, rgba(0,0,0,0.6) 70%, #000 100%)",
    []
  );

  return (
    <main ref={mainRef} className={`relative bg-mist text-ink font-sans overflow-x-hidden ${editMode ? "edit-mode" : ""}`}>
      <style data-no-edit dangerouslySetInnerHTML={{ __html: `
        main.edit-mode * { cursor: crosshair !important; }
        main.edit-mode *:hover { outline: 2px dashed oklch(0.58 0.15 22) !important; outline-offset: 2px; background: color-mix(in oklab, oklch(0.58 0.15 22) 8%, transparent) !important; }
        main.edit-mode [data-no-edit], main.edit-mode [data-no-edit] * { cursor: auto !important; outline: none !important; background: none !important; }
        @keyframes peach-float-left {
          0%   { transform: rotate(-18deg) translateY(0px) scale(1); }
          50%  { transform: rotate(-14deg) translateY(-12px) scale(1.03); }
          100% { transform: rotate(-18deg) translateY(0px) scale(1); }
        }
        @keyframes peach-float-right {
          0%   { transform: rotate(14deg) scaleX(-1) translateY(0px); }
          50%  { transform: rotate(10deg) scaleX(-1) translateY(-10px); }
          100% { transform: rotate(14deg) scaleX(-1) translateY(0px); }
        }
        @keyframes peach-float-top {
          0%   { transform: rotate(-8deg) translateY(0px); }
          50%  { transform: rotate(-4deg) translateY(8px); }
          100% { transform: rotate(-8deg) translateY(0px); }
        }
        @keyframes peach-fade-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; }
        }
        .hero-peach {
          animation: peach-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-peach-left  { animation: peach-fade-in 1.2s 0.3s cubic-bezier(0.16,1,0.3,1) both, peach-float-left 6s 1.5s ease-in-out infinite; }
        .hero-peach-right { animation: peach-fade-in 1.2s 1.1s cubic-bezier(0.16,1,0.3,1) both, peach-float-right 7s 2.3s ease-in-out infinite; }
        .hero-peach-top   { animation: peach-fade-in 1.2s 0.7s cubic-bezier(0.16,1,0.3,1) both, peach-float-top 5.5s 1.9s ease-in-out infinite; }
      ` }} />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {/* Paper base */}
        <div className="absolute inset-0 bg-mist pointer-events-none" />

        {/* Single hero image, edges only — center is blank so text stays clean */}
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            opacity: design.heroImageOpacity / 100,
            WebkitMaskImage: heroMask,
            maskImage: heroMask,
          }}
        />


        {/* Soft ivory veil for text legibility on mobile */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, color-mix(in oklab, var(--mist) 92%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* ── Floating peach decorations ── */}
        <img
          src={peachBotanical}
          alt=""
          aria-hidden
          loading="eager"
          className="absolute pointer-events-none select-none hero-peach hero-peach-left"
          style={{
            bottom: "6%",
            left: "3%",
            width: "clamp(5rem, 12vw, 9rem)",
            opacity: 0.82,
            filter: "drop-shadow(0 8px 18px rgba(180,80,60,0.18))",
            transform: "rotate(-18deg)",
            animationDelay: "0.3s",
          }}
        />
        <img
          src={peachBotanical}
          alt=""
          aria-hidden
          loading="eager"
          className="absolute pointer-events-none select-none hero-peach hero-peach-right"
          style={{
            bottom: "10%",
            right: "2.5%",
            width: "clamp(4rem, 9vw, 7.5rem)",
            opacity: 0.70,
            filter: "drop-shadow(0 8px 18px rgba(180,80,60,0.15))",
            transform: "rotate(14deg) scaleX(-1)",
            animationDelay: "1.1s",
          }}
        />
        <img
          src={peachBotanical}
          alt=""
          aria-hidden
          loading="eager"
          className="absolute pointer-events-none select-none hero-peach hero-peach-top"
          style={{
            top: "4%",
            right: "6%",
            width: "clamp(3rem, 7vw, 5.5rem)",
            opacity: 0.55,
            filter: "drop-shadow(0 6px 12px rgba(180,80,60,0.12))",
            transform: "rotate(-8deg)",
            animationDelay: "0.7s",
          }}
        />

        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-6 md:px-16 pt-6 sm:pt-8 md:pt-10">
          
        </div>

        <div data-no-edit className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 sm:px-6 text-center py-10 sm:py-12">
          <span className="eyebrow animate-fade-up">{content.heroEyebrow}</span>
          <h1 className="mt-8 md:mt-10 animate-fade-up [animation-delay:120ms]">
            <span className="block font-serif italic text-lilac-deep text-[clamp(3.75rem,13vw,10rem)] leading-[0.9] tracking-tight">
              {content.heroName}
            </span>
            <span className="mt-5 sm:mt-6 flex items-center justify-center gap-3 md:gap-6">
              <span className="h-px w-8 sm:w-10 md:w-16 bg-lilac-deep/40" />
              <span className="font-hant text-3xl md:text-5xl text-lilac-deep">{content.heroChar}</span>
              <span className="h-px w-8 sm:w-10 md:w-16 bg-lilac-deep/40" />
            </span>
            <span className="mt-6 md:mt-8 block font-serif text-xl md:text-3xl text-ink-soft tracking-wider">
              {content.heroTurns} <span className="italic text-lilac-deep">{content.heroTurnsEmph}</span>
            </span>
          </h1>
          <p className="mt-8 md:mt-12 max-w-lg font-serif italic text-lg md:text-2xl text-ink leading-relaxed animate-fade-up [animation-delay:280ms]">
            {content.heroTagline}
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center px-5 pb-8 sm:pb-10 animate-fade-up [animation-delay:600ms]">
          <span className="text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.4em] text-lilac-deep mb-3 text-center">Her story below</span>
          <div className="w-px h-10 bg-gradient-to-b from-lilac-deep/60 to-transparent" />
        </div>
      </section>

      {/* ── INVITATION CARD ──────────────────────────────── */}
      <section className="px-5 sm:px-6 py-16 sm:py-24 md:py-32">
        <div className="max-w-4xl mx-auto reveal" data-reveal>
          <div className="relative bg-paper border border-lilac/30 shadow-frame p-6 sm:p-10 md:p-16">
            <img src={rose2} alt="" width={768} height={768} loading="lazy"
              className="absolute -top-8 -right-4 sm:-top-10 sm:-right-8 w-16 sm:w-20 md:w-28 opacity-90 pointer-events-none"
              style={{ transform: "rotate(15deg)" }} />
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
              {/* Photo circle */}
              <div className="mx-auto md:mx-0">
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-lilac/40 shadow-soft bg-mist">
                  {content.invPhoto ? (
                    <img src={content.invPhoto} alt="Linda" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-hant text-5xl text-lilac-deep/60">
                      {content.heroChar}
                    </div>
                  )}
                </div>
              </div>
              {/* Details */}
              <div className="text-left">
                <span className="eyebrow block mb-6">{content.invEyebrow}</span>
                <h2 className="font-serif italic text-[1.65rem] md:text-3xl text-ink leading-snug">
                  {content.invHeading}
                </h2>
                <div className="rule-gold my-6 max-w-xs" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="eyebrow mb-2">Date</p>
                    <p className="font-serif text-2xl">{content.invDate}</p>
                    <p className="text-sm text-ink-soft mt-1 italic">{content.invDateSub}</p>
                  </div>
                  <div className="sm:border-l sm:border-lilac/25 sm:pl-6">
                    <p className="eyebrow mb-2">Restaurant</p>
                    <p className="font-serif text-2xl">{content.invVenue}</p>
                    <p className="text-sm text-ink-soft mt-1 italic">{content.invVenueSub}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE INTRO ───────────────────────────────── */}
      <section className="relative px-5 sm:px-6 pt-12 sm:pt-16 pb-8 text-center overflow-hidden">
        <div className="max-w-2xl mx-auto relative reveal" data-reveal>
          <span className="eyebrow">{content.timelineEyebrow}</span>
          <h2 className="mt-6 font-serif text-[2.5rem] sm:text-5xl md:text-6xl italic leading-tight text-ink">
            {content.timelineHeading}
          </h2>
          <p className="mt-6 sm:mt-8 font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
            {content.timelineBody}
          </p>
          <div className="rule-gold mt-12 mx-auto max-w-xs" />
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────── */}
      <section className="relative px-5 sm:px-6 py-16 sm:py-24">
        <div ref={timelineRef} className="max-w-5xl mx-auto relative">
          <RoseVine progress={vineProgress} peachTops={peachTops} />
          <ol className="space-y-20 sm:space-y-24 md:space-y-40 relative">
            {milestones.map((m, i) => {
              const left = i % 2 === 0;
              return (
                <li key={i}
                  className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-2 gap-5 sm:gap-6 md:gap-16 items-center"
                >
                  {/* Longevity peach node on the vine line — reveals with the text */}
                  <div className="absolute left-5 sm:left-6 md:left-1/2 -translate-x-1/2 top-3 md:top-1/2 md:-translate-y-1/2 w-8 sm:w-9 md:w-10 z-10 pointer-events-none reveal" data-reveal aria-hidden>
                    <img src={longevityPeach} alt="" className="w-full h-auto drop-shadow-[0_4px_6px_rgba(160,60,40,0.25)]" loading="lazy" />
                  </div>
                  {/* Text column */}
                  <div
                    className={`col-start-2 md:col-start-auto reveal ${left ? "md:pr-24 md:text-right md:order-1" : "md:pl-24 md:order-2"}`}
                    data-reveal
                    style={{ transitionDelay: "80ms" }}
                  >
                    <span className="eyebrow">{m.tag}</span>
                    <p className="mt-3 font-serif italic text-5xl sm:text-6xl md:text-7xl text-lilac-deep leading-none">{m.year}</p>
                    <h3 className="mt-5 font-serif text-[1.65rem] md:text-3xl text-ink leading-snug">{m.title}</h3>
                    <p className="mt-4 text-ink-soft leading-relaxed max-w-md md:max-w-none md:inline-block">{m.caption}</p>
                    {/* Mobile photo */}
                    <div
                      className="mt-8 md:hidden reveal"
                      data-reveal
                      style={{ transitionDelay: "160ms" }}
                    >
                      <PhotoFrame year={m.year} tilt={left ? -1.5 : 1.5} photo={m.photo} />
                    </div>
                  </div>
                  {/* Desktop photo */}
                  <div
                    className={`hidden md:block reveal ${left ? "md:pl-24 md:order-2" : "md:pr-24 md:order-1"}`}
                    data-reveal
                    style={{ transitionDelay: "160ms" }}
                  >
                    <PhotoFrame year={m.year} tilt={left ? -2.5 : 2.5} photo={m.photo} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── CLOSING / FOOTER ─────────────────────────────── */}
      <section id="rsvp" className="relative px-5 sm:px-6 py-16 sm:py-24 md:py-32 bg-paper border-t border-lilac/20 overflow-hidden">
        <div className="max-w-5xl mx-auto reveal" data-reveal>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(180px,320px)_1fr] gap-10 md:gap-16 items-center">
            {/* Photo */}
            <div className="mx-auto md:mx-0">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-lilac/40 shadow-soft bg-mist">
                {content.closingPhoto ? (
                  <img src={content.closingPhoto} alt="Linda" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-hant text-6xl md:text-7xl text-lilac-deep/60">
                    {content.heroChar}
                  </div>
                )}
              </div>
            </div>
            {/* Text */}
            <div className="text-center md:text-left">
              <h2 className="font-serif italic text-3xl md:text-5xl text-ink leading-tight">
                {content.closingHeading}
              </h2>
              <p className="mt-6 font-serif italic text-lg md:text-xl text-ink leading-relaxed max-w-xl">
                {content.closingBody}
              </p>
              <div className="rule-gold my-8 max-w-xs mx-auto md:mx-0" />
              {content.facebookCaption && (
                <p className="mt-6 text-sm text-ink-soft italic">{content.facebookCaption}</p>
              )}
              <p className="mt-6 text-sm text-ink-soft italic">For more photos and story, add Linda on Facebook</p>
              <a
                href="https://www.facebook.com/linda.yu.547"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-plum hover:text-lilac-deep transition-colors"
                aria-label="Linda's Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="underline underline-offset-4">Add her on Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDIT / TWEAK HUD ─────────────────────────────── */}
      {(() => {
        const isEditor = typeof window !== "undefined" && /(^|\.)lovable\.app$/.test(window.location.hostname) && window.location.hostname !== "lindayu.lovable.app";
        if (!isEditor) return null;
        return (
      <div data-no-edit className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-40 flex flex-col items-stretch sm:items-end gap-2">
        {editMode && (
          <div className="bg-plum text-mist text-[11px] uppercase tracking-[0.2em] px-3 py-2 rounded shadow-frame max-w-xs text-right">
            Edit mode — click any element to remove it
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className={`rounded-full shadow-frame px-3 sm:px-4 py-3 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.25em] transition-colors ${
              editMode ? "bg-plum text-mist hover:bg-lilac-deep" : "bg-paper text-plum border border-plum/40 hover:bg-lilac/10"
            }`}
            aria-pressed={editMode}
          >
            {editMode ? "✓ Done editing" : "✂ Delete mode"}
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="bg-lilac-deep text-mist rounded-full shadow-frame px-3 sm:px-5 py-3 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.25em] hover:bg-plum transition-colors"
            aria-label="Open control panel"
          >
            ✎ Tweak site
          </button>
        </div>
      </div>
        );
      })()}

      {/* ── BACK TO TOP ──────────────────────────────────── */}
      <BackToTop />


      {panelOpen && (
        <ControlPanel
          milestones={milestones} onSaveMilestones={setMilestones}
          content={content} onSaveContent={setContent}
          design={design} onSaveDesign={setDesign}
          hidden={hidden} onSaveHidden={setHidden}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </main>
  );
}

/* ── Back to top ───────────────────────────────────────── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      type="button"
      data-no-edit
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-40 w-11 h-11 rounded-full bg-paper text-plum border border-plum/40 shadow-frame hover:bg-lilac/10 transition-colors flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

/* ── Photo frame ───────────────────────────────────────── */
function PhotoFrame({ year, tilt, photo }: { year: string; tilt: number; photo?: string }) {
  return (
    <div className="relative bg-paper border border-lilac/30 shadow-frame p-3 sm:p-4 pb-12 sm:pb-14 max-w-xs sm:max-w-sm mx-auto"
      style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="aspect-[4/5] bg-gradient-to-br from-lilac-soft/40 via-mist to-lilac/10 relative overflow-hidden">
        {photo ? (
          <img src={photo} alt={year} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-hant text-[6rem] sm:text-[8rem] text-lilac-deep/15 select-none leading-none">蔷</span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[9px] uppercase tracking-[0.35em] text-ink-soft/60">A photograph from</span>
              <span className="mt-2 font-serif italic text-3xl text-ink-soft/70">{year}</span>
              <span className="mt-4 text-[9px] uppercase tracking-[0.3em] text-ink-soft/40">add via edit panel</span>
            </div>
          </>
        )}
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center font-serif italic text-sm text-ink-soft">
        — {year} —
      </p>
    </div>
  );
}

/* ── Control panel ─────────────────────────────────────── */
type Tab = "design" | "content" | "milestones" | "deleted";

function ControlPanel({
  milestones, onSaveMilestones,
  content, onSaveContent,
  design, onSaveDesign,
  hidden, onSaveHidden,
  onClose,
}: {
  milestones: Milestone[]; onSaveMilestones: (m: Milestone[]) => void;
  content: Content; onSaveContent: (c: Content) => void;
  design: Design; onSaveDesign: (d: Design) => void;
  hidden: string[]; onSaveHidden: (h: string[]) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("design");
  const [draftMilestones, setDraftMilestones] = useState(milestones);
  const [draftContent, setDraftContent] = useState(content);
  const [draftDesign, setDraftDesign] = useState(design);

  const [shareStatus, setShareStatus] = useState<string>("");
  const [publishStatus, setPublishStatus] = useState<string>("");
  const [publishing, setPublishing] = useState(false);

  const doPublish = useServerFn(publishSiteConfig);

  const saveAll = () => {
    onSaveMilestones(draftMilestones);
    onSaveContent(draftContent);
    onSaveDesign(draftDesign);
    onClose();
  };

  const shareLink = async () => {
    // Commit drafts first so what you copy matches what you see.
    onSaveMilestones(draftMilestones);
    onSaveContent(draftContent);
    onSaveDesign(draftDesign);
    // Shared links never carry the hidden-block list.
    const url = writeHashState({
      design: draftDesign,
      content: draftContent,
      milestones: draftMilestones,
      hidden: [],
    });
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("Link copied — paste anywhere, or publish this page.");
    } catch {
      setShareStatus("Copy failed. URL updated in address bar — copy it manually.");
    }
    setTimeout(() => setShareStatus(""), 4000);
  };

  const publishLive = async () => {
    if (publishing) return;
    setPublishing(true);
    setPublishStatus("Publishing…");
    try {
      onSaveMilestones(draftMilestones);
      onSaveContent(draftContent);
      onSaveDesign(draftDesign);
      // Plain JSON POST — bypasses seroval transport which fails on large
      // base64 photo payloads. Hidden-block list is never published.
      const res = await fetch("/api/public/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          payload: {
            design: draftDesign,
            content: draftContent,
            milestones: draftMilestones,
            hidden: [],
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(body.error || `Publish failed (${res.status})`);
      }
      setPublishStatus("Live! Every visitor now sees this version.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Publish failed.";
      setPublishStatus(msg);
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishStatus(""), 6000);
    }
  };



  const resetAll = () => {
    if (!confirm("Reset all customisations to defaults? This also restores deleted blocks.")) return;
    setDraftMilestones(DEFAULT_MILESTONES);
    setDraftContent(DEFAULT_CONTENT);
    setDraftDesign(DEFAULT_DESIGN);
    onSaveHidden([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative ml-auto h-full w-full max-w-2xl bg-paper shadow-frame overflow-y-auto">
        <header className="sticky top-0 bg-paper/95 backdrop-blur border-b border-lilac/25 px-6 py-4 z-10">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow">Control panel</p>
              <h3 className="font-serif italic text-2xl text-ink truncate">Tweak your invitation</h3>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 min-[520px]:col-span-1 min-[520px]:flex min-[520px]:flex-wrap min-[520px]:justify-end">
              <button onClick={resetAll} className="px-3 py-2 text-xs text-ink-soft hover:text-plum">Reset</button>
              <button onClick={shareLink}
                className="px-3 py-2 border border-lilac-deep/40 text-lilac-deep text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] hover:bg-lilac/10">
                Copy link
              </button>
              <button onClick={saveAll}
                className="px-4 py-2 border border-lilac-deep/40 text-lilac-deep text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] hover:bg-lilac/10">Save draft</button>
              <button onClick={publishLive} disabled={publishing}
                className="px-4 py-2 bg-lilac-deep text-mist text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] hover:bg-plum disabled:opacity-60">
                {publishing ? "Publishing…" : "Publish live"}
              </button>
              <button onClick={onClose} className="px-3 py-2 text-ink-soft text-sm">Close</button>
            </div>
          </div>
          {shareStatus && (
            <p className="mt-2 text-[11px] italic text-sage">{shareStatus}</p>
          )}
          {publishStatus && (
            <p className="mt-2 text-[11px] italic text-lilac-deep">{publishStatus}</p>
          )}
          <nav className="mt-4 grid grid-cols-2 gap-1 text-xs sm:flex sm:flex-wrap">
            {(["design", "content", "milestones", "deleted"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 sm:px-4 py-2 uppercase tracking-[0.14em] sm:tracking-[0.2em] border-b-2 transition-colors ${
                  tab === t ? "border-lilac-deep text-lilac-deep" : "border-transparent text-ink-soft hover:text-ink"
                }`}>
                {t === "deleted" ? `Deleted (${hidden.length})` : t}
              </button>
            ))}
          </nav>
        </header>

        <div className="p-5 sm:p-6">
          {tab === "design" && (
            <DesignTab draft={draftDesign} setDraft={setDraftDesign} />
          )}
          {tab === "content" && (
            <ContentTab draft={draftContent} setDraft={setDraftContent} />
          )}
          {tab === "milestones" && (
            <MilestonesTab draft={draftMilestones} setDraft={setDraftMilestones} />
          )}
          {tab === "deleted" && (
            <DeletedTab hidden={hidden} onSave={onSaveHidden} />
          )}

          <p className="text-[11px] text-ink-soft/70 italic pt-6 mt-6 border-t border-lilac/20">
            Changes preview live. <strong>Save draft</strong> keeps them in this browser.
            <strong> Publish live</strong> pushes them to the real site — every visitor to
            lindayu.lovable.app immediately sees this version, no redeploy needed.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ── Design tab ────────────────────────────────────────── */
function DesignTab({ draft, setDraft }: { draft: Design; setDraft: (d: Design) => void }) {
  const setFont = (role: keyof Fonts, family: string) =>
    setDraft({ ...draft, fonts: { ...draft.fonts, [role]: family } });

  return (
    <div className="space-y-8">
      <section>
        <h4 className="eyebrow mb-4">Typography</h4>
        <div className="space-y-4">
          <FontPicker label="Serif (headings & names)" role="serif"
            value={draft.fonts.serif} onChange={(f) => setFont("serif", f)}
            sample="Linda turns ninety" italic />
          <FontPicker label="Sans (labels & UI)" role="sans"
            value={draft.fonts.sans} onChange={(f) => setFont("sans", f)}
            sample="INVITATION DETAILS" upper />
          <FontPicker label="Chinese (蔷薇)" role="hant"
            value={draft.fonts.hant} onChange={(f) => setFont("hant", f)}
            sample="蔷薇 · 九十" />
        </div>
      </section>

      <section>
        <h4 className="eyebrow mb-4">Hero image</h4>
        <label className="block text-xs text-ink-soft">
          Surrounding art intensity — {draft.heroImageOpacity}%
          <input type="range" min={0} max={100} value={draft.heroImageOpacity}
            onChange={(e) => setDraft({ ...draft, heroImageOpacity: Number(e.target.value) })}
            className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          <span className="block mt-1 text-[10px] text-ink-soft/70 italic">
            0 = hidden (plain paper). The centre stays blank so the hero text is always clean.
          </span>
        </label>
      </section>

      <section>
        <h4 className="eyebrow mb-4">Hero crane — position & size</h4>
        <div className="space-y-4">
          <label className="block text-xs text-ink-soft">
            Horizontal position — {(draft.craneX ?? 3).toFixed(1)}% from left
            <input type="range" min={0} max={80} step={0.5}
              value={draft.craneX ?? 3}
              onChange={(e) => setDraft({ ...draft, craneX: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <label className="block text-xs text-ink-soft">
            Vertical position — {(draft.craneY ?? 4).toFixed(1)}% from top
            <input type="range" min={0} max={80} step={0.5}
              value={draft.craneY ?? 4}
              onChange={(e) => setDraft({ ...draft, craneY: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <label className="block text-xs text-ink-soft">
            Size — {draft.craneScale ?? 100}%
            <input type="range" min={20} max={250} step={1}
              value={draft.craneScale ?? 100}
              onChange={(e) => setDraft({ ...draft, craneScale: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <button type="button"
            onClick={() => setDraft({ ...draft, craneX: 3, craneY: 4, craneScale: 100 })}
            className="text-[10px] uppercase tracking-[0.25em] text-ink-soft hover:text-lilac-deep underline">
            Reset crane
          </button>
        </div>
      </section>

      <section>
        <h4 className="eyebrow mb-4">Second crane — position & size</h4>
        <div className="space-y-4">
          <label className="block text-xs text-ink-soft">
            Horizontal position — {(draft.crane2X ?? 18).toFixed(1)}% from left
            <input type="range" min={0} max={80} step={0.5}
              value={draft.crane2X ?? 18}
              onChange={(e) => setDraft({ ...draft, crane2X: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <label className="block text-xs text-ink-soft">
            Vertical position — {(draft.crane2Y ?? 30).toFixed(1)}% from top
            <input type="range" min={0} max={80} step={0.5}
              value={draft.crane2Y ?? 30}
              onChange={(e) => setDraft({ ...draft, crane2Y: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <label className="block text-xs text-ink-soft">
            Size — {draft.crane2Scale ?? 85}%
            <input type="range" min={20} max={250} step={1}
              value={draft.crane2Scale ?? 85}
              onChange={(e) => setDraft({ ...draft, crane2Scale: Number(e.target.value) })}
              className="mt-2 w-full accent-[color:var(--lilac-deep)]" />
          </label>
          <button type="button"
            onClick={() => setDraft({ ...draft, crane2X: 18, crane2Y: 30, crane2Scale: 85 })}
            className="text-[10px] uppercase tracking-[0.25em] text-ink-soft hover:text-lilac-deep underline">
            Reset second crane
          </button>
        </div>
      </section>
    </div>
  );
}

function FontPicker({ label, role, value, onChange, sample, italic, upper }: {
  label: string; role: keyof Fonts; value: string;
  onChange: (family: string) => void;
  sample: string; italic?: boolean; upper?: boolean;
}) {
  const presets = FONT_PRESETS[role];
  const isPreset = presets.some((p) => p.family === value);
  const [custom, setCustom] = useState(isPreset ? "" : familyNameFromCss(value));
  const [mode, setMode] = useState<"preset" | "custom">(isPreset ? "preset" : "custom");
  const genericFallback = role === "sans" ? "sans-serif" : "serif";
  const applyCustom = (name: string) => {
    setCustom(name);
    const trimmed = name.trim();
    if (!trimmed) return;
    onChange(`"${trimmed}", ${genericFallback}`);
  };
  return (
    <div className="border border-lilac/25 bg-mist/40 p-4 rounded">
      <label className="text-xs text-ink-soft block mb-2">{label}</label>
      <div className="flex flex-wrap gap-1 mb-2 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em]">
        <button type="button" onClick={() => setMode("preset")}
          className={`px-2 py-1 border ${mode === "preset" ? "border-lilac-deep text-lilac-deep" : "border-lilac/30 text-ink-soft"}`}>
          Preset
        </button>
        <button type="button" onClick={() => setMode("custom")}
          className={`px-2 py-1 border ${mode === "custom" ? "border-lilac-deep text-lilac-deep" : "border-lilac/30 text-ink-soft"}`}>
          Any Google font
        </button>
      </div>
      {mode === "preset" ? (
        <select value={isPreset ? value : ""} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-lilac/30 bg-paper px-3 py-2 text-ink text-sm">
          {!isPreset && <option value="" disabled>— custom: {familyNameFromCss(value)} —</option>}
          {presets.map((p) => (
            <option key={p.family} value={p.family}>{p.label}</option>
          ))}
        </select>
      ) : (
        <div>
          <input
            type="text"
            value={custom}
            onChange={(e) => applyCustom(e.target.value)}
            placeholder="e.g. Lora, Fraunces, DM Sans, Ma Shan Zheng…"
            className="w-full border border-lilac/30 bg-paper px-3 py-2 text-ink text-sm"
          />
          <p className="mt-1 text-[10px] text-ink-soft/70 italic">
            Type any family from <a href="https://fonts.google.com" target="_blank" rel="noreferrer"
              className="underline hover:text-lilac-deep">fonts.google.com</a>. Match the name exactly.
          </p>
        </div>
      )}
      <div className="mt-3 p-4 bg-paper border border-lilac/20 text-ink break-words"
        style={{
          fontFamily: value,
          fontStyle: italic ? "italic" : undefined,
          textTransform: upper ? "uppercase" : undefined,
          letterSpacing: upper ? "0.25em" : undefined,
          fontSize: upper ? "0.85rem" : "1.6rem",
        }}>
        {sample}
      </div>
    </div>
  );
}

/* ── Content tab ───────────────────────────────────────── */
function PhotoUploadField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const onFile = (file: File | null) => {
    setErr(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Please choose an image file."); return; }
    if (file.size > 4 * 1024 * 1024) { setErr("Image is over 4 MB. Please pick a smaller one."); return; }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result || "")); setBusy(false); };
    reader.onerror = () => { setErr("Could not read that file."); setBusy(false); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="block text-xs text-ink-soft">
      <div className="mb-1">{label}</div>
      <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-3">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-lilac/40 bg-mist shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lilac-deep/60 text-xs">none</div>
          )}
        </div>
        <div className="w-full min-w-0 flex-1 space-y-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 border border-lilac/40 bg-paper hover:bg-lilac/10 text-ink text-xs uppercase tracking-[0.2em]"
              disabled={busy}>
              {busy ? "Loading…" : value ? "Replace" : "Upload photo"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")}
                className="px-3 py-1.5 border border-lilac/40 bg-paper hover:bg-lilac/10 text-ink text-xs uppercase tracking-[0.2em]">
                Remove
              </button>
            )}
          </div>
          <input value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full border border-lilac/30 bg-paper px-3 py-1.5 text-ink text-xs" />
          {err && <p className="text-[11px] text-lilac-deep">{err}</p>}
        </div>
      </div>
    </div>
  );
}

function ContentTab({ draft, setDraft }: { draft: Content; setDraft: (c: Content) => void }) {
  const set = (patch: Partial<Content>) => setDraft({ ...draft, ...patch });
  const F = (label: string, key: keyof Content, opts: { textarea?: boolean } = {}) => (
    <label className="block text-xs text-ink-soft">
      {label}
      {opts.textarea ? (
        <textarea value={draft[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<Content>)}
          rows={3} className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink text-sm" />
      ) : (
        <input value={draft[key]} onChange={(e) => set({ [key]: e.target.value } as Partial<Content>)}
          className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink text-sm" />
      )}
    </label>
  );

  return (
    <div className="space-y-8">
      
      <section className="space-y-3">
        <h4 className="eyebrow">Hero</h4>
        {F("Eyebrow", "heroEyebrow")}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("Name", "heroName")}
          {F("Chinese characters", "heroChar")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("Turns line", "heroTurns")}
          {F("Emphasised word", "heroTurnsEmph")}
        </div>
        {F("Tagline", "heroTagline", { textarea: true })}
      </section>

      <section className="space-y-3">
        <h4 className="eyebrow">Invitation card</h4>
        {F("Eyebrow", "invEyebrow")}
        {F("Heading", "invHeading", { textarea: true })}
        <PhotoUploadField
          label="Linda's photo"
          value={draft.invPhoto}
          onChange={(v) => set({ invPhoto: v })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("Date", "invDate")}
          {F("Date sub", "invDateSub")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("Venue", "invVenue")}
          {F("Venue sub", "invVenueSub")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("Family", "invFamily")}
          {F("Family sub", "invFamilySub")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {F("RSVP button", "rsvpCta")}
          {F("RSVP note", "rsvpReplyBy")}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="eyebrow">A life in bloom (timeline intro)</h4>
        {F("Eyebrow", "timelineEyebrow")}
        {F("Heading", "timelineHeading", { textarea: true })}
        {F("Body", "timelineBody", { textarea: true })}
      </section>

      <section className="space-y-3">
        <h4 className="eyebrow">Closing</h4>
        <PhotoUploadField
          label="Closing photo"
          value={draft.closingPhoto}
          onChange={(v) => set({ closingPhoto: v })}
        />
        {F("Heading", "closingHeading", { textarea: true })}
        {F("Body", "closingBody", { textarea: true })}
        <div className="grid grid-cols-2 gap-3">
          {F("Reply label", "closingReplyLabel")}
          {F("Reply name", "closingReplyName")}
        </div>
        {F("Reply sub", "closingReplySub")}
        {F("Facebook caption", "facebookCaption", { textarea: true })}
      </section>
    </div>
  );
}

/* ── Milestones tab ────────────────────────────────────── */
function MilestonesTab({ draft, setDraft }: { draft: Milestone[]; setDraft: (m: Milestone[]) => void }) {
  const update = (i: number, patch: Partial<Milestone>) =>
    setDraft(draft.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const remove = (i: number) => setDraft(draft.filter((_, idx) => idx !== i));
  const add = () => setDraft([...draft, { year: "", tag: "New chapter", title: "", caption: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.length) return;
    const next = [...draft];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft(next);
  };
  const handleFile = (i: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(i, { photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {draft.map((m, i) => (
        <div key={i} className="border border-lilac/25 bg-mist/50 p-4 sm:p-5 rounded">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-3">
            <span className="eyebrow">Milestone {i + 1}</span>
            <div className="flex flex-wrap justify-end gap-1 text-xs">
              <button onClick={() => move(i, -1)} className="px-2 py-1 hover:bg-lilac/10">↑</button>
              <button onClick={() => move(i, +1)} className="px-2 py-1 hover:bg-lilac/10">↓</button>
              <button onClick={() => remove(i)} className="px-2 py-1 text-plum hover:bg-lilac/10">Remove</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-xs text-ink-soft">Year
              <input value={m.year} onChange={(e) => update(i, { year: e.target.value })}
                className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink font-serif text-lg" />
            </label>
            <label className="text-xs text-ink-soft">Tag
              <input value={m.tag} onChange={(e) => update(i, { tag: e.target.value })}
                className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink" />
            </label>
          </div>
          <label className="text-xs text-ink-soft block mt-3">Title
            <input value={m.title} onChange={(e) => update(i, { title: e.target.value })}
              className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink font-serif" />
          </label>
          <label className="text-xs text-ink-soft block mt-3">Caption
            <textarea value={m.caption} onChange={(e) => update(i, { caption: e.target.value })} rows={3}
              className="mt-1 w-full border border-lilac/30 bg-paper px-3 py-2 text-ink" />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="text-xs text-ink-soft flex items-center gap-3 cursor-pointer">
              <span className="px-3 py-2 border border-lilac/40 bg-paper hover:bg-lilac/10">
                {m.photo ? "Replace photo" : "Upload photo"}
              </span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFile(i, e.target.files?.[0] ?? null)} />
            </label>
            {m.photo && (
              <>
                <img src={m.photo} alt="" className="w-14 h-14 object-cover rounded" />
                <button onClick={() => update(i, { photo: undefined })}
                  className="text-xs text-plum hover:underline">Remove</button>
              </>
            )}
          </div>
        </div>
      ))}
      <button onClick={add}
        className="w-full py-3 border border-dashed border-lilac/50 text-lilac-deep text-xs uppercase tracking-[0.25em] hover:bg-lilac/5">
        + Add milestone
      </button>
    </div>
  );
}

/* ── Deleted-blocks tab ────────────────────────────────── */
function DeletedTab({ hidden, onSave }: { hidden: string[]; onSave: (h: string[]) => void }) {
  const label = (p: string) => {
    const parts = p.split(">");
    const last = parts[parts.length - 1] || p;
    const [tag] = last.split(":");
    return `${tag.toLowerCase()} · depth ${parts.length}`;
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Elements you removed with <strong>Delete mode</strong>. Restore individually or all at once.
        Deletions are saved automatically and included in your shareable link.
      </p>
      {hidden.length === 0 ? (
        <p className="text-xs text-ink-soft/70 italic border border-dashed border-lilac/30 p-6 text-center rounded">
          Nothing deleted yet. Turn on <strong>Delete mode</strong> from the floating buttons, then click any element.
        </p>
      ) : (
        <>
          <button
            onClick={() => onSave([])}
            className="w-full py-2 border border-lilac-deep/40 text-lilac-deep text-[11px] uppercase tracking-[0.2em] hover:bg-lilac/10"
          >
            Restore all
          </button>
          <ul className="space-y-2">
            {hidden.map((p, i) => (
              <li key={p + i} className="flex items-center justify-between gap-3 border border-lilac/25 bg-mist/40 px-3 py-2 rounded">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-ink truncate">{label(p)}</p>
                  <p className="text-[10px] text-ink-soft/70 truncate" title={p}>{p}</p>
                </div>
                <button
                  onClick={() => onSave(hidden.filter((_, idx) => idx !== i))}
                  className="text-xs text-plum hover:underline shrink-0"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
