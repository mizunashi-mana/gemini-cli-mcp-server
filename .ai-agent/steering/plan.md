# 実装計画・ロードマップ

## 現在のフェーズ

**Phase 0: 準備 / 設計** — 2026-04-30 時点

リポジトリ初期化と autodev 開発環境のセットアップ完了直後。コード資産はまだなし。

## 完了済み機能

なし（新規プロジェクト）。

## 進行中の作業

- autodev 開発環境のセットアップ（本タスクで完了予定）
- リポジトリ初期化（`package.json`、`devenv.nix`、`tsconfig.json` 等のスキャフォールド）

## 今後の計画

### Phase 1: スパイク / 技術検証

目的: Gemini CLI を MCP 経由で動かせることを最短で確認する。

- [ ] `@google/gemini-cli` の動作確認（OAuth ログイン、サブプロセスでの呼び出し）
- [ ] `@modelcontextprotocol/sdk` の最小 MCP サーバー雛形作成
- [ ] Claude Desktop にローカル設定（`claude_desktop_config.json`）で接続して疎通確認

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
