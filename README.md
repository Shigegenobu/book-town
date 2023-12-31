## BOOK-TOWN

「BOOK-TOWN」は、自分のおすすめの本を投稿したり、他人が投稿したおすすめの本を閲覧できるアプリです。他人のおすすめした本を見ることで、新しいジャンルや分野に興味を持つことができ、知識や読書の幅が広がります。本を読みたいけれど、何を読んだらいいか分からない方や、これまで読んだことのないジャンルのおすすめを知りたい方々の悩みを解決するツールとなっています。

### ターゲットユーザー
・読書愛好者：　本を愛する人々が、自分のおすすめの本を共有し、他の読書仲間と交流できるプラットフォームとして利用します。

・読書初心者:　本を読む習慣を持ちたいけれど、何を読んだらいいか分からない人々が、他のユーザーのおすすめを見て、読む本の選択肢を広げるために利用します。

・新しいジャンルに興味を持つ人:　これまでに試したことのないジャンルや分野に興味を持つ読者が、他人のおすすめを通じて新たな読書体験を見つけるために利用します。

### URL

ブラウザで https://book-town-alpha.vercel.app/ を開くと表示されます。

### テスト用アカウント

ID test@gmail.com

Pass 123456

## 機能

・認証機能（新規登録、サインイン、ログアウト）

・投稿機能（投稿、編集、削除）

・コメント機能（投稿、削除）

・フィルタリング機能

・並び替え機能

・いいね機能

・ユーザー編集機能（名前、ユーザー画像）

## 使用技術

### フロントエンド

・TypeScript(v5.1.6)

・React(v18.2.0)

・Next.js(v13.4.8)

・MUI(v5.13.7)

### バックエンド

・firebase(v10.0.0)

## 画面遷移図

```mermaid
graph LR

  classDef default fill: #fff,stroke: #333,stroke-width: 1px;

　　　　ホームページ---ログインページ
  ログインページ---->|ID/パスワード認証|マイページ

  マイページ---一覧ページ
  マイページ-->投稿フォーム

 一覧ページ---投稿フォーム
 一覧ページ---詳細ページ---編集ページ

 アバター画像-->一覧ページ
 アバター画像-->マイページ


  subgraph header [ヘッダ]
    ログアウト
    アバター画像
  end
```

## ER図

```mermaid
erDiagram

  users ||--o{ books : ""
  users ||--o{ comments: ""
  books ||--o{ comments: ""

  users {
    bigint id PK
    string name "ユーザー名"
    string avatar "ユーザー写真"
    string email "ユーザーemail"
    timestamp created_at
  }

  books {
    bigint id PK
    references user FK
    string title "投稿タイトル"
    string author "著者"
    string category "ジャンル"
    string point "おすすめポイント"
    string picture "投稿写真"
    timestamp created_at
  }

  comments {
    bigint id PK
    references book FK
    references user FK
    text content "コメント内容"
    timestamp created_at
  }

  books ||--o{ likes : ""
  users ||--o{ likes : ""

  likes {
    bigint id PK
    references user FK
    references book FK
    datetime created_at
}
```

## 今後の実装予定機能

・いいねしたリストを表示

・google 認証

・コメント時に画像投稿ができる機能

・バックエンドのnode.jsを学習しfirebaseから切り替える
