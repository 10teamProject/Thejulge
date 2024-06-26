/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bootcamp-project-api.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/6-10/the-julge/**',
      },
      {
        protocol: 'https',
        hostname: 'bootcamp-project-api.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/0-1/the-julge/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/736x/**',
      },
    ],
  },
};

export default nextConfig;
