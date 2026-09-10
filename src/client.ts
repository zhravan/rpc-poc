import type { RpcRequest, RpcResponse } from "./rpc.ts";

const RPC_URL = "http://localhost:3000/rpc";

async function call(method: string, ...args: unknown[]): Promise<unknown> {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, args } satisfies RpcRequest),
  });

  const data = (await res.json()) as RpcResponse;
  if (!data.ok) throw new Error(data.error);
  return data.result;
}

async function main() {
  console.log("products:", await call("listProducts"));
  console.log("milk:", await call("getProduct", "milk"));

  const cart = [
    { productId: "apple", qty: 3 },
    { productId: "bread", qty: 1 },
    { productId: "milk", qty: 2 },
  ];

  console.log("total:", await call("calculateTotal", cart));
  console.log("order:", await call("placeOrder", "user-42", cart));

  try {
    await call("getProduct", "banana");
  } catch (err) {
    console.log("error:", (err as Error).message);
  }
}

main().catch(console.error);
