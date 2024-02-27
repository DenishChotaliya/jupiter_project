/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET:"DenishChotaliya",
    GOOGLE_CLIENT_ID:
      "262567296698-2nj15rbrqsb8p52h6b3p9c5d4s9ee22o.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    GITHUB_ID:"d05581ee9b3c158dce53",
    GITHUB_SECRET:"7fc91c25a593e94d3d57f598f01c78f53ea0b752",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jupiterstorage.s3.amazonaws.com",
        // port: "",
        // pathname: "/my-bucket/**",
      },
    ],
  },
};

export default nextConfig;
