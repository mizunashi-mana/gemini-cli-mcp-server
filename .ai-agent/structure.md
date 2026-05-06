# gemini-mcp ディレクトリ構成

本ドキュメントは 2026-05-06 時点でのリポジトリ構造を記述する。Phase 1 のスパイクが
完了し、最小 MCP サーバー（stdio + `gemini-prompt` ツール 1 つ）が動作する状態。
レイヤー分割や複数ツール展開は Phase 2（MVP）で実施する。

## 全体構造

```
gemini-mcp/
├── .ai-agent/                    # AI エージェント向けドキュメント
│   ├── steering/                 # 戦略的ガイドドキュメント
│   │   ├── market.md             # 市場分析・競合調査
│   │   ├── plan.md               # 実装計画・ロードマップ
│   │   ├── product.md            # プロダクトビジョン・スコープ
│   │   ├── tech.md               # 技術アーキテクチャ・スタック
│   │   └── work.md               # 開発ワークフロー・規約
│   ├── structure.md              # 本ファイル（ディレクトリ構成）
│   ├── projects/                 # 長期プロジェクト（複数タスクにまたがる目標）
│   ├── tasks/                    # 個別タスク（日〜週単位の作業）
│   └── surveys/                  # 技術調査・検討
├── .claude/
│   └── skills/                   # autodev カスタムスキル群
│       ├── autodev-create-issue/
│       ├── autodev-create-pr/
│       ├── autodev-discussion/
│       ├── autodev-import-review-suggestions/
│       ├── autodev-replan/
│       ├── autodev-review-pr/
│       │   ├── SKILL.md
│       │   └── reviewer-spawn-prompt.md
│       ├── autodev-start-new-project/
│       ├── autodev-start-new-survey/
│       ├── autodev-start-new-task/
│       ├── autodev-steering/
│       └── autodev-switch-to-default/
├── src/                          # TypeScript ソース
│   ├── gemini.ts                 # Gemini CLI サブプロセス呼び出しアダプタ
│   └── index.ts                  # MCP サーバー雛形（stdio + gemini-prompt ツール）
├── devenv.nix                    # Node.js + npm 環境定義（バージョンは devenv デフォルト）
├── devenv.yaml                   # devenv 入力（nixpkgs rolling）
├── devenv.lock                   # devenv ロックファイル
├── package.json                  # npm スクリプト・依存（dev のみ: ts/tsx/vitest）
├── tsconfig.json                 # TS コンパイラ設定（ES2022 / NodeNext / strict）
└── CLAUDE.md                     # Claude Code 向けプロジェクトガイド
```

## 各ディレクトリの役割

### `.ai-agent/`

AI エージェント（主に Claude Code）が参照する開発ガイドラインを集約する。
コードを書く前に、関連する steering ドキュメントを必ず読み込む運用とする。

#### `.ai-agent/steering/`

プロジェクトの方向性を定義する一群のドキュメント。

- **`product.md`** — プロダクトビジョン、ターゲットユーザー、ユースケース、機能スコープ、
  非スコープ。Gemini API SDK 直接利用や外部ストレージ依存などの**やらないこと**を明記。
- **`tech.md`** — TypeScript / Node.js / npm / devenv の技術スタック、`@google/gemini-cli`
  サブプロセス起動を中核としたアーキテクチャ図、依存ポリシー。
- **`market.md`** — Gemini MCP 系競合（jamubc、centminmod、Jacob）の分析と本プロダクトの
  差別化軸（Workspace 認証 / DXT 配布 / シンプルさ）。
- **`plan.md`** — Phase 0 (準備) / Phase 1 (スパイク) / Phase 2 (MVP) / Phase 3 (DXT 配布)
  / Phase 4 (拡充) の段階的ロードマップ。
- **`work.md`** — GitHub Flow ベースのブランチ戦略、GitHub レビュー方式、タスク実行フロー、
  プロダクト固有の注意事項。

#### `.ai-agent/structure.md`

本ファイル。リポジトリの実構造を記述する。コード追加に伴って更新する。

#### `.ai-agent/tasks/` / `projects/` / `surveys/`

進行中・完了済みの作業ドキュメントを格納する。各サブディレクトリは命名規則
`YYYYMMDD-{kebab-case-name}/` を採用し、内部に `README.md` で目的・方針・完了条件・
作業ログを管理する。現時点では空。

