import soniaData from "../sonia.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StationData {
  chapter: string;
  type: string;
  name: string;
  role: string;
  start: number;
  end: number | string;
  place?: string;
  note?: string;
  logo?: string; // Optional image URL or /logos/brand.svg
  website?: string; // Optional company or institution link
  skills?: string[]; // Optional skill tags
}

export interface Palette {
  bg: string;
  fog: string;
  ambient: string;
  accent: string;
}

export interface ChapterInfo {
  name: string;
  stations: StationData[];
  progressStart: number;
  progressEnd: number;
  palette: Palette;
  yearStart: number;
  yearEnd: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CHAPTER_ORDER = [
  "School",
  "College",
  "B-schools",
  "Corporate",
  "Entrepreneur",
  "Global leadership",
  "Fractional CMO era",
] as const;

const PALETTES: Record<string, Palette> = {
  School:               { bg: "#FDE2C8", fog: "#F5C7A0", ambient: "#FFE0B2", accent: "#FF8A65" },
  College:              { bg: "#FFEAA7", fog: "#F9D77A", ambient: "#FFF9E6", accent: "#FDCB6E" },
  "B-schools":          { bg: "#F7C873", fog: "#E8B65A", ambient: "#FFF0DB", accent: "#E17055" },
  Corporate:            { bg: "#B8D8E8", fog: "#97C4D8", ambient: "#E3EFF5", accent: "#74B9FF" },
  Entrepreneur:         { bg: "#FFECD2", fog: "#F0D0A0", ambient: "#FFF5EE", accent: "#E76F51" },
  "Global leadership":  { bg: "#3D4F6F", fog: "#2C3E55", ambient: "#576574", accent: "#A29BFE" },
  "Fractional CMO era": { bg: "#00CEC9", fog: "#38E8D0", ambient: "#81ECEC", accent: "#00B894" },
};

/** Each chapter's scroll-progress window (0 → 1). */
const PROGRESS_RANGES: Record<string, [number, number]> = {
  School:               [0.00, 0.12],
  College:              [0.12, 0.22],
  "B-schools":          [0.22, 0.34],
  Corporate:            [0.34, 0.50],
  Entrepreneur:         [0.50, 0.66],
  "Global leadership":  [0.66, 0.82],
  "Fractional CMO era": [0.82, 1.00],
};

/** CatmullRom control points — raw tuples so this file stays server-safe. */
export const PATH_COORDS: [number, number, number][] = [
  [-40,  0,   0],
  [-34,  0,   8],
  [-26,  0,  10],
  [-18,  0,   4],
  [-12,  0,  -4],
  [ -4,  0,  -8],
  [  4,  0,  -4],
  [ 10,  0,   4],
  [ 18,  0,  10],
  [ 24,  0,   4],
  [ 30,  0,  -4],
  [ 38,  0,  -8],
  [ 44,  0,  -2],
  [ 50,  0,   6],
  [ 56,  0,  10],
  [ 62,  0,   4],
  [ 70,  0,  -2],
  [ 78,  0,   0],
];

/* ------------------------------------------------------------------ */
/*  Build chapter list                                                 */
/* ------------------------------------------------------------------ */

export const chapters: ChapterInfo[] = CHAPTER_ORDER.map((name) => {
  const stations = (soniaData.stations as unknown as StationData[]).filter(
    (s) => s.chapter === name,
  );

  const starts = stations.map((s) => s.start);
  const ends = stations.map((s) => (typeof s.end === "number" ? s.end : 2026));

  return {
    name,
    stations,
    progressStart: PROGRESS_RANGES[name][0],
    progressEnd:   PROGRESS_RANGES[name][1],
    palette:       PALETTES[name],
    yearStart:     starts.length ? Math.min(...starts) : 2020,
    yearEnd:       ends.length   ? Math.max(...ends)   : 2026,
  };
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Return the chapter whose progress window contains `progress`. */
export function getChapterAtProgress(progress: number): ChapterInfo {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (progress >= chapters[i].progressStart) return chapters[i];
  }
  return chapters[0];
}

/** Map 0 → 1 scroll progress to a display year (1999 → 2026). */
export function getYearAtProgress(progress: number): number {
  return Math.round(1999 + progress * (2026 - 1999));
}
