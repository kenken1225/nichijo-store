import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";
import { COUNTRY_COOKIE_KEY, SUPPORTED_COUNTRIES } from "@/lib/country-config";

// next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const existingCountry = request.cookies.get(COUNTRY_COOKIE_KEY)?.value;

  if (!existingCountry) {
    const geoCountry = request.headers.get("x-country") ?? "US";

    const isSupported = SUPPORTED_COUNTRIES.some((c) => c.code === geoCountry);
    const countryCode = isSupported ? geoCountry : "US";

    response.cookies.set(COUNTRY_COOKIE_KEY, countryCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
