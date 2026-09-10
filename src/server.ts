import http from "node:http";
import type { RpcRequest, RpcResponse } from "./rpc.ts";

/** Methods the client can call remotely */
const methods: Record<string, (...args: any[]) => unknown> = {
  add: (a: number, b: number) => a + b,
  greet: (name: string) => `Hello, ${name}!`,
  multiply: (a: number, b: number) => a * b,
};

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/rpc") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }

  let response: RpcResponse;

  try {
    const body = JSON.parse(Buffer.concat(chunks).toString()) as RpcRequest;
    const fn = methods[body.method];

    if (!fn) {
      response = { ok: false, error: `Unknown method: ${body.method}` };
    } else {
      const result = fn(...(body.args ?? []));
      response = { ok: true, result };
    }
  } catch (err) {
    response = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(response));
});

server.listen(PORT, () => {
  console.log(`RPC server listening on http://localhost:${PORT}/rpc`);
  console.log(`Available methods: ${Object.keys(methods).join(", ")}`);
});
