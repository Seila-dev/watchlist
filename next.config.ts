import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
     domains: [
      'i.pinimg.com',
      'imusic.b-cdn.net',
            'static.wikia.nocookie.net',
                  'upload.wikimedia.org',
      // adicione outros domínios das capas que aparecerem na sua API
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org", 
      },
    ],
  },
};

export default nextConfig;
