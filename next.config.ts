import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the parent folder makes Turbopack guess the
  // wrong workspace root. Pin it to this project.
  turbopack: {
    root: path.join(__dirname),
  },
  // The default bottom-left dev indicator sits on top of the admin sidebar's
  // account block. Move it out of the way.
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    serverActions: {
      // Admin uploads travel through Server Actions, whose body limit defaults
      // to 1MB. This clears the 25MB PDF cap in src/lib/uploads.ts plus the
      // multipart overhead; keep it above that cap if the cap changes.
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
