import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "@/styles/index.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify/cart";

export const metadata: Metadata = {
  title: "Nichijo Japanese Shop",
  description: "Nichijo Japanese Shop",
  icons: {
    icon: "/favicon-nichijo.png",
  },
};

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const cart = cartId ? await getCart(cartId) : null;
  const initialCartCount = cart?.totalQuantity ?? 0;

  return (
    <html lang="en">
      <body className={`${notoSans.variable} bg-background text-foreground antialiased`}>
        <CartProvider initialCount={initialCartCount}>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
