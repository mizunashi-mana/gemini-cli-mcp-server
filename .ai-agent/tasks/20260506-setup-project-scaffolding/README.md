# リポジトリスキャフォールディングのセットアップ

## 目的・ゴール

Phase 0 の進行中作業として残っている「リポジトリ初期化（`package.json`、`devenv.nix`、
`tsconfig.json` 等のスキャフォールド）」を完了させ、Phase 1（`@google/gemini-cli` 動作確認、
最小 MCP サーバー雛形作成、Claude Desktop との疎通確認）に着手できる状態を作る。

## 背景

現状のリポジトリにはドキュメント類（`.ai-agent/`、`.claude/skills/`、`README.md`、`LICENSE*`、
`CLAUDE.md`、`.gitignore`）のみが存在し、以下のような実装の前提が一切整っていない:

- `package.json` がない → `npm install` も `npm run *` も動かない
- `tsconfig.json` がない → TypeScript コンパイル不可
- `devenv.nix` / `devenv.yaml` / `.envrc` がない → 再現性のある開発環境が立ち上がらない

Phase 1 の最初の項目「`@google/gemini-cli` の動作確認」は、まず `npm install`
できる状態でないと進められない。

## 実装方針

### スコープ内

1. **devenv 環境** — `devenv.nix` / `devenv.yaml` / `.envrc` を整備し、devenv デフォルトの
   Node.js + npm が `direnv allow` で立ち上がる状態にする
2. **`package.json`** — 最小限のメタデータ + 後続フェーズで使う npm scripts の枠組みを用意
   - `name`: `gemini-mcp`、`version`: `0.0.0`、`license`: `(Apache-2.0 OR MPL-2.0)`、
     `type`: `module`
   - `scripts`: `typecheck` / `build` / `dev` / `test` の枠（中身は最小実装で動くように）
   - `devDependencies`: `typescript`、`@types/node`、`tsx`、`vitest`
   - 実装段階で必要になる `@modelcontextprotocol/sdk`、`@google/gemini-cli`、`@anthropic-ai/dxt`
     はこのタスクでは追加しない（Phase 1 のスパイクで導入）
3. **`tsconfig.json`** — `target: ES2022`、`module: NodeNext`、`strict: true`、
   `outDir: dist`、`rootDir: src`、`moduleResolution: NodeNext` 等
4. **`src/index.ts`** — プレースホルダ（`build` / `typecheck` を通すための最小コード）
5. **steering ドキュメントの更新** — `plan.md` の「進行中の作業」を更新、
   `structure.md` にスキャフォールド後のディレクトリ構造を反映

### スコープ外

- `@modelcontextprotocol/sdk` の導入と MCP サーバー実装（Phase 1 で対応）
- `@google/gemini-cli` 経由の呼び出し実装（Phase 1 で対応）
- ESLint / Prettier 等のフォーマッタ・linter 設定（必要になったタイミングで別タスク）
- GitHub Actions / CI 設定（別タスク）
- DXT パッケージング設定（Phase 3 で対応）

## 完了条件

- [x] `direnv allow` で devenv 環境が立ち上がり、Node.js + npm が利用できる
- [x] `npm install` がエラーなく完了する
- [x] `npm run typecheck` がエラーなく完了する
- [x] `npm run build` がエラーなく完了し、`dist/` に成果物が出る
- [x] `npm test` が（テストゼロでも）正常終了する
- [x] `.ai-agent/steering/plan.md` の進行中／完了済みステータスを更新
- [x] `.ai-agent/structure.md` にスキャフォールド後のディレクトリ構造を反映

## 作業ログ

- 2026-05-06: タスク開始。リポジトリ現状を確認し、Phase 0 の残作業と認定。
- 2026-05-06: `feature/setup-project-scaffolding` ブランチを作成。
- 2026-05-06: `devenv.nix` は当初 `languages.javascript.package = pkgs.nodejs_20` を指定する
  方針だったが、議論の末「devenv のデフォルトでいく」方針に変更。
  `languages.javascript.enable + languages.javascript.npm.enable` のみとし、
  Node.js 24.14.1 + npm 11.11.0 が devenv shell 内で利用可能になることを確認。
  Node 20 LTS は今日時点（2026-05-06）でメンテナンス終了が約 5 ヶ月後に迫っており、
  新規プロジェクトの floor として固定するメリットが小さいと判断。
- 2026-05-06: `package.json`（type: module、scripts: build/typecheck/dev/test、
  devDependencies: typescript / @types/node / tsx / vitest）、
  `tsconfig.json`（ES2022 / NodeNext / strict / noUncheckedIndexedAccess）、
  `src/index.ts`（プレースホルダ）を作成。
- 2026-05-06: 当初 `vitest@^2.1.0` を指定したが、推移依存の esbuild に moderate 脆弱性が
  5 件あったため `^4.1.5` に更新。`npm audit` で 0 件を確認。
- 2026-05-06: `npm install` / `npm run typecheck` / `npm run build` / `npm test` がすべて
  正常終了することを確認（`dist/` に `.js` / `.d.ts` が生成される）。
- 2026-05-06: `.ai-agent/steering/plan.md` を Phase 1 着手準備状態に更新。
  `.ai-agent/structure.md` にスキャフォールド後のディレクトリ構造とテスト方針を反映。
