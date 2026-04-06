import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import "@/styles/index.css";
import { Header } from "@/components/layout/Header";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { CountryPopup } from "@/components/navigation/CountryPopup";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify/domain/cart";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { COUNTRY_COOKIE_KEY } from "@/lib/country-config";

// English font
const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

// Arabic font
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-sans-arabic",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // if the language is not supported, return 404
  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const [messages, cookieStore] = await Promise.all([getMessages(), cookies()]);
  const cartId = cookieStore.get("cartId")?.value;
  const cart = cartId ? await getCart(cartId) : null;
  const initialCartCount = cart?.totalQuantity ?? 0;
  const countryCode = cookieStore.get(COUNTRY_COOKIE_KEY)?.value;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? notoSansArabic.variable : notoSans.variable;

  return (
    <html lang={locale} dir={dir}>
      <body className={`${fontClass} bg-background text-foreground antialiased`}>
        <NavigationProgress />
        <NextIntlClientProvider messages={messages}>
          <CountryProvider initialCountryCode={countryCode}>
            <CartProvider initialCount={initialCartCount}>
              <AuthProvider>
                <div className="flex min-h-screen flex-col">
                  <Header locale={locale} />
                  <main className="flex-1">{children}</main>
                  <Footer locale={locale} />
                </div>
                <CountryPopup />
              </AuthProvider>
            </CartProvider>
          </CountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
