# gemini-mcp ディレクトリ構成

本ドキュメントは 2026-04-30 時点でのリポジトリ構造を記述する。新規プロジェクトのため、
ソースコード・ビルド設定はまだ存在せず、autodev 開発環境のドキュメント類のみが配置されている。

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

## アーキテクチャパターン（実装後に追記）

ソースコードがまだないため、実装が始まったら以下を追記する:

- レイヤー構造（MCP サーバーレイヤー / アダプタレイヤー / CLI 実行レイヤー）
- 各層のディレクトリ配置（`src/server/`、`src/adapter/`、`src/cli/` 等の予定）
- DXT パッケージング関連ファイル（`manifest.json`、ビルド出力先）

## テスト構成（実装後に追記）

テストランナー（vitest 第一候補）と配置ルール（`*.test.ts` を実装ファイル隣接 or `tests/`
ディレクトリ集約）は実装開始時に決定し、ここに追記する。
