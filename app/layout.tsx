import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nichijo Japanese Shop",
  description: "Nichijo Japanese Shop",
  icons: {
    icon: "/favicon-nichijo.png",
  },
};

// language specific settings are done in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