### `.claude/skills/`

autodev フローを構成するカスタムスキル群。本リポジトリでは **GitHub レビュー**形式の
バリアントを選択しているため、`autodev-review-pr/` および `autodev-import-review-suggestions/`
は GitHub Review API を利用する SKILL.md を配置している。

カスタマイズ済みのスキル:

- **`autodev-start-new-task/SKILL.md`** — プロジェクト固有の動作確認コマンド（`npm run typecheck` 等）
  と、Gemini API SDK を直接使わない・外部ストレージを導入しないなどの制約を記載
- **`autodev-steering/SKILL.md`** — `cat package.json | jq '.scripts'` などプロジェクト構成に
  応じた現状把握コマンドを具体化
- **`autodev-review-pr/reviewer-spawn-prompt.md`** — Gemini API SDK 直接利用の禁止、
  Workspace OAuth 認証フローの保持、DXT サイズへの注意などをレビュー観点に追加
- **`autodev-create-pr/SKILL.md`** — PR テンプレートのパス（`.github/PULL_REQUEST_TEMPLATE.md`）
  を明記

### ルートファイル

- **`CLAUDE.md`** — Claude Code が起動時に読み込むプロジェクトガイド。autodev ドキュメントの
  在りかとプロダクト固有の重要原則（Gemini CLI 経由・外部ストレージなし・DXT 配布）を記載。
- **`package.json`** — npm メタデータ。`type: module`（ESM）、`engines.node >= 22`、
  `private: true`。スクリプトは `build` / `typecheck` / `dev` / `test` の最小セット。
  Phase 1 で `@modelcontextprotocol/sdk` と `zod` を `dependencies` に追加済み。
- **`tsconfig.json`** — TypeScript 設定。`target: ES2022`、`module: NodeNext`、
  `strict: true`、`rootDir: src`、`outDir: dist`、`noUncheckedIndexedAccess` 有効、
  `types: ["node"]` で Node.js 型を取り込む。
- **`devenv.nix` / `devenv.yaml` / `devenv.lock`** — Nix ベースの再現可能な開発環境。
  devenv のデフォルト Node.js（執筆時点で 24 系）と npm を提供する。Node のバージョンを
  固定したくなったら `languages.javascript.package` を明示する。
- **`.envrc`（リポジトリ非管理）** — direnv 利用者向け。リポジトリには含めず、各自で
  `use devenv` のみ書いた `.envrc` を作成して `direnv allow` する想定。`.gitignore` に
  記載済み。

## アーキテクチャパターン

Phase 1 時点ではフラットな構成（`src/` 直下の 2 ファイル）を採用する。MVP 以降で
責務が大きくなった段階でディレクトリ分割を検討する。

- **`src/index.ts`** — エントリポイント兼サーバー組み立て層。`createServer()` で
  `McpServer` を構築し、`gemini-prompt` ツールを登録。`StdioServerTransport` で
  stdio に接続する。ログは stderr に出す（stdout は MCP のトランスポート占有のため）。
- **`src/gemini.ts`** — Gemini CLI 実行層。`runGemini(prompt, options)` で
  `child_process.spawn("gemini", ["--prompt", ..., "--output-format", "json", "--skip-trust"])`
  を起動し、stdout の JSON から `response` を取り出す。

Phase 2 以降で以下を追加・追記する想定:

- レイヤー分割（`src/server/` / `src/adapter/` / `src/cli/` など）
- DXT パッケージング関連ファイル（`manifest.json`、ビルド出力先）

## 動作確認用スクラッチ

`.scratch/` を `.gitignore` に登録済み。Phase 1 のローカル疎通確認では
`.scratch/spike-client.mjs` から `dist/index.js` に対して
`@modelcontextprotocol/sdk` の `Client` + `StdioClientTransport` で接続する形を採った。
コミットしないが、再検証時のために手順をタスク README の作業ログに残している。

## テスト構成

テストランナーは **vitest** を採用（Phase 0 で `devDependencies` に追加済み）。
`npm test` は `vitest run --passWithNoTests` で起動し、現時点ではテストゼロで成功する。

ファイル配置ルールは実装開始時に決定する。第一候補は `*.test.ts` を実装ファイルに
隣接させる方式（テストと実装の対応が見やすい）。
