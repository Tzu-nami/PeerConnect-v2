import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yiwhpuvackxkdtayusgx.supabase.co',
            },
        ],
    },

};

export default nextConfig;
