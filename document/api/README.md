# GraphQL API のオペレーション一覧

このドキュメントは touch&care の GraphQL API のオペレーション (操作) の一覧について書かれている。
目的は Azure での新 API の開発にかかるタスクの洗い出しに役立てることである。

touch&care の GraphQL API は以下の 2 つが存在する。

1. モバイルアプリとウェブアプリ用 (以下「レガシー API」)

- AWS AppSync + Lambda
- 2019 年のサービス開始にあわせて開発
- 元々の設計・開発の担当者は 2020 年に撤退済み (斎藤は入れ替わりでジョイン)

2. 外部システムとのデータ同期用 (以下「モダン API」)

- GraphQL Yoga on Lambda
- 2022 年頃に icuco の競合サービスとのデータ連携プロジェクトのために斎藤がフルスクラッチで新設計・新開発 (結局同プロジェクトはお蔵入り)
- レガシー API とは互換性はないが、レガシー API を代替することも考慮して設計した
- book プロジェクトが始まったことで book と touch&care のデータ同期用に使われることになった (しかしプロジェクトのゴタゴタでモダン API とレガシー APIがごちゃ混ぜに使われてしまってカオスになっているようだ)

もし新 API を開発するのに参考にするならレガシー API はいろいろと設計が破綻していておすすめできないのでモダン API の設計を参考にすることを強く推奨する。

## モダン API のオペレーション一覧

ドキュメント

https://wkwk-inc.github.io/takoyaki/

本リポジトリの modern ディレクトリ配下に実際の GraphQL スキーマを置いてある。

### Query

REST で言う GET 操作に相当する

```
nursery
nurseries

baby
babies

sitter
sitters

room
rooms

// 午睡チェック記録
// legacy の getBabyCheck に相当
Baby.sleepCondition
Baby.sleepConditions

// 午睡チェック開始中か終了済か
// legacy の listBabyWatchEvents に相当
Baby.sleep
Baby.sleeps

// 園児の日次体調メモ (テキストでの自由入力)
// legacy の getBabyDailyStatuses に相当
Baby.health
Baby.healthes

// [遺物] リアルタイム心拍数や寝てるか起きてるかフラグなど
// legacy の getBabyStatus に相当
Baby.currentHealth

// [遺物] リアルタイム体温
Baby.summaryHealth
Baby.summaryHealthes
```

### Mutation

REST で言う POST PUT DELETE 操作に相当する

```
// legacy にはない機能 (Cognito 認証を GraphQL から操作)
signUp
confirmSignUp
signIn
signOut
refreshToken

createNursery
updateNursery
deleteNursery

createBaby
updateBaby
deleteBaby

createSitter
updateSitter
deleteSitter

createRoom
updateRoom
deleteRoom

// 午睡チェック記録
// legacy の createBabyCheck に相当
createSleepCondition
updateSleepCondition
deleteSleepCondition

// 午睡チェック開始中か終了済か
// legacy の babyWatchStart, babyWatchStop に相当
startSleep
endSleep

// 園児の日次体調メモ (テキストでの自由入力)
// legacy の createBabyDailyStatus に相当
createHealth
updateHealth
deleteHealth

// [遺物] リアルタイム心拍数や寝てるか起きてるかフラグなど
createCurrentHealth
updateCurrentHealth
deleteCurrentHealth

// [遺物] リアルタイム体温
createSummaryHealth
updateSummaryHealth
deleteSummaryHealth
```

## レガシー API のオペレーション一覧

本リポジトリの legacy ディレクトリ配下を参照。

schema.graphql は実際に使われている GraphQL スキーマ

Query.graphql, Mutation.graphql は schema.graphql を元に Query オペレーションと Mutation オペレーションを抜き出し、引数値や返り値がわかりやすいように編集。
