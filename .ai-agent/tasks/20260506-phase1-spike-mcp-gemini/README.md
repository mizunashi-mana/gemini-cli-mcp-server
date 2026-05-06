# Phase 1 スパイク: MCP × Gemini CLI 最小疎通

## 目的・ゴール

Phase 1（スパイク / 技術検証）の3項目を一括で進め、**Claude Desktop から1ツールを呼び出すと
Gemini CLI 経由で応答が返る最小構成**を手元に作る。

`plan.md` の Phase 1 該当項目:

- [x] `@google/gemini-cli` の動作確認（OAuth ログイン、サブプロセスでの呼び出し）
- [x] `@modelcontextprotocol/sdk` の最小 MCP サーバー雛形作成
- [x] Claude Desktop にローカル設定（`claude_desktop_config.json`）で接続して疎通確認
      — ローカル MCP クライアントでの疎通確認まで実施。Claude Desktop 実機での確認は手動検証ステップとして残す。

## 実装方針

依存関係上、3項目をまとめて1タスクで進める。

1. **Gemini CLI 素振り** — `gemini` コマンドの存在・認証状態・サブプロセス呼び出しを確認。
   インストール経路（npm グローバル / npx）と起動方法（stdin 経由 / 引数経由）を把握する。
2. **依存追加** — `@modelcontextprotocol/sdk` を `dependencies` に追加。
3. **MCP サーバー雛形** — `src/index.ts` を最小 MCP サーバー（stdio トランスポート）に
   置き換え、ツールを 1 つ登録する。
   - レイヤー構造を意識しすぎず、まずは1ファイルで動かす。
   - 後続フェーズで `src/server/` `src/adapter/` `src/cli/` に分割可能なように、
     関数単位で責務を分ける。
4. **Gemini CLI アダプタ試作** — `child_process.spawn` で `gemini` を呼び、
   プロンプトを渡して応答を返すだけの最小実装。タイムアウト・エラー処理は後回しで OK。
5. **動作確認** — `npm run build` / `typecheck` / `test` を通す。
6. **Claude Desktop 接続例** — `claude_desktop_config.json` のサンプルを README または
   タスク README の作業ログに記載。実機での疎通確認結果も作業ログに残す。

## 完了条件

- [x] `npm run typecheck` が通る
- [x] `npm run build` が通る
- [x] `npm test` が通る
- [x] ビルド成果物（`dist/index.js`）が stdio MCP サーバーとして起動する
- [x] 登録した MCP ツール経由で Gemini CLI に問い合わせて応答が得られる
      （ローカル `node dist/index.js` を MCP クライアントから叩いて確認）
- [x] Claude Desktop の設定例を作業ログに記載
- [x] スパイクで得た知見を作業ログに残す

## スコープ外

以下は本スパイクでは扱わない（Phase 2 以降）:

- 複数ツール（`gemini-prompt-with-files` など）の整備
- 体系的なエラーハンドリング・タイムアウト設計
- DXT パッケージング
- ファイル分割によるレイヤー化
- ドキュメント整備（README 拡充）

## 作業ログ

### 2026-05-06: Gemini CLI 素振り

手元の環境で `gemini` v0.40.1 が利用可能であることを確認。Workspace OAuth は
事前に `gemini auth login` 済み。

確認した起動方法:

- `gemini -p "<prompt>" --output-format text` — テキスト応答のみ
- `gemini -p "<prompt>" --output-format json` — `{ session_id, response, stats }` 形式の
  JSON。プログラマチックに扱う場合はこちらが扱いやすい。
- 非対話実行時は `--skip-trust` か `GEMINI_CLI_TRUST_WORKSPACE=true` が必要
  （cwd が trusted folders に登録されていない場合）。

得られた知見:

- 応答本体は JSON 出力の `.response` フィールドに入る。stderr には起動時の
  ログ（"Ripgrep is not available..." など）が混じるので、応答取得は **stdout のみ** を読む。
