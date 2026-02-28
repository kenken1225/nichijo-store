## 概要
商品ページの表示・カート操作まわりと、カート API・型定義を更新しました。カートは httpOnly Cookie で cartId を保持する構成に合わせてあります。

## 背景・目的
- カートを自サイトで管理し、チェックアウトは Shopify に任せる構成のため、cartId を Cookie 優先で扱うように統一
- 商品ページの UI・データ取得と型定義の整理

## 主な変更内容
- **商品ページ**: `products/[handle]/page.tsx` のメタデータ・レンダリング、`ProductGallery` / `ProductInfo` / `ProductActions` の更新
- **カート**: `app/api/cart/route.ts` で cartId を Cookie 優先取得・国コード同期、`CartContent.tsx` の UI
- **Shopify 周り**: `src/lib/shopify/products.ts`・`queries.ts`、`src/lib/types/shopify.ts` の型・クエリ整理
- **その他**: `app/sitemap.ts` の更新、`docs/account-feature.md` の修正
- **ドキュメント**: カート・チェックアウトの仕様を `docs/cart-checkout.md` に追加

## 確認してほしい点
- 商品ページで「カートに入れる」→ カートページで数量変更・削除・チェックアウトリンクまで一通り動作すること
- 特になし
