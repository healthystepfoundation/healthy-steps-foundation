import type { NextConfig } from "next";

// Photos uploaded through the content editor are served from Supabase Storage,
// so next/image has to be told that host is allowed. The wildcard covers hosted
// Supabase projects; the explicit entry covers a custom or self-hosted domain.
const supabaseHost = process.env.SUPABASE_URL
  ? URL.canParse(process.env.SUPABASE_URL)
    ? new URL(process.env.SUPABASE_URL).hostname
    : undefined
  : undefined;

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: '**.supabase.co',
    pathname: '/storage/v1/object/public/**',
  },
];

if (supabaseHost && !supabaseHost.endsWith('.supabase.co')) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseHost,
    pathname: '/storage/v1/object/public/**',
  });
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  // The Our Mission page was removed (2026-09-14, client request); its mission
  // statement lives on About Us. Keep old links and search results working.
  redirects: async () => [
    { source: '/mission', destination: '/about', permanent: true },
  ],
};

export default nextConfig;
