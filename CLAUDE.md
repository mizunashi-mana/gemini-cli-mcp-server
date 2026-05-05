# gemini-mcp

Gemini CLI をラップして Claude Desktop（および MCP 互換クライアント）から利用できるようにする MCP サーバー。

## AI エージェント向けドキュメント

このリポジトリでは `.ai-agent/` ディレクトリに AI エージェント向けのドキュメントを管理しています。

- `.ai-agent/steering/` — プロダクト・技術戦略ドキュメント
  - `product.md` — プロダクトビジョン・ターゲット・スコープ
  - `tech.md` — 技術スタック・アーキテクチャ
  - `market.md` — 市場分析・競合
  - `plan.md` — 実装計画・ロードマップ
  - `work.md` — 開発ワークフロー・規約
- `.ai-agent/structure.md` — ディレクトリ構造の説明
- `.ai-agent/tasks/` — 個別タスク
- `.ai-agent/projects/` — 長期プロジェクト
- `.ai-agent/surveys/` — 技術調査

タスクに着手する前に、関連する steering ドキュメントと `structure.md` を確認してください。

## プロダクト固有の重要原則

- **Gemini API SDK を直接使わない**: 必ず `@google/gemini-cli` のサブプロセス起動経由で Gemini と通信する
- **Workspace OAuth 認証フローに依存**: API キーではなく、Gemini CLI 側の `gemini auth login` の認証状態を利用する
- **ローカル MCP サーバーとして自己完結**: Redis や外部 DB など外部ストレージへの依存は導入しない
- **DXT で配布**: 最終的な配布形態は Claude Desktop 拡張 (`.dxt`) を主軸とする

詳細は `.ai-agent/steering/product.md` および `tech.md` を参照。
