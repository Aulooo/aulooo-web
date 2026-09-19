import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O padrão (bottom-left) sobrepõe os controles do rodapé da Sidebar
  // (menu do usuário, sino de notificação, tema).
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
