import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.PORTFOLIO_TARGET === 'netlify'
  ? { output: 'export', images: { unoptimized: true } }
  : {};

export default nextConfig;
