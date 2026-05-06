import { spawn } from "node:child_process";

export type GeminiResult = {
  response: string;
  sessionId?: string;
};

export type RunGeminiOptions = {
  command?: string;
  extraArgs?: readonly string[];
};

type GeminiJsonOutput = {
  session_id?: string;
  response?: string;
};

export async function runGemini(
  prompt: string,
  options: RunGeminiOptions = {},
): Promise<GeminiResult> {
  const command = options.command ?? "gemini";
  const args = [
    "--prompt",
    prompt,
    "--output-format",
    "json",
    "--skip-trust",
    ...(options.extraArgs ?? []),
  ];

  return await new Promise<GeminiResult>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

    child.on("error", reject);

    child.on("close", (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8");

      if (code !== 0) {
        reject(
          new Error(
            `gemini exited with code ${code ?? "null"}. stderr: ${stderr.trim()}`,
          ),
        );
        return;
      }

      let parsed: GeminiJsonOutput;
      try {
        parsed = JSON.parse(stdout) as GeminiJsonOutput;
      } catch (err) {
        reject(
          new Error(
            `Failed to parse gemini JSON output: ${(err as Error).message}. stdout: ${stdout.slice(0, 500)}`,
          ),
        );
        return;
      }

      if (typeof parsed.response !== "string") {
        reject(new Error(`gemini JSON output has no \`response\` field`));
        return;
      }

      resolve({
        response: parsed.response,
        sessionId: parsed.session_id,
      });
    });
  });
}
