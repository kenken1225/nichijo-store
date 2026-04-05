# SSR / SSG / CSR / ISR の使い分け（面接準備用）

このドキュメントは、本 EC プロジェクトでどのレンダリング方式をどこで使っているか、なぜそうしたか、および各方式のメリット・デメリットを**コードに即して**説明するためのものです。

---

## 1. このプロジェクトで使っている開発方式の全体像

| 方式         | 使っている場所（例）                                                               | Next.js での指定方法                                |
| ------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| **ISR**      | トップ、商品詳細、コレクション一覧・コレクション詳細、ブログ、固定ページ、ポリシー | `export const revalidate = 3600`                    |
| **SSR**      | カート、アカウント、検索                                                           | `cookies()` / `searchParams` 使用で自動的に Dynamic |
| **CSR 要素** | カート内の数量変更、ログイン送信、注文履歴など                                     | `"use client"` + クライアントで `fetch`             |
| **SSG**      | 静的ページがないためなし                                                           |

※ 1 ページが「サーバーで初回 HTML を組みつつ、一部だけクライアントで更新」という**ハイブリッド**になっている箇所もあります（例：カートページ）。

---

## 2. コードで見る「どこで何を使っているか」

### 2.1 ISR（Incremental Static Regeneration）

**「ビルド時または初回アクセス時に静的 HTML を生成し、一定時間ごとにバックグラウンドで再生成する」方式です。**

- **コード例（トップページ）**

```12:13:app/[locale]/page.tsx
export const revalidate = 3600;

export const metadata: Metadata = {
```

- **コード例（商品詳細）**

```9:10:app/[locale]/products/[handle]/page.tsx
export const revalidate = 3600;

const getSiteUrl = () => process.env.SITE_URL ?? "https://nichijo-jp.com";
```

- **同じパターン**  
  `app/[locale]/blogs/page.tsx`、`app/[locale]/blogs/[blog-handle]/page.tsx`、  
  `app/[locale]/pages/page.tsx`、`app/[locale]/pages/[handle]/page.tsx`、  
  `app/[locale]/policies/[handle]/page.tsx` などでも `revalidate = 3600` を指定しています。

- **意味**
  - そのページは「静的」としてキャッシュされる。
  - 3600 秒（1 時間）経過後に次のリクエストが来ると、バックグラウンドで再生成し、以降は新しい HTML が使われる。
  - 商品・ブログ・固定ページなど「ユーザーごとに変えなくてよいが、たまに更新したい」コンテンツに向いています。

---

### 2.2 SSR（Server-Side Rendering）

**「リクエストのたびにサーバーで HTML を組み、その都度最新のデータで返す」方式です。**

Next.js App Router では、次のような**動的 API** を使うと、そのルートは自動的に **Dynamic（SSR）** になります。

- **コード例（カート：`cookies()` 使用）**

```21:24:app/[locale]/cart/page.tsx
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  let initialCart = cartId ? await getCart(cartId, countryCode) : null;
```

- **コード例（アカウント：`cookies()` でログイン判定）**

```15:21:app/[locale]/account/page.tsx
  // If not logged in, redirect to Login Page
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/account/login");
  }
```

- **コード例（検索：`searchParams` 使用）**

```21:25:app/[locale]/pages/search/page.tsx
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // ...
  const { q, productPage, articlePage } = await searchParams;
  const query = q?.trim() ?? "";
```

- **意味**
  - **カート** … ユーザーごとに `cartId` が違うため、毎リクエストでサーバーが `cookies()` を見てカートを取得する必要がある → SSR。
  - **アカウント** … ログイン状態（トークン）はユーザーごと → `cookies()` で判定し、未ログインならリダイレクト → SSR。
  - **検索** … クエリ `q` やページ番号が URL で変わるため、`searchParams` に依存 → 動的 → SSR。

※ カートページには `revalidate = 3600` が書いてありますが、`cookies()` を使っているため、Next.js では **Dynamic が優先**され、実質 SSR として動いています。

---

### 2.3 CSR 要素（Client-Side Rendering）

**「ブラウザ上で JavaScript が動き、API を呼んで表示を更新する」部分です。**

- **コード例（カート内の数量変更・削除）**

`CartContent` は `"use client"` のクライアントコンポーネントで、**初回表示はサーバーから渡された `initialCart`** を使い、**その後の変更はクライアントから API を呼んで**更新しています。

```19:26:src/components/cart/CartContent.tsx
export function CartContent({ cartId, initialCart }: CartContentProps) {
  // ...
  const [cart, setCart] = useState<CartWithLines | null>(initialCart);
  // ...
  const res = await fetch("/api/cart", {
    method: "DELETE",
    // ...
  });
```

