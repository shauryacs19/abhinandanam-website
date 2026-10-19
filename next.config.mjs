/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static HTML in out/ - host on Vercel, Netlify or S3 + CloudFront
  trailingSlash: true, // /hotels/abhinandanam/ -> /hotels/abhinandanam/index.html (works on plain S3)
  images: { unoptimized: true }, // we ship pre-built WebP + srcset ourselves
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
