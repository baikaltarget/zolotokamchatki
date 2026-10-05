import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { unlinkUnpublished } from "./blog";
/** Markdown → HTML для текстов из site.json (сеотексты категорий, страниц) */
export async function md(src: string) {
  return unlinkUnpublished((await remark().use(gfm).use(html).process(src)).toString());
}
