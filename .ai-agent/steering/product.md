# プロダクトビジョン

## ミッション

**Google Workspace 契約の範囲内で Gemini を Claude Desktop から透過的に利用できる
MCP サーバーを提供する。**

API キーの個別発行や複雑な設定なしに、Claude のデスクトップアプリから 1 クリックで
インストールでき、組織の認証・課金ポリシーに従って Gemini を補助モデルとして活用できる
状態を実現する。

## ターゲットユーザー

主に「**Claude Desktop アプリの利用者で、Google Workspace 契約は持っているが個別の
Gemini API 契約は持っていない / 持ちにくい**」ユーザー。

具体的なペインポイント:

- 「Gemini の長文コンテキストや別視点を Claude のチャット中に呼び出したいが、API キー発行が
  会社のポリシーで難しい」
- 「ターミナルや設定ファイル編集なしで、すぐに Gemini を Claude Desktop に組み込みたい」
- 「複数の API キーを個人で管理したくない。Workspace ログインで完結させたい」

## ユースケース

1. **Claude チャット中に Gemini に意見を求める**
   - 「この設計について Gemini にも聞いてみて」と Claude に依頼すると、MCP 経由で Gemini が
     呼ばれ、別視点の回答が返ってくる。

2. **大規模ファイル / コードベースの読み込みを Gemini にオフロード**
   - Claude のコンテキスト上限を超える巨大ファイルやリポジトリ全体を、Gemini の長文コンテキスト
     能力で要約・分析させる。

3. **Workspace 内サンドボックスでのコード実行**
   - Gemini CLI のサンドボックス機能を介した安全なコード試行を Claude から実行する。

## 主要機能

### 初期リリース（MVP）スコープ

- **`gemini-prompt`**: 任意のプロンプトを Gemini CLI に渡して結果を返すコアツール
- **`gemini-prompt-with-files`**: ファイル / ディレクトリ参照（`@path`）を含めた問い合わせ
- **DXT パッケージング**: `.dxt` 形式での配布、Claude Desktop ワンクリックインストール対応
- **Workspace 認証フロー**: Gemini CLI 側の OAuth 認証状態をそのまま利用する設計

### 将来検討

- サンドボックス実行ツール（`gemini-sandbox`）
- 会話履歴の保持（必要性を見極めてから）
- モデル切替（Gemini 2.5 Pro / Flash 等）

### 非スコープ（やらないこと）

- Gemini API SDK の直接利用 — 必ず `@google/gemini-cli` 経由とし、認証・モデル管理を委譲する
- OpenRouter など他プロバイダーへの拡張 — Gemini に集中する
- Redis などの外部ストレージ依存 — ローカル MCP サーバーとして自己完結する
- エンタープライズ監視機能（OpenTelemetry / Prometheus）— 必要になるまで持ち込まない

## 差別化ポイント

| 軸 | 本プロダクト | 主要競合 (gemini-mcp-tool 等) |
| --- | --- | --- |
| 認証 | Gemini CLI の OAuth (Workspace 互換) | API キー想定 |
| 配布形態 | `.dxt` (Claude Desktop ワンクリック) | npm パッケージ + 手動 JSON 設定 |
| スコープ | Gemini CLI の中核機能に絞る | 機能多めまたは肥大傾向 |
| 依存 | Gemini CLI のみ | 多様（Redis、OpenRouter、API SDK 等） |

## 成功基準（参考）

- Claude Desktop ユーザーが README に従って 5 分以内にインストール・初回起動できる
- API キー発行を伴わず、Workspace アカウントログインだけで動作する
- メンテナンスコストが低い（Gemini API の変更は Gemini CLI 側が吸収する）
