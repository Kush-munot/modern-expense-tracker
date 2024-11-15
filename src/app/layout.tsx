/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />

        <link
          rel="icon"
          href="public/android-chrome-192x192.png"
          type="image/png"
          sizes="192x192"
        />
        <link
          rel="icon"
          href="public/android-chrome-512x512.png"
          type="image/png"
          sizes="512x512"
        />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
