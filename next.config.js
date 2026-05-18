/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // 정적 HTML 내보내기 (Cloudflare Pages용)
  trailingSlash: true,     // /result → /result/ (정적 호스팅 라우팅 안정성)
  images: {
    unoptimized: true,     // 정적 내보내기에서 Next.js Image 최적화 비활성
  },
}

module.exports = nextConfig