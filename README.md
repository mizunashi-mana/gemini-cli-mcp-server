# gemini-mcp

> A Claude Desktop extension that brings Gemini into Claude — via your Google Workspace login, no API key required.

## What is this?

`gemini-mcp` is an [MCP](https://modelcontextprotocol.io/) server that wraps the official
[Google Gemini CLI](https://github.com/google-gemini/gemini-cli). It lets you call Gemini
from Claude Desktop (and other MCP-compatible clients) using the **OAuth login your Gemini
CLI already has** — typically tied to your Google Workspace account.

### Why?

Most existing Gemini MCP servers assume you have (or can issue) a Gemini API key. That's a
non-starter when:

- Your organization restricts standalone API key issuance, but you do have a **Google Workspace**
  contract that includes Gemini access.
- You don't want to manage yet another personal API key alongside your Workspace login.
- You'd rather not edit JSON config files to wire up an MCP server in the first place.

`gemini-mcp` takes a different path:

- **Workspace-friendly auth** — reuses Gemini CLI's existing OAuth state, so authentication
  goes through `gemini auth login`, not an API key.
- **One-click install via DXT** — distributed as a Claude Desktop Extension (`.dxt`), so no
  manual `claude_desktop_config.json` editing is needed.
- **Minimal surface area** — focused on bridging the Gemini CLI's core capabilities, not on
  becoming a multi-provider gateway.

## Status

**Early development.** The repository was just initialized; no MVP yet. See
[`.ai-agent/steering/plan.md`](./.ai-agent/steering/plan.md) for the roadmap.

## Quick Start

> Installation instructions will be added once the MVP and DXT package are available.
> The intended end-user flow is:
>
> 1. Install [Gemini CLI](https://github.com/google-gemini/gemini-cli) and run `gemini auth login`
>    with your Workspace account.
> 2. Download the latest `gemini-mcp.dxt` from GitHub Releases.
> 3. Open Claude Desktop and double-click the `.dxt` file (or use the extensions manager) to
>    install it.
> 4. Use Gemini from Claude.

## Development

Prerequisites:

- [devenv](https://devenv.sh/) (with Nix) for the development shell
- Node.js (provided via devenv)

```bash
direnv allow      # activate devenv shell
npm install       # install dependencies
npm run dev       # run the MCP server in dev mode
npm run build     # build for distribution
npm run pack:dxt  # produce a .dxt package
```

The exact set of scripts will solidify as the codebase grows.

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](./LICENSE-APACHE) or
  <https://www.apache.org/licenses/LICENSE-2.0>)
- Mozilla Public License, Version 2.0 ([LICENSE-MPL](./LICENSE-MPL) or
  <https://www.mozilla.org/en-US/MPL/2.0/>)

at your option.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion
in the work by you shall be dual licensed as above, without any additional terms or conditions.
