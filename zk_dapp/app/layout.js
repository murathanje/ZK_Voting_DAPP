import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Merkeziyetsiz ZK Oylama Uygulaması",
  description:
    "Merkeziyetsiz Zero-Knowledge (Sıfır Bilgi İspatı) Oylama Uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={inter.className}
        style={{ background: "white", color: "black" }}
      >
        {children}
      </body>
    </html>
  );
}
