import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Izinkan akses dev server dari HP/laptop lain di jaringan yang sama
  // (mis. 192.168.x.x atau 10.x.x.x) -- tanpa ini Next.js memblokir
  // sebagian file JavaScript-nya sendiri kalau diakses bukan dari
  // localhost, dan fitur yang butuh JS (login, dropdown) jadi rusak.
  allowedDevOrigins: ["10.84.69.121"],
};

export default nextConfig;
