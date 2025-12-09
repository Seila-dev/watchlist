// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    // remove "domains" e use somente remotePatterns
    remotePatterns: [
      // antigos domains convertidos para padrões (ajuste pathname se quiser mais restrição)
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" },
      { protocol: "https", hostname: "imusic.b-cdn.net", pathname: "/**" },
      { protocol: "https", hostname: "static.wikia.nocookie.net", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },

      // entradas que você já tinha
      { protocol: "https", hostname: "cdn.myanimelist.net", pathname: "/**" },
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/**" },

      // se precisar de subdomínios ou wildcard de hostname, use patterns como:
      // { protocol: "https", hostname: "**.example-cdn.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
