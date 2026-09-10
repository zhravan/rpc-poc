import type { RpcRequest, RpcResponse } from "./rpc.ts";

const RPC_URL = "http://localhost:3000/rpc";

async function call(method: string, ...args: unknown[]): Promise<unknown> {
  const request: RpcRequest = { method, args };

  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = (await res.json()) as RpcResponse;

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.result;
}

async function main() {
  console.log("add(2, 3)       =>", await call("add", 2, 3));
  console.log("greet('World')  =>", await call("greet", "World"));
  console.log("multiply(4, 5)  =>", await call("multiply", 4, 5));

  try {
    await call("missing");
  } catch (err) {
    console.log("missing()     =>", (err as Error).message);
  }
}

main().catch(console.error);