- **意味**
  - **初回 HTML** … サーバーがカートを取得して渡す（SSR 部分）。
  - **数量変更・削除・チェックアウト URL 更新** … クライアントで `fetch("/api/cart", ...)` を実行し、結果で `setCart` する（CSR 部分）。
  - ログイン送信（`LoginForm`）や注文履歴・住所編集なども、同様に `"use client"` 内で API を呼ぶ **CSR 要素**です。

---

## 3. なぜその開発方式にしたか（簡潔な理由）

| 方式         | 選んだ理由（このプロジェクトで）                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ISR**      | 商品・ブログ・固定ページは「全ユーザー共通で、更新はあるがリアルタイムでなくてよい」ため。1 時間ごとの再検証で SEO とパフォーマンスのバランスを取った。                                 |
| **SSG**      | コレクション一覧・詳細は更新頻度が低く、ビルド時（または初回）の静的生成で十分だと判断。キャッシュを長く効かせて負荷を下げる。                                                          |
| **SSR**      | カート・アカウント・検索は「リクエストごとに中身が変わる」ため。`cookies()` や `searchParams` に依存するため、静的ではなく毎回サーバーで描画する必要がある。                            |
| **CSR 要素** | ログイン送信・カートの数量変更・注文履歴などは「ユーザー操作に応じてその場で更新したい」ため。サーバーで毎回ページ全体を描き直すより、クライアントで API を叩いて部分更新する方が自然。 |

---

## 4. それぞれのメリット・デメリット（一般的な整理）

### SSG（Static Site Generation）

- **メリット**
  - ビルド時に HTML ができるため表示が速い。
  - サーバー負荷が小さい。CDN でキャッシュしやすい。
  - SEO で有利（最初から HTML がある）。
- **デメリット**
  - ビルド時点のデータになる。更新するには再ビルドか再デプロイが必要。
  - ユーザーごとに内容を変えられない。

---

### ISR（Incremental Static Regeneration）

- **メリット**
  - 静的キャッシュの速さを維持しつつ、一定間隔で内容を更新できる。
  - 再生成はバックグラウンドなので、ユーザーは古いページをすぐ見られる。
  - 商品・ブログなど「たまに更新」のページに適している。
- **デメリット**
  - 更新は「再検証間隔（例: 3600 秒）経過後」になる。リアルタイムではない。
  - 再検証のたびにサーバー処理が走る。

---

### SSR（Server-Side Rendering）

- **メリット**
  - 毎リクエストで最新データを反映できる。
  - ユーザーごとの内容（カート、ログイン状態、検索クエリ）に合わせた HTML を返せる。
  - 初回から HTML があるので SEO も可能。
- **デメリット**
  - リクエストごとにサーバーで描画するため、SSG/ISR よりサーバー負荷とレイテンシが増えやすい。
  - キャッシュが効きにくい（ユーザー・クエリごとに違うため）。

---

### CSR（Client-Side Rendering）

- **メリット**
  - ユーザー操作に応じてその場で API を叩き、部分だけ更新できる。
  - ページ全体の再描画が不要で、インタラクティブな UI に向いている。
  - サーバーは API を返すだけでよく、描画負荷を減らせる。
- **デメリット**
  - 初回は「空 or スケルトン」になりがちで、SEO やファーストビューに不利になりうる。
  - データ取得がクライアントに依存するため、ネットや JS の重さの影響を受けやすい。

---

## 5. 面接で話すときのポイント（短くまとめ）

1. **「どのような開発方法になっているか」**  
   「トップ・商品・ブログ・固定ページは ISR（1 時間ごとに再検証） SSR はカート内の操作やログイン送信などはクライアントで API を叩く CSR 要素、という使い分けをしています」と説 明できる。

2. **「なぜその開発方法にしたか」**  
   「ユーザー共通で更新が少ないところは SSG/ISR で速さと SEO を確保し、ユーザーごと・リクエストごとに変わる部分（カート・ログイン・検索）は SSR、操作に応じた部分更新は CSR で、というように**データの性質と更新タイミング**で決めました」と説明する。

3. **「それぞれのメリット・デメリット」**
   - SSG: 速い・負荷小・SEO 向き / 更新に再ビルドが必要。
   - ISR: 静的の速さ + 定期更新 / リアルタイムではない。
   - SSR: 毎回最新・ユーザー別 / 負荷とレイテンシが増えやすい。
   - CSR: 部分更新・インタラクティブ / 初回表示・SEO に気をつける必要がある。

必要なら、面接官に「商品詳細は ISR で revalidate 3600 を指定している」「カートは cookies を使うので SSR になっている」など、**ファイル名と export の書き方**まで具体的に話すと、「コードレベルで理解している」と伝わります。
