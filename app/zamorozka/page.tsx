import CategoryPage from "@/components/CategoryPage";
import { meta } from "@/lib/seo";
import { cat } from "@/lib/site";
const c = cat("zamorozka");
export const metadata = meta({ title: c.title, description: c.description, path: c.path, image: c.image });
export default function Page() { return <CategoryPage slug="zamorozka" />; }
