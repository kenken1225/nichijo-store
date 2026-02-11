import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_COOKIE_KEY, GEO_CONFIRMED_COOKIE_KEY, SUPPORTED_COUNTRIES } from "@/lib/country-config";

// next-intl の middleware を作成
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // まず next-intl の middleware を実行（言語ルーティング）
  const response = intlMiddleware(request);

  // --- Geo-IP による国コード自動検出 ---
  // Vercel が自動で付与する x-vercel-ip-country ヘッダーから国コードを取得
  // ローカル開発時はこのヘッダーがないので、デフォルト（US）になる
  const existingCountry = request.cookies.get(COUNTRY_COOKIE_KEY)?.value;

  if (!existingCountry) {
    // cookie に国コードがまだない場合のみ、Geo-IP から設定
    const geoCountry = request.headers.get("x-vercel-ip-country") ?? "US";

    // サポート対象の国かチェック。対象外ならデフォルト（US）
    const isSupported = SUPPORTED_COUNTRIES.some((c) => c.code === geoCountry);
    const countryCode = isSupported ? geoCountry : "US";

    // cookie に国コードをセット（レスポンスに付与）
    response.cookies.set(COUNTRY_COOKIE_KEY, countryCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1年
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
