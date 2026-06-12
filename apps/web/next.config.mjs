import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Move 'turbopack' from 'experimental' to a top-level configuration key
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
