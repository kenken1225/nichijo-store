import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],

  defaultLocale: "en",

  // when the default language (English) is used, do not add /en to the URL
  localePrefix: "as-needed",
});
