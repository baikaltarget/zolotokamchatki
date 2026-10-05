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
/** Ссылки на статьи из очереди (ещё не опубликованы) превращаем в текст, чтобы не было 404.
 *  Когда статья выйдет, ежедневная сборка сама вернёт ссылку. */
export function unlinkUnpublished(htmlStr: string) {
  const live = new Set(getPosts().map((p) => p.slug));
  // заодно — слэш в конце внутренних ссылок, как в canonical (без 308-редиректа)
  htmlStr = htmlStr.replace(/<img /g, '<img loading="lazy" decoding="async" ');
  htmlStr = htmlStr.replace(/href="(\/[^"#?.]*[^/"#?.])"/g, 'href="$1/"');
  return htmlStr.replace(/<a href="\/blog\/([^"/]+)\/?"[^>]*>([\s\S]*?)<\/a>/g, (m, slug: string, text: string) => (live.has(slug) ? m : text));
}
export async function renderPost(slug: string) {
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return null;
  const out = await remark().use(gfm).use(html).process(post.content);
  return { ...post, html: unlinkUnpublished(out.toString()) };
}
