# アカウント機能

## 概要

Shopify Storefront APIを使った顧客アカウント機能。
ログイン、会員登録、パスワードリセット、マイページなど一通り実装。

## 使用技術

- Next.js 16 (App Router)
- Shopify Storefront API
- Cookie認証

## ページ一覧

すべてのルートは `[locale]` 配下（例: `/ar/account`、`/en/account`）。以下は locale を省略した表記。

| パス | 内容 |
|------|------|
| `/account` | マイページ |
| `/account/login` | ログイン |
| `/account/register` | 会員登録 |
| `/account/forgot-password` | パスワードリセット申請 |
| `/account/reset` | パスワード再設定（クエリ `?reset_url=...` でShopifyのリセットURLを受け取る） |
| `/account/orders` | 注文履歴 |
| `/account/addresses` | 住所管理 |
| `/account/profile` | プロファイル編集 |

## API

| エンドポイント | 用途 |
|---------------|------|
| POST `/api/account/login` | ログイン |
| POST `/api/account/register` | 会員登録 |
| POST `/api/account/logout` | ログアウト |
| POST `/api/account/recover` | パスワードリセットメール送信 |
| POST `/api/account/reset` | パスワード再設定 |
| GET/PATCH `/api/account/customer` | 顧客情報取得・更新 |
| GET `/api/account/orders` | 注文履歴取得 |
| GET/POST/PATCH/DELETE `/api/account/addresses` | 住所CRUD |

## 認証の仕組み

1. ログイン時にShopifyからアクセストークンを取得
2. トークンはhttpOnly Cookieに保存
3. 以降のAPIリクエストでトークンを使って認証

## ファイル構成

```
app/[locale]/account/   # アカウント系ページ（locale 付き）
app/api/account/       # APIルート（locale なし）
src/components/account/  # UIコンポーネント
src/contexts/AuthContext.tsx  # 認証状態管理
src/lib/shopify/customer.ts   # Shopify 顧客API ラッパ
```

## 未ログイン時

`/account` 以下にアクセスしたとき、Cookie（`customerAccessToken`）が無ければ `/account/login` にリダイレクト。各保護ページで cookie を確認して redirect している。

## 備考

- パスワードは8文字以上
- メールアドレスは変更不可（Shopifyの仕様）
