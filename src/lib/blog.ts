import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
};

function estimateReadingMinutes(content: string): number {
  const cleaned = content.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
  const cjk = (cleaned.match(/[ㄱ-힝一-鿿぀-ヿ]/g) ?? []).length;
  const words = (cleaned.match(/[A-Za-z0-9]+/g) ?? []).length;
  const minutes = Math.ceil(cjk / 500 + words / 200);
  return Math.max(1, minutes);
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function parseFile(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    published: data.published !== false,
    readingMinutes: estimateReadingMinutes(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseFile)
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const filename = `${slug}.md`;
  const full = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(full)) return null;
  return parseFile(filename);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
