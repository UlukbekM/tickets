/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    // images: {
    //     domains: ['s1.ticketm.net','preview.redd.it','pbs.twimg.com'],
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "s1.ticketm.net",
            },
            {
                protocol: "https",
                hostname: "preview.redd.it",
            },
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
            },
        ],
    },
};

export default nextConfig;
