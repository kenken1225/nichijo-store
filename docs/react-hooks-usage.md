# React フックの使い分け（このプロジェクトの実例）

面接で「useEffect / useMemo / useCallback / useContext をどう使い分けたか」と聞かれたとき、**実際のファイルと役割**を答えられるようにまとめています。

---

## 1. useEffect … 「描画のあとに〇〇する」

| 場所                                                                                                                                          | ファイル                                                            | どんなとき・何をしているか                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **メディアクエリ**                                                                                                                            | `src/lib/useMediaQuery.ts`                                          |
| ウィンドウ幅の変化を `matchMedia` で購読。マウント時に listener を登録し、**アンマウント時に removeEventListener で解除**（クリーンアップ）。 |
| **認証チェック**                                                                                                                              | `src/contexts/AuthContext.tsx`                                      | **マウント時だけ** `checkAuth()` を実行し、ログイン状態を取得。                                                |
| **検索フォーム**                                                                                                                              | `src/components/search/SearchForm.tsx`                              |
| 入力値と URL がずれたときに **300ms ディレイ** してから URL を更新（デバウンス）。`setTimeout` をクリーンアップで `clearTimeout`。            |
| **商品のバリアント**                                                                                                                          | `src/components/products/ProductActions.tsx`                        | `variants` が変わったときに選択中バリアントをリセット。`selectedVariant` が変わったときに親に画像 URL を渡す。 |
| **住所一覧取得**                                                                                                                              | `src/components/account/AddressManager.tsx`                         | マウント時に `/api/account/addresses` を呼んで住所一覧を表示。                                                 |
| **注文履歴取得**                                                                                                                              | `src/components/account/OrderHistory.tsx`                           |
| マウント時に API で注文一覧を取得。                                                                                                           |
| **モバイルドロワー**                                                                                                                          | `src/components/navigation/MobileDrawer.tsx`                        |
| ドロワー開閉に合わせて body のスクロールを止める／戻す（`overflow` の制御）。                                                                 |
| **カルーセル**                                                                                                                                | `src/components/products/ProductGallery.tsx` / `ReviewCarousel.tsx` | Embla のインスタンスを登録し、クリーンアップで破棄。                                                           |

**工夫している点**: イベントリスナー・タイマー・外部ライブラリは **必ずクリーンアップ**（`return () => { ... }`）して、メモリリークや二重実行を防いでいる。

---

## 2. useMemo … 「計算結果をキャッシュして再計算を減らす」

| 場所                     | ファイル                                                   | どんなとき・何をしているか                                                                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **コレクションフィルタ** | `src/components/collections/filters/CollectionFilters.tsx` | `categories`: products からカテゴリの Set を作ってソート。`priceOptions`: 翻訳付きの価格帯リスト。**`filtered`**: カテゴリ・価格・在庫・ソートでフィルタ＋ソート。products やフィルタ状態が変わるたびにやり直すと重いのでメモ化。 |
| **商品のオプション**     | `src/components/products/ProductActions.tsx`               | `optionValues`: variants から「オプション名 → 選択肢の Set」の Map を構築。`displayPrice`: 選択中バリアントの価格をロケール付きでフォーマット。                                                                                   |

**工夫している点**: コレクションページでは **products のフィルタ・ソート** を毎回やると重いため、依存配列 `[products, selectedCategory, priceKey, inStockOnly, sort]` が変わったときだけ `filtered` を再計算している。

---

## 3. useCallback … 「関数の参照を安定させて子の再レンダーを抑える」

| 場所               | ファイル                                                            | どんなとき・何をしているか                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **カート Context** | `src/contexts/CartContext.tsx`                                      | `incrementCount` / `decrementCount` を useCallback で包み、**Provider の value の参照が安定**するようにしている。子が useCart() で受け取る関数が毎回別参照だと、その関数に依存する子が余計に再レンダーしうる。                                                                         |
| **認証 Context**   | `src/contexts/AuthContext.tsx`                                      | `checkAuth` / `refreshCustomer` / `login` / `logout` を useCallback で包み、**useEffect の依存や Context の value** が安定するようにしている。とくにマウント時の `useEffect(() => { checkAuth(); }, [checkAuth])` で、checkAuth が安定していないと毎レンダーで effect が走ってしまう。 |
| **国設定 Context** | `src/contexts/CountryContext.tsx`                                   | `setCountry` を useCallback で包み、Context 経由で渡す関数の参照を安定させている。                                                                                                                                                                                                     |
| **検索フォーム**   | `src/components/search/SearchForm.tsx`                              | `updateURL` を useCallback で包み、**useEffect の依存**（デバウンス内で updateURL を呼ぶ）が安定するようにしている。                                                                                                                                                                   |
| **商品ドロワー**   | `src/components/products/ProductPageWithDrawer.tsx`                 | カート追加・削除などのハンドラを useCallback で包み、子コンポーネントに渡している。                                                                                                                                                                                                    |
| **カルーセル**     | `src/components/products/ProductGallery.tsx` / `ReviewCarousel.tsx` | `scrollPrev` / `scrollNext` などを useCallback で包み、emblaApi が変わるときだけ作り直している。                                                                                                                                                                                       |

