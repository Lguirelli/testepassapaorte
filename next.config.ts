import type { NextConfig } from 'next';
const config: NextConfig = { distDir: process.env.NEXT_BUILD_DIR || ".next", devIndicators: false, allowedDevOrigins: ['terminal.local'], serverExternalPackages: ['@electric-sql/pglite'], experimental: { cpus: 2 } };
export default config;
