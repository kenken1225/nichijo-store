# カート・チェックアウト

## 概要

カートは自サイトで管理し、注文確定（チェックアウト）は Shopify のチェックアウトページに任せる構成。  
カート ID は httpOnly Cookie(XSS 攻撃対策) で保持し、Storefront API で商品の追加・更新・削除を行う。

## 使用技術

- Next.js App Router
- Shopify Storefront API（Cart API）
- Cookie（cartId）
- next.config の rewrites で Shopify チェックアウトへ転送

## ページ・ルート

| 種類   | パス               | 説明                                               |
| ------ | ------------------ | -------------------------------------------------- |
| ページ | `/[locale]/cart`   | カート画面（数量変更・削除・チェックアウトボタン） |
| API    | POST `/api/cart`   | 商品追加（新規カート作成 or 既存カートに追加）     |
| API    | PATCH `/api/cart`  | ライン数量変更                                     |
| API    | DELETE `/api/cart` | ライン削除                                         |
| 転送   | `/checkout/:path*` | Shopify チェックアウトへ rewrite                   |
| 転送   | `/cart/c/:path*`   | Shopify のカート URL へ rewrite（必要に応じて）    |

※ ページは `[locale]` 配下のため、実際の URL は例: `/en/cart`。

## カートの流れ

1. **追加**: 商品ページなどで「カートに入れる」→ POST `/api/cart`（body は merchandiseId と quantity のみ。**クライアントは cartId を送らない**）。API が **Cookie から cartId を読む**。無ければ `createCart`、あれば `addToCart`。レスポンスで cartId を Set-Cookie（httpOnly、6 日間）。
2. **表示**: `/cart` ページ（サーバー）で Cookie の cartId を読み、`getCart(cartId)` で内容取得。国コードは Cookie（`country_code`）に合わせて `updateCartCountry` で揃える。
3. **更新・削除**: 数量変更は PATCH（body: lineId, quantity）、ライン削除は DELETE（body: lineIds）。**cartId は body に含めない**。リクエストに Cookie が自動で付くため、API が Cookie から cartId を読んで操作する。
4. **チェックアウト**: カートの `checkoutUrl`（Shopify が発行）へのリンクをそのまま使用。`/checkout/...` は next.config の rewrite で `https://${SHOPIFY_STORE_DOMAIN}/checkout/:path*` に転送され、Shopify の画面になる。

## 認証・国設定

- **カート API**: 認証不要。**cartId は API が Cookie から取得する**（クライアントは body に載せない）。Cookie に cartId があればそのカートを操作し、無ければ新規作成。
- **国コード**: `COUNTRY_COOKIE_KEY`（`country_code`）の Cookie（middleware で Geo-IP またはユーザー選択で設定）。API 内で `getCountryFromCookie()` し、`createCart` / `addToCart` / `updateCartLine` / `removeFromCart` / `updateCartCountry` に渡して Shopify に送る。

## ファイル構成

```
app/[locale]/cart/page.tsx   # カートページ
app/api/cart/route.ts        # カート API（POST / PATCH / DELETE）。cartId は Cookie 優先、body は後方互換
src/components/cart/CartContent.tsx   # カートUI（数量変更・削除・チェックアウトリンク）
src/components/products/ProductActions.tsx  # 商品ページの「カートに入れる」・ドロワー（cartId は localStorage に保存しない）
src/contexts/CartContext.tsx # ヘッダー用のカート個数など
src/contexts/CountryContext.tsx  # 国・通貨（表示・API用）
src/lib/shopify/cart.ts      # createCart, addToCart, updateCartLine, removeFromCart, getCart, updateCartCountry
```

## 備考

- 配送料・税は「チェックアウト時に計算」のため、カート画面では「計算時に表示」などの文言で案内。
- `SHOPIFY_STORE_DOMAIN` が未設定だと rewrites は追加されず、チェックアウトリンクは自ドメインの `/checkout/...` のままになるため、本番では必ず設定すること。
- **cartId は httpOnly Cookie のみ**。クライアント（JS）では読めないため、XSS で cartId を盗まれるリスクを抑えている。
- カートが存在しない（期限切れ等）で `addToCart` がエラーになった場合、API 側で新規カートを作成して成功レスポンスを返すため、クライアントのリトライは必須ではない。
