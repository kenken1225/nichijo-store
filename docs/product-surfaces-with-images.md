# 商品画像が出る画面・コンポーネント一覧

バッジ（`ProductBadges`）を載せるときの参照用。パスは App Router の `[locale]` 前提（`en` はプレフィックス省略の場合あり）。

## ページ（ルート）

| ページ | ファイル | 主な表示 |
|--------|-----------|----------|
| トップ | `app/[locale]/page.tsx` | `FeaturedProducts`（商品カード） |
| コレクション一覧 | `app/[locale]/collections/page.tsx` | コレクションカード（商品画像ではない） |
| コレクション詳細 | `app/[locale]/collections/[handle]/page.tsx` | `CollectionFilters` → `CollectionProductGrid` → **`ProductCard`** |
| 商品詳細 | `app/[locale]/products/[handle]/page.tsx` | `ProductContent` → **`ProductGallery`** 等 |
| 検索 | `app/[locale]/pages/search/page.tsx` | **`ProductCard`** |
| カート | `app/[locale]/cart/page.tsx` | `CartContent`（行画像）+ `YouMayAlsoLike` |

## 親コンポーネント（商品画像）

| コンポーネント | ファイル | 備考 |
|----------------|----------|------|
| **`ProductCard`** | `src/components/shared/ProductCard.tsx` | 一覧・検索・フィーチャー・レコメンド（default）で使用。`badges` 対応。 |
| **`ProductBadges`** | `src/components/shared/ProductBadges.tsx` | ラベル共通 UI。カード／ギャラリー等に配置。 |
| **`CollectionProductGrid`** | `src/components/collections/CollectionProductGrid.tsx` | `ProductCard` に `badges` を渡す。 |
| **`FeaturedProducts`** | `src/components/home/FeaturedProducts.tsx` | `ProductCard`（現状 `badges` 未接続・要クエリ拡張） |
| **`YouMayAlsoLike`** | `src/components/products/YouMayAlsoLike.tsx` | `ProductCard` または compact 時は自前 `Image`。**`badges` 任意** |
| **`ProductGallery`** | `src/components/products/ProductGallery.tsx` | PDP メイン画像スライダー（バッジは未配置・必要なら `ProductBadges` を重ねる） |
| **`ProductContent`** | `src/components/products/ProductContent.tsx` | PDP の組み立て。`YouMayAlsoLike` にレコメンドを渡す。 |
| **`CartContent`** | `src/components/cart/CartContent.tsx` | カート行のサムネイル |
| **`MiniCartDrawer`** | `src/components/products/MiniCartDrawer.tsx` | ミニカート内 `YouMayAlsoLike` |

## API / ドメイン

| 場所 | ファイル |
|------|----------|
| バッジ用ロジック例 | `src/lib/shopify/domain/collections.ts`（`computeBadges` 相当は `mapProductNode` 内） |
| 最近見た商品 API | `app/api/recent-products/route.ts` → `YouMayAlsoLike`（`useRecentLocalStorage`） |

## バッジの共通ロジック

- **判定**: `src/lib/shopify/domain/product-badges.ts` の `deriveProductBadges`
- **表示**: `src/components/shared/ProductBadges.tsx`（カード画像上は `overlay`、PDP タイトル上は `inline`）

フィーチャー・検索・レコメンド・PDP タイトル・コレクション一覧は、上記クエリで取得した `availableForSale` / `tags` / `totalInventory`（取得できる場合）と代表バリアントの `quantityAvailable` から同じルールでラベルを出しています。
