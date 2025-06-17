/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/a/**',
          port: '',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
          port: '',
        }
      ],
    },
    env: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    
  
  }
  
  export default nextConfig