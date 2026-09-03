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
};
export default nextConfig;
