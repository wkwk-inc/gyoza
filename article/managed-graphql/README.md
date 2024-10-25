
# フルマネージドな GraphQL サーバーソリューション (AWS AppSync や Azure API Management) よりも、汎用の GraphQL サーバーライブラリ (GraphQL Yoga) をサーバーレスコンピューティングサービス (AWS Lambda や Azure Functions) で実行するほうが筋が良いと考える理由

## リゾルバー (実際のコード) を各クラウドプロバイダー独自の仕組み (しかもわざわざ学習する価値のない謎言語) で実装しなければならない

マネージドサービスなのでコードを書けない非エンジニアでも画面ポチポチで構築できるよう、プログラミング言語を使うことなくリゾルバーを実装できるようになっている。
しかしこれはメリットではなくエンジニアにとっては壮大なデメリットで、各クラウドプロバイダー独自の構文での実装を強いられる。

AWS AppSync

- [AWS AppSync リゾルバーマッピングテンプレートプログラミングガイド](https://docs.aws.amazon.com/ja_jp/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html)
- [Apache Velocity Template Language (VTL)](https://velocity.apache.org/engine/2.4.1/vtl-reference.html)

Azure API Management

- [API Management ポリシー式](https://learn.microsoft.com/ja-jp/azure/api-management/api-management-policy-expressions)

## REST API で例えると、 Hono + AWS Lambda で構築するところ、フルマネージドサービスでは各リソースパスのコードをコンソール画面から謎言語でポチポチ構築しなければならないようなもの

馴染みのある REST API で例えると、 Hono であれば以下のように実装すればよいところ、

```typescript
app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  const post = db.query.post(id)
  return c.json(post)
})
```

マネージドサービスではコンソール画面からリソースパスとメソッドを定義し、対象の DynamoDB テーブルをデータソースとしてアタッチし、マッピングテンプレートで以下のように実装する必要がある (AWS AppSync での例だが、 Azure API Management でも同様の世界観)。

```json
{
  "version" : "2017-02-28",
  "operation" : "GetItem",
  "key" : {
    "id" : $util.dynamodb.toDynamoDBJson($ctx.args.id),
  },
  "consistentRead" : true
}
```

この例では DynamoDB のアイテム (レコード) をプライマリキーでクエリーしてそのまま返す例なのでまだマシだが、少しでも凝ったことをしようとすると VTL の知識が求められるし、プログラミング言語でできることを完全に代替できるわけではない。 しかし VTL はほかでは通用せずわざわざ学習するメリットのない無価値な仕組みだ。

なので元々 touch & care をスクラッチから開発したエンジニアは VTL を回避するために、 VTL から Lambda をコールし、 TypeScript で Lambda を実装するというエスケープハッチのような方針を取らざるをえなくなったと聞いている。

そのためにリゾルバー毎に VTL から Lambda をコールするマッピングテンプレートをデプロイ時に自動生成する魔改造スクリプトを独自実装したりと苦労を強いられていたようだ (とどこかのドキュメントにダイイングメッセージのごとく記録されていた記憶)。

こんなことなら AWS AppSync を使わず Lambda だけで実装するほうがはるかに筋が良い。

## それゆえにポータビリティ性が失われ、一度特定のクラウドプロバイダー上で実装したらほかに移れずベンダーロックインされる

Hono で REST API を構築すれば AWS Lambda だろうが Azure Functions だろうが Google Cloud Run だろうがオンプレサーバーだろうがどこでも動くが、一度マネージドサービスで構築してしまうとベンダーロックインされてしまうので共に心中する覚悟が必要だ。

## 現在の touch & care で使われている AWS AppSync で実感している問題点

こういった魔のような構成になってしまったため、開発体験が絶望的に悪い。

- ローカルの開発サーバーが存在せず (ローカルで動かす手段がなく)、書いたコードを動かすにはいちいち AWS の dev 環境にデプロイして数十秒〜数分待たなければいけない。
- AWS の開発環境は 1 つしかないので、複数人での同時開発ができない。
