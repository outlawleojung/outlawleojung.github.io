import { companies, type Company, type Project } from "./portfolio";

export type ProjectRef = {
  project: Project;
  company: Company;
  anchorId: string;
  startYear: number | null;
  endYear: number | null;
  ongoing: boolean;
};

export function projectAnchorId(company: Company, project: Project): string {
  return `${slug(company.name)}--${slug(project.name)}`;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[·・]/g, "-")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

const YEAR_MONTH = /(\d{4})\.(\d{1,2})/g;

export function parsePeriod(period: string): {
  startYear: number | null;
  endYear: number | null;
  ongoing: boolean;
} {
  const matches = Array.from(period.matchAll(YEAR_MONTH));
  const ongoing = /재직\s*중|현재|~\s*$/.test(period);
  if (matches.length === 0) {
    return { startYear: null, endYear: null, ongoing };
  }
  const startYear = Number(matches[0][1]);
  const endYear = matches.length > 1 ? Number(matches[1][1]) : null;
  return { startYear, endYear, ongoing };
}

export function allProjectRefs(): ProjectRef[] {
  const refs: ProjectRef[] = [];
  for (const company of companies) {
    for (const project of company.projects) {
      const { startYear, endYear, ongoing } = parsePeriod(project.period);
      refs.push({
        project,
        company,
        anchorId: projectAnchorId(company, project),
        startYear,
        endYear,
        ongoing,
      });
    }
  }
  return refs;
}

export function sortRefsNewestFirst(refs: ProjectRef[]): ProjectRef[] {
  return [...refs].sort((a, b) => {
    const ay = a.startYear ?? 0;
    const by = b.startYear ?? 0;
    if (ay !== by) return by - ay;
    return 0;
  });
}

export type SkillUsage = {
  skill: string;
  projects: ProjectRef[];
  spanFrom: number | null;
  spanTo: number | null;
  spanOngoing: boolean;
};

const CURRENT_YEAR = 2026;

export function skillUsageMap(): Map<string, SkillUsage> {
  const map = new Map<string, SkillUsage>();
  for (const ref of allProjectRefs()) {
    for (const s of ref.project.stack) {
      const key = s;
      const entry =
        map.get(key) ??
        ({
          skill: s,
          projects: [],
          spanFrom: null,
          spanTo: null,
          spanOngoing: false,
        } satisfies SkillUsage);
      entry.projects.push(ref);
      if (ref.startYear !== null) {
        entry.spanFrom =
          entry.spanFrom === null ? ref.startYear : Math.min(entry.spanFrom, ref.startYear);
      }
      const refEnd = ref.ongoing ? CURRENT_YEAR : ref.endYear ?? ref.startYear;
      if (refEnd !== null) {
        entry.spanTo = entry.spanTo === null ? refEnd : Math.max(entry.spanTo, refEnd);
      }
      if (ref.ongoing) entry.spanOngoing = true;
      map.set(key, entry);
    }
  }
  return map;
}

export function skillMeta(
  skill: string,
  usageMap: Map<string, SkillUsage>
): { years: number | null; ongoing: boolean; projectCount: number } {
  const entry = usageMap.get(skill);
  if (!entry || entry.spanFrom === null || entry.spanTo === null) {
    return { years: null, ongoing: false, projectCount: 0 };
  }
  const years = Math.max(1, entry.spanTo - entry.spanFrom + 1);
  return {
    years,
    ongoing: entry.spanOngoing,
    projectCount: entry.projects.length,
  };
}
