import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  devIndicators: false,
  allowedDevOrigins: ['terminal.local'],
  serverExternalPackages: ['@electric-sql/pglite'],
  experimental: {cpus: 2},
  async redirects(){
    return [
      {source:'/para-parceiros',destination:'/parceiros',permanent:true},
      {source:'/lugares',destination:'/explorar?relation=public_point',permanent:true},
    ];
  },
};

export default config;
