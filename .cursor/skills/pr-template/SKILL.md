---
description: PRテンプレート構造
---

# PR テンプレート

## タイトル

- Conventional Commits 形式（日本語）
- フォーマット: `<type>[optional scope]: [TASK-XXXX] <description>`（タスク番号がない場合は省略可）
- 例: `feat(cart): [TASK-123] ミニカートドロワーを追加`
- 例: `fix(product): 商品ギャラリーの画像読み込みを修正`

## 本文構造

### Done
<!-- このプルリクで何をしたのか箇条書きで記載 -->
-

### Not To Do
<!-- 関連するけどこのPRではやらなかったこと。なければ「なし」 -->
-

### Other
<!-- 確認した内容、補足事項など。なければ省略可 -->
-

## 作成手順

1. 一時ファイル `pr_body.txt` に PR 本文を書き出し
2. `gh pr create --title "..." --body-file pr_body.txt` で作成
3. 作成後、`pr_body.txt` を削除
4. PR URL を表示

## 注意事項

- 各ステップで確認を取りながら進める（特にブランチ名・コミット・PR 本文）
- 秘密情報を含むファイル（`.env` など）はコミットしない
- PR 作成前に `git status` / `git diff` で変更内容を一度確認する
- 破壊的変更や環境変数の追加がある場合は、本文の Other に明記する