**工夫している点**: Context の value に含める関数や、useEffect の依存に入れる関数は **useCallback で固定**し、「依存が変わっていないのに effect が何度も走る」「子が不要に再レンダーする」を防いでいる。

---

## 4. useContext … 「深い階層に props を渡さずに状態を共有」

| 場所           | ファイル                          | どんなとき・何をしているか                                                                                                                                                                       |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **カート件数** | `src/contexts/CartContext.tsx`    | `CartProvider` で `itemCount` / `setItemCount` / `incrementCount` / `decrementCount` を提供。ヘッダーのカートアイコン枚数や、商品ページの「カートに追加」後の更新で **useCart()** を使っている。 |
| **認証状態**   | `src/contexts/AuthContext.tsx`    | `AuthProvider` で `isLoggedIn` / `customer` / `login` / `logout` などを提供。ログインボタン・アカウントメニュー・注文履歴などで **useAuth()** で参照。                                           |
| **国・通貨**   | `src/contexts/CountryContext.tsx` | `CountryProvider` で `country` / `setCountry` を提供。価格表示や API の国パラメータで **useCountry()** で参照。                                                                                  |

**工夫している点**: カート件数・ログイン状態・国設定は **多くのコンポーネント** で必要なので、props で何階層も渡すのではなく Context で一括提供し、必要なところで `useContext`（カスタムフック useCart / useAuth / useCountry）で読むようにしている。

---

## 5. 面接で「どう使い分けたか」と答えるときの例

- **useEffect**: 「描画後に実行したいこと（API 呼び出し、イベント登録、デバウンス）を useEffect で書いています。
  リスナーやタイマーはクリーンアップで必ず解除するようにしています。例は useMediaQuery の matchMedia と、SearchForm の 300ms デバウンスです。」
- **useMemo**: 「フィルタ・ソートや、バリアントからオプション一覧を組み立てるような、レンダーごとにやると重い計算を useMemo でメモ化しています。
  CollectionFilters の filtered と ProductActions の optionValues が代表例です。」
- **useCallback**: 「Context に渡す関数や、useEffect の依存に入れる関数は useCallback で包んで参照を安定させています。AuthContext の checkAuth を useEffect の依存にしているので、checkAuth を useCallback にしないとマウントのたびに effect が走ってしまいます。CartContext の increment/decrement も、value の参照を安定させるために useCallback にしています。」
- **useContext**: 「カート件数・ログイン状態・国設定のように、複数画面で共有する状態は Context で提供し、useCart / useAuth / useCountry で参照しています。props のバケツリレーを避けるためです。」

## バージョン管理について（package.json を見たうえで）

いまの状態（事実）
ピン留め（exact）:
next / react / react-dom / eslint-config-next は ^ なしで "16.1.6" や "19.2.3" のように固定。
範囲指定: それ以外の多くは ^（例: "^4.8.2"）で、「同じメジャー内の minor/patch は取りに行ってよい」という指定。

素直に + 現状の解釈で答える例:

「厳密なバージョンポリシーを決めて運用していたわけではないです。」
「ただ、Next と React はビルドや挙動に直結するので、バージョンを固定しています。それ以外は ^（caret/キャレット, hat/ハッと） で、パッチやマイナー更新は取り込めるようにしています。」
「lock ファイル（package-lock.json や yarn.lock）は必ずコミットして、『誰がいつインストールしても同じ木になる』ようにしています。」
「また、Dependbot を運用して、毎週月曜日、メジャー・マイナー・パッチ、すべてのバーションを調べて、更新があれば PR だしています」

1. 「パッチ」ってどういう意味？
   パッチ（patch） は、バージョン番号の一番右の数字のことを指すことが多いです。

バージョンはよく メジャー.マイナー.パッチ で表します。

例 メジャー マイナー パッチ 意味
4.8.2 4 8 2 パッチが 2
4.8.3 4 8 3 パッチが 1 つ上がった

メジャー … 大きな仕様変更（互換性が壊れやすい）
マイナー … 機能追加（だいたい後方互換）
パッチ … バグ修正や小さな修正（挙動はほぼ同じ想定）
なので「パッチ更新を取り込む」＝「例: 4.8.2 → 4.8.3 のように、同じメジャー・マイナーのまま、修正だけもらう」という意味です。
