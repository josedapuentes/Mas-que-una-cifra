import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Más que una cifra | Plataforma Institucional OACP",
  description: "Plataforma de preservación de la memoria histórica y dignificación de las víctimas y constructores de paz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
