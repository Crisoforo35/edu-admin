import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduAdmin — Sistema de Gestión Académica y Escolar",
  description:
    "Plataforma integral para la gestión académica y escolar. Administra horarios, calificaciones, y más.",
  icons: {
    icon: "/birrete.png",
    shortcut: "/birrete.png",
    apple: "/birrete.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster richColors closeButton expand />
        {children}
      </body>
    </html>
  );
}
