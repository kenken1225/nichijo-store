# nichijo - Japanese Lifestyle & Culture Store

## What is nichijo?

nichijo（日常）は、日本の日常にある美しいものを海外に届ける EC サイト。

ターゲットは海外に住んでいて、日本の文化や暮らしに興味を持っている方がです。
観光で日本に来て「また欲しい」と思った器や布もの、
あるいは SNS で見かけた日本のアニメグッズ。
そういう「日本の日常」を、現地にいなくても手に入れられる場所を作るためにこの EC サイトができました。

扱う商品は主に 3 つ。

- 生活雑貨（器、布製品、文房具など）
- 伝統工芸品（漆器、陶磁器、藍染めなど）
- アニメ・ポップカルチャー系のグッズ

コンセプトは "The Quiet Beauty of Everyday Japan"。
トレンドを追いかけるんじゃなくて、日常の中にある静かな美しさを届けたい。
派手さはないけど、使い込むほどに愛着が湧くようなもの。
そういう商品を丁寧にキュレーションしていきます。

---

## Why Headless?

Shopify のテーマをそのまま使う選択肢もありましたが、今回はヘッドレス構成を選びました。
理由はデザインの自由度やパフォーマンスです。
（EC サイトをスクラッチから作ってみたかったという好奇心もあります・・）

追加補足ですが、Shopify のテーマはカスタマイズ制に優れて便利ですが、細かい UI の微調整が難しいのと、
ページ遷移のたびにリロードが走り、UX 的に離脱率がたくなる現象にあります。
海外ユーザーをターゲットにする場合、表示速度は死活問題ですので、フロントエンドを完全に切り離して、Next.js で構築することにしました。

---

## Tech Stack

**Frontend**

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

**Backend / Data**

- Shopify Storefront API (GraphQL)
- Shopify Admin API（一部機能で使用）

**Hosting**

- Vercel

---

## Architecture

```
[User] → [Vercel Edge Network / CDN]
              ↓
         [Next.js App]
              ↓
    [Shopify Storefront API]
              ↓
         [Shopify Backend]
        (Products, Cart, Checkout, Orders)
```

ページの大半は ISR（Incremental Static Regeneration）で生成しています。
初回アクセス時に HTML を生成して、1 時間を目処にキャッシュしております。
Shopify で商品やブログを更新しても、最大 1 時間で自動反映されるので、再デプロイは不要です。
カートや認証まわりはクライアントサイドで処理して、
React Context で状態を管理して、API Routes を経由して Shopify とやり取りする構成しています、

---

## Features

- 商品一覧・詳細ページ
- コレクション（カテゴリ）機能
- カート機能（Shopify Checkout 連携）
- ブログ機能（Shopify のブログ記事を取得）
- 顧客アカウント（ログイン、注文履歴、住所管理）
- レスポンシブ対応
- 検索機能

---

## Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Run development server
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
```

Storefront Access Token は Shopify 管理画面の「Apps」→「Develop apps」から発行できる。

---

## License

Private repository. Not for redistribution.
