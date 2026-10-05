/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Vercel сам режет картинки под размер экрана и отдаёт AVIF/WebP
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1200, 1600],
    imageSizes: [96, 160, 256, 384, 512],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    const r = [
      // Районы города объединены в одну страницу доставки (октябрь 2026)
      { source: "/dostavka/:zone(oktyabrskiy-rayon|kirovskiy-rayon|sverdlovskiy-rayon|kuybyshevskiy-rayon|leninskiy-rayon|mamony|pivovarikha)", destination: "/dostavka/", permanent: true },
      // Морепродукты вынесены из «Заморозки» в свой раздел
      { source: "/zamorozka/:slug(krevetki-tigrovye|krevetki-tigrovye-ochishchennye|osminog|midii|kalmar|chuka|krabovye-palochki)", destination: "/moreprodukty/:slug/", permanent: true },
    ];
    // те же правила для адресов со слэшем на конце
    return [...r, ...r.map((x) => ({ ...x, source: x.source + "/" }))];
  },
};
export default nextConfig;
