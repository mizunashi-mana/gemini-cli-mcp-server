# 市場分析

## 市場概要

Model Context Protocol (MCP) は 2024 年末に Anthropic が公開し、2026 年初頭時点で
OpenAI、Google を含む主要 AI プラットフォームがネイティブサポートする標準となった。
MCP サーバーの累計インストール数は 9700 万件（2026 年 3 月時点）を超え、コミュニティ
製サーバーは 10,000 を超えている。

本プロダクトが属するカテゴリは「LLM ブリッジ系 MCP サーバー」、特に **Gemini を Claude
や他のエージェント環境から呼び出すためのブリッジ** という位置づけ。

## ターゲットセグメント

### 一次ターゲット

**Claude Desktop アプリで Claude を利用しているユーザー**、特に以下の条件に該当する層:

- 所属組織で **Google Workspace 契約**があり、その範囲内で Gemini を利用したい
- **Gemini API の個別契約・API キー発行が困難**（情シス制約、コスト管理、ガバナンス）
- ターミナル操作や JSON 設定編集に習熟していない、または避けたい
- Claude をメインエージェントとし、Gemini を **長文コンテキスト・コードベース読込の補助**として使いたい

### 二次ターゲット

- Claude Code / Cursor などのエージェント IDE で MCP 経由 Gemini を併用したい開発者
- Gemini の大規模コンテキストウィンドウ（>1M トークン）を活用したいエンジニア

## 競合分析

| 競合 | 特徴 | 弱点 |
| --- | --- | --- |
| [jamubc/gemini-mcp-tool](https://github.com/jamubc/gemini-mcp-tool) | TypeScript 実装、Gemini CLI ラッパー、シンプル、`@filename` 対応 | DXT 配布なし、Workspace 認証への明示対応なし、Claude Desktop は手動 JSON 設定 |
| [centminmod/gemini-cli-mcp-server](https://github.com/centminmod/gemini-cli-mcp-server) | 33 ツール、Redis 永続会話、OpenRouter 連携、OpenTelemetry/Prometheus | 過剰機能・複雑な依存（Redis 必須）、軽量利用には不向き |
| [Jacob's Gemini CLI MCP](https://lobehub.com/mcp/jacob-gemini-cli-mcp) | OAuth サポート | 配布性・知名度が限定的 |

## 差別化ポイント

1. **Google Workspace 契約内で完結**
   - Gemini CLI の OAuth 認証（`gemini auth login`）をそのまま流用するため、Gemini API
     キーの個別発行が不要。組織の Workspace ポリシーの中で完結する。
   - API キー管理・課金管理・監査ログを Workspace 側に寄せられる。

2. **Claude Desktop 拡張（DXT）として 1 クリック配布**
   - `.dxt` ファイル形式で配布し、Claude Desktop 上でダブルクリック / 拡張機能マネージャー
     からインストール可能にする。
   - ユーザーは `claude_desktop_config.json` の手書き編集が不要。
   - 競合の多くは MCP サーバー単体の npm パッケージ配布にとどまっており、DXT 対応は強い差別化となる。

3. **CLI 依存による保守性**
   - Gemini API の変更追従は Google が公式に保守する `@google/gemini-cli` に委譲できる。
   - 自前で Gemini API SDK を抱えるより、API バージョン互換性問題に強い。

4. **スコープの絞り込み**
   - centminmod のような「すべてを詰め込む」方向ではなく、「Gemini CLI の中核機能（プロンプト
     実行・ファイル参照・サンドボックス）を MCP に橋渡しする」点に集中する。

## 市場動向

- **DXT (Desktop Extensions)** の登場により、MCP サーバーの配布形態が「開発者向けの
  npm パッケージ + JSON 編集」から「エンドユーザー向けのワンクリック拡張」へシフト中。
- Google が 2026 年初頭に公式 MCP サーバー（Maps、Cloud Run、Spanner など）を発表しており、
  Google × MCP 領域は今後さらに活発化する見込み。
- 一方で **Workspace 契約に縛られたエンドユーザー向け**の Gemini MCP は手薄で、ニッチだが
  確実に存在するペインポイント。
