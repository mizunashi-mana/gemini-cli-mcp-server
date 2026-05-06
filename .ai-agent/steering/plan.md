# 実装計画・ロードマップ

## 現在のフェーズ

**Phase 2: MVP** — 2026-05-06 時点

Phase 1（スパイク）完了。`@modelcontextprotocol/sdk` を使った最小 MCP サーバー
雛形（`gemini-prompt` ツール 1 つ）が、ローカル MCP クライアントから
Gemini CLI 経由で応答を取得できる状態に到達した。

## 完了済み機能

- autodev 開発環境のセットアップ（`.ai-agent/`、`.claude/skills/`）
- リポジトリスキャフォールド
  - `devenv.nix` / `devenv.yaml` / `.envrc`（devenv デフォルトの Node.js + npm）
  - `package.json`（type: module、`build` / `typecheck` / `dev` / `test` スクリプト、
    `engines.node: >=22.0.0`）
  - `tsconfig.json`（ES2022 / NodeNext / strict、`types: ["node"]`）
  - `src/index.ts`（プレースホルダ）
- Phase 1: スパイク / 技術検証（2026-05-06 完了）
  - `@google/gemini-cli` v0.40.1 のサブプロセス起動を確認
    （`-p` ヘッドレスモード、`--output-format json`、`--skip-trust` 必須）
  - `@modelcontextprotocol/sdk@^1.29.0` + `zod@^4.4.3` を `dependencies` に追加
  - `src/gemini.ts`（`runGemini` アダプタ）と `src/index.ts`（stdio MCP サーバー）
  - ローカル MCP クライアントによる `listTools` / `callTool("gemini-prompt")` 疎通確認

## 進行中の作業

- Phase 2（MVP）の着手準備

## 今後の計画

### Phase 1: スパイク / 技術検証 — 完了

目的: Gemini CLI を MCP 経由で動かせることを最短で確認する。

- [x] `@google/gemini-cli` の動作確認（OAuth ログイン、サブプロセスでの呼び出し）
- [x] `@modelcontextprotocol/sdk` の最小 MCP サーバー雛形作成
- [x] Claude Desktop にローカル設定（`claude_desktop_config.json`）で接続して疎通確認
      — ローカル MCP クライアントでの疎通確認まで実施。Claude Desktop 実機での確認は Phase 2 以降で実施。

詳細は `.ai-agent/tasks/20260506-phase1-spike-mcp-gemini/README.md`。

### Phase 2: MVP

目的: Claude Desktop ユーザーが実用できる最小機能セットを提供する。

- [ ] `gemini-prompt` ツール（プロンプト渡し → 結果返却）
- [ ] `gemini-prompt-with-files` ツール（`@path` 引数のサポート）
- [ ] エラーハンドリング（CLI 未インストール / 認証未完了の検出と分かりやすいメッセージ）
- [ ] README（英語）+ インストールガイド

### Phase 3: DXT 配布

目的: ワンクリックインストール体験を実現する。

- [ ] `manifest.json` の作成
- [ ] `dxt pack` でのビルドフロー確立
- [ ] GitHub Releases への自動添付
- [ ] ユーザー向けインストール手順整備（README + スクリーンショット）

### Phase 4: 安定化・拡充（必要に応じて）

- [ ] サンドボックス実行ツールの追加検討
- [ ] モデル切替（Pro / Flash）対応
- [ ] テレメトリ（オプトイン）

## 非スコープ

以下は明示的にやらない / 後回し:

- Gemini API SDK の直接利用
- Redis や外部 DB への依存
- マルチプロバイダー対応（OpenRouter 等）
- エンタープライズ監視機能

## マイルストーン目安

未定。個人プロジェクトのため、固定スケジュールは持たない。
Phase ごとに動くものを出してフィードバックを得るスタイルで進める。
