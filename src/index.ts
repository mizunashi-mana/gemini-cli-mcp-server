import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runGemini } from "./gemini.js";

export const NAME = "gemini-mcp";
export const VERSION = "0.0.0";

export function createServer(): McpServer {
  const server = new McpServer({ name: NAME, version: VERSION });

  server.registerTool(
    "gemini-prompt",
    {
      description:
        "Send a prompt to Gemini via the locally installed `gemini` CLI and return the response.",
      inputSchema: {
        prompt: z.string().min(1).describe("Prompt text to send to Gemini"),
      },
    },
    async ({ prompt }) => {
      const result = await runGemini(prompt);
      return {
        content: [{ type: "text", text: result.response }],
      };
    },
  );

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[${NAME}] connected on stdio`);
}

const isDirectRun =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1] ?? "");

if (isDirectRun) {
  main().catch((err) => {
    console.error("[gemini-mcp] fatal:", err);
    process.exit(1);
  });
}
