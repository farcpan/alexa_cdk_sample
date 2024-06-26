# alexa_cdk_sample

## 注意点

### ask

ASK CLIのインストールが必要。
```
$ npm install -g ask-cli
```

ASK設定を行う。ブラウザが開くため、Amazon.co.jpの認証情報でログインを行う。
```
$ ask configure
```

### LWA

LWAプロファイルでクライアントIDとクライアントシークレットを取得する際に、編集ボタンを押下してリダイレクトURIを設定する必要がある。
この設定がないと、リフレッシュトークンを取得することができない。
参考記事では `https://s3.amazonaws.com/ask-cli/response_parser.html`とあるが、本README作成時（2024年6月26日現在）ではURLが変更されていた（`https://ask-cli-static-content.s3-us-west-2.amazonaws.com/html/ask-cli-no-browser.html`）。

上記はエラーとなった際に、エラーの詳細を確認して判明した。

---

## （未解決）CDKコードからSecretsにアクセスする

CDKコードからSecretsにアクセスする場合、`cdk.json`の`@aws-cdk/core:checkSecretUsage`を`false`にする必要がある。
推奨される方法ではなさそうだが、他に方法がないので`false`で動かす。

---

## Alexa

起動ワード（`ja-JP.json`における`invocationName`が該当する）を発話した後、Intentの`samples`に定義したキーワードを発話することでAlexaスキルバックエンドが動作する。
このとき、バックエンド側で`reprompt`を呼び出さないとセッションが終了してしまい、毎回起動ワードを発話する必要がある。

```diff
    return handlerInput.responseBuilder
      .speak(speechText)
+     .reprompt("天気についていつでも聞いて下さいね。")
      .withSimpleCard("今日の天気は晴れです。", speechText)
      .getResponse();
```

ただし、Alexaシミュレータでは`reprompt`自体の動きは確認できなかった。

---

## 参考

* [Deploying Alexa Skills with the AWS CDK](https://aws.amazon.com/jp/blogs/devops/deploying-alexa-skills-with-aws-cdk/)

---
