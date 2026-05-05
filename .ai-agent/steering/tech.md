# 技術アーキテクチャ

## 技術スタック

### 言語・ランタイム

- **TypeScript** (target: ES2022 想定)
- **Node.js** — Claude Desktop 内蔵 Node ランタイムでの動作を前提
  - DXT 配布時は Claude Desktop 同梱 Node.js を利用するため、ユーザー側の Node インストールは不要

### パッケージマネージャ

- **npm** — Claude Desktop / DXT エコシステムとの整合性を優先

### 主要ライブラリ（予定）

- **`@modelcontextprotocol/sdk`** — MCP サーバー実装の公式 SDK
- **`@anthropic-ai/dxt`** — DXT パッケージング用 CLI
- **`@google/gemini-cli`** — 外部依存として利用（直接インポートではなく、サブプロセス起動）

### 開発環境

- **devenv** — Nix ベースの開発環境管理。`devenv.nix` / `devenv.yaml` で再現可能な
  ローカル環境を提供する
- **direnv** との連動を想定（`.envrc` で `use devenv`）

## アーキテクチャ概要

```
┌─────────────────────┐
│  Claude Desktop     │
│  (MCP client)       │
└─────────┬───────────┘
          │ stdio (MCP protocol)
          ▼
┌─────────────────────┐
│  gemini-mcp         │   ← 本プロダクト
│  (MCP server)       │
└─────────┬───────────┘
          │ child_process
          ▼
┌─────────────────────┐
│  @google/gemini-cli │   ← 外部 CLI（同梱 or ユーザー環境）
└─────────┬───────────┘
          │ HTTPS (OAuth, Workspace)
          ▼
┌─────────────────────┐
│  Google Gemini API  │
└─────────────────────┘
```

### レイヤー構造（想定）

1. **MCP サーバーレイヤー** — `@modelcontextprotocol/sdk` を使ったツール定義・stdio
   トランスポート
2. **アダプタレイヤー** — MCP のリクエストを Gemini CLI 引数に変換、レスポンスを MCP の
   ツール出力にマッピング
3. **CLI 実行レイヤー** — `gemini` コマンドのサブプロセス起動・stdout/stderr 取り回し・
   タイムアウト管理

## パッケージ構成

初期はモノパッケージ（単一 `package.json`）でスタート。将来的に DXT 用ビルドステップが
複雑化したら分割を検討する。

## 開発環境セットアップ

```bash
# 想定フロー
direnv allow                  # devenv 起動
npm install                   # 依存導入
npm run dev                   # 開発モード（tsx watch 等）
npm run build                 # tsc ビルド
npm run pack:dxt              # .dxt ファイル生成
```

セットアップ手順の確定は実装時に詰める。

## テスト戦略

- **ユニットテスト**: アダプタレイヤー（MCP リクエスト → CLI 引数変換）を中心に
- **インテグレーションテスト**: モックした Gemini CLI を使った MCP サーバー全体の動作確認
- **手動検証**: 実際の Claude Desktop に DXT をインストールして動作確認

テストランナーは未確定。`vitest` を第一候補とする（TypeScript 親和性・速度）。

## CI/CD

未着手。初期段階では以下を整備予定:

- **GitHub Actions** — push / PR で型チェック・テスト・ビルド
- **リリース** — タグ push で `.dxt` を自動ビルドし GitHub Releases に添付

## 依存ポリシー

- **Gemini API への直接依存を避ける** — 必ず `@google/gemini-cli` 経由とし、API バージョン
  追従を Google 側に委ねる
- **外部ストレージ依存を持たない** — ローカル MCP サーバーとして自己完結させる
- **依存を最小に保つ** — DXT 同梱サイズと脆弱性面を抑える
