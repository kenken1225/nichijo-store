"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useCountry } from "@/contexts/CountryContext";
import { SUPPORTED_COUNTRIES, GEO_CONFIRMED_COOKIE_KEY, type CountryConfig } from "@/lib/country-config";

/**
 * 初回アクセス時に Geo-IP で検出した国を確認するポップアップ
 *
 * - Geo-IP で検出した国を表示して「この設定でいいですか？」と聞く
 * - 「はい」→ そのまま確定
 * - 「変更する」→ 国の選択リストを表示
 * - 一度確認したら cookie で記録して二度と出さない
 */
export function CountryPopup() {
  const t = useTranslations("countryPopup");
  const locale = useLocale();
  const { country, setCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);

  useEffect(() => {
    // cookie に geo_confirmed がなければポップアップを表示
    const isConfirmed = document.cookie.includes(`${GEO_CONFIRMED_COOKIE_KEY}=true`);
    if (!isConfirmed) {
      // 少し遅延させて、ページが読み込まれてから表示
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConfirm = () => {
    // 現在の国で確定
    markAsConfirmed();
    setIsOpen(false);
  };

  const handleChangeCountry = (newCountry: CountryConfig) => {
    markAsConfirmed();
    setIsOpen(false);
    setCountry(newCountry.code);
  };

  const handleClose = () => {
    // 閉じるだけ（次回も表示される）→ 確定扱いにする
    markAsConfirmed();
    setIsOpen(false);
  };

  const markAsConfirmed = () => {
    document.cookie = `${GEO_CONFIRMED_COOKIE_KEY}=true;path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* ポップアップ */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!showCountryList ? (
            /* 確認画面 */
            <div className="p-6">
              <div className="text-center mb-6">
                <span className="text-5xl mb-3 block">{country.flag}</span>
                <p className="text-gray-600 text-sm mt-3">
                  {t("detected", { country: locale === "ar" ? country.nameAr : country.nameEn })}
                </p>
                <p className="text-gray-900 font-medium mt-2">
                  {t("currency")}: {country.currency} ({country.currencyNameEn})
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCountryList(true)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  {t("change")}
                </button>
              </div>
            </div>
          ) : (
            /* 国選択リスト */
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-3 px-1">{t("selectCountry")}</p>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {SUPPORTED_COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleChangeCountry(c)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                      c.code === country.code
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="flex-1">{locale === "ar" ? c.nameAr : c.nameEn}</span>
                    <span className="text-gray-400 text-xs">{c.currency}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
