// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "smrtalgo.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  transpilePackages: ["sanity", "@sanity/ui", "@sanity/vision"],
};

export default nextConfig;
