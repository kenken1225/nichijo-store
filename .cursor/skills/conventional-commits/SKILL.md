---
description: Conventional Commits ルール
---

# Conventional Commits

## フォーマット

`<type>[optional scope]: <description>`

_コミットメッセージは日本語で記述_

## 利用可能な type

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更
- `refactor`: バグ修正や機能追加以外のコード変更
- `perf`: パフォーマンス向上
- `test`: テストの追加・修正
- `chore`: ビルドプロセスや補助ツールの変更

## 例

- `feat(cart): ミニカートドロワーを追加`
- `fix(product): 商品ギャラリーの画像読み込みを修正`
- `refactor(products): 商品詳細ページのコンポーネントを分割`

## コミット実行時の注意

- メッセージは上記フォーマットに従う
- Cursor でコミットを依頼する場合は、生成されたメッセージを確認してから実行する
