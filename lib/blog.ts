import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const dir = path.join(process.cwd(), "content/blog");
export type Post = { slug: string; title: string; description: string; date: string; updated?: string; image: string; content: string; faq?: { q: string; a: string }[]; related?: string[] };

export function getPosts(): Post[] {
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    return { slug: f.replace(/\.md$/, ""), content, ...(data as Omit<Post, "slug" | "content">) };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}
export async function renderPost(slug: string) {
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return null;
  const out = await remark().use(gfm).use(html).process(post.content);
  return { ...post, html: out.toString() };
}
