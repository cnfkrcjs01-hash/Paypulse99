/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 자동 실행 최적화 설정
  experimental: {
    // 자동 번들링 최적화
    optimizePackageImports: ['lucide-react'],
  },
  // 개발 서버 최적화
  devIndicators: {
    position: 'bottom-right',
  },
  // 파일 감시 최적화
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 모드에서 파일 감시 최적화
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

module.exports = nextConfig;



