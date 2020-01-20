# README #

グラブル攻撃力計算機(新)を元にしていろいろこねくり回しているコードです。
このリポジトリは**更新されない**予定です。

### ライセンス ###

ほぼ全てがMITですが、
詳細はLICENSEファイルを読んでください。

### ビルドの仕方 ###

前提として最新版の[node.js](https://nodejs.org/)をインストールしておいてください。

`webpack@~2.1.0-beta`が最低でもグローバルにインストールされていなければいけません。
`webpack-dev-server@~2.1.0-beta`があるとなお良いです。

以下のコマンドを管理者権限で入れるとそれぞれのコマンドが使えるようになります。

~~~~
> npm install -g webpack@~2.1.0-beta
> npm insatll -g webpack-dev-server@~2.1.0-beta
~~~~

まず、必要なライブラリを`npm`を使ってインストールします。
以下のコマンドをpackage.jsonがあるディレクトリ(プロジェクトのルートディレクトリ)で実行してください。
node_modulesというディレクトリの中に色々なライブラリがインストールされます。

なお、それなりに時間がかかるのでお茶でも飲みながらお待ちください。
~~~~
> npm install
~~~~

次にwebpack2を使って分割されたファイルを1つのjsファイルにまとめます。
`webpack.config.js`がwebpack2用の設定ファイルになります。
以下のコマンドによって`dist/bundle.js`と`dist/test_bundle.js`がそれぞれ生成されます。
これらのファイルは`calc.html`と`test.html`によって読みこまれます。

~~~~
> webpack
~~~~

なお、次のコマンドをプロジェクトルートで実行すると`localhost:8080`に簡易HTTPサーバーが立ちあがります。
これはChromeやVivaldiでの開発をする際に便利です。

~~~~
> webpack-dev-server
~~~~

### 開発版と運用版 ###

webpackでのビルドは環境変数`NODE_ENV`によって開発版と運用版を切りかえることができます。

開発版(`NODE_ENV`が`development`に設定されている場合)はコンソールにデバッグ情報が出てきて
出力されるファイルの大きさも少々大きめです。

運用版(`NODE_ENV`が`production`に設定されている場合)はコンソールに出力される内容も減り、
出力されるファイルの大きさも小さめなので、
実際にサーバーへ配置する場合はこちらの方がお勧めです。