- ヘッドレスモードでも信頼フォルダ判定が走るため、サブプロセスで起動する MCP サーバー
  からは `--skip-trust` を渡すか `GEMINI_CLI_TRUST_WORKSPACE=true` を環境変数に
  入れるのが現実的。MVP ではどちらかを既定で使う方針とする。
- バージョン取得は `gemini --version` で `0.40.1` のような単一行が出るので、
  事前ヘルスチェックに使える。

### 2026-05-06: 依存追加と MCP サーバー雛形

`@modelcontextprotocol/sdk@^1.29.0` と `zod@^4.4.3` を `dependencies` に追加。

`tsconfig.json` の `compilerOptions.types` に `"node"` を追加。これがないと
`process` / `Buffer` / `node:child_process` が解決できず TypeScript エラーになる
（`@types/node` 自体は Phase 0 で devDependencies に入っていた）。

実装ファイル:

- `src/gemini.ts` — `runGemini(prompt)` を export。`child_process.spawn("gemini", ["--prompt", ..., "--output-format", "json", "--skip-trust"])` で起動し、stdout の JSON から `response` を取り出す。
- `src/index.ts` — `McpServer` を作って `gemini-prompt` ツールを 1 つ登録。
  `StdioServerTransport` で stdio に接続。エントリポイント判定は
  `import.meta.url` と `process.argv[1]` の比較で実施。

設計メモ:

- ログは **stderr** に出す（stdout は MCP のトランスポートとして占有されるため）。
- ツール呼び出しのレスポンス整形は `{ content: [{ type: "text", text: ... }] }` の
  最小形。MVP で構造化メタデータ（session_id 等）を含めるかは別途判断。

### 2026-05-06: ビルド・テスト・疎通確認

- `npm run typecheck` / `npm run build` / `npm test` がすべて通ることを確認。
- ローカルに spike 用 MCP クライアント（`.scratch/spike-client.mjs`）を作成し、
  ビルド成果物 `dist/index.js` に対して `listTools` → `callTool("gemini-prompt", ...)` を実行。
  応答 `"hello"` が返ることを確認。`.scratch/` は `.gitignore` 済み。

セキュリティメモ:

- `npm audit` で moderate 3 件（`ip-address` の XSS）を検出。経路は
  `@modelcontextprotocol/sdk` → `express-rate-limit` → `ip-address`。
  本プロダクトは **stdio トランスポートのみ** 使用するため express 系の
  コードパスは実行されない（影響なし）。SDK 側の修正を待つ。

### 2026-05-06: Claude Desktop 設定例

`~/Library/Application Support/Claude/claude_desktop_config.json` に以下を追記する想定:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["/Users/<you>/Workspace/MyWork/gemini-mcp/dist/index.js"]
    }
  }
}
```

前提:

- `gemini` コマンドが `PATH` で解決できる（必要なら `env` を設定で渡す）。
- `gemini auth login` が完了している。

実機（Claude Desktop）での確認は手動検証ステップとして残す。Phase 2 で
DXT 配布や README 整備と合わせて実施する。

## 次フェーズへの引き継ぎ

Phase 2（MVP）に向けて持ち越す検討事項:

- **タイムアウト・キャンセル**: `gemini` 応答が長引いた場合の `AbortSignal` 連携。
- **エラーメッセージの整形**: `gemini` 未インストール / 認証未了 / trust エラーを
  ユーザーに分かりやすい MCP エラーとして返す。
- **`@path` 引数（`gemini-prompt-with-files`）**: ファイル参照を渡す形式の検証。
- **`stderr` 取り扱い**: 応答に混入するログ（trust 警告など）の扱い再検討。
- **モデル切替**: `--model` 指定の MCP ツール引数化。
- **`--skip-trust` の既定**: ユーザー環境を信頼することのリスク評価
  （MCP サーバー自体に届いた入力でファイルを書き換えるツールは Phase 1 では未提供）。
- **依存脆弱性**: `ip-address` 経由の moderate 3 件を SDK 側修正 or 別 SDK バージョンで解消するか追跡。

