import type { RpcRequest, RpcResponse } from "./rpc.ts";

const RPC_URL = "http://localhost:3000/rpc";

/** Call a remote procedure as if it were a local function */
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

/**
 * Sample: client-side checkout flow.
 * The client never touches the catalog DB — it only calls remote procedures.
 */
async function main() {
  console.log("--- Browse catalog ---");
  console.log(await call("listProducts"));

  console.log("\n--- Look up one product ---");
  console.log(await call("getProduct", "milk"));

  const cart = [
    { productId: "apple", qty: 3 },
    { productId: "bread", qty: 1 },
    { productId: "milk", qty: 2 },
  ];

  console.log("\n--- Calculate cart total ---");
  console.log("cart:", cart);
  console.log("total:", await call("calculateTotal", cart));

  console.log("\n--- Place order ---");
  console.log(await call("placeOrder", "user-42", cart));

  console.log("\n--- Error case (unknown product) ---");
  try {
    await call("getProduct", "banana");
  } catch (err) {
    console.log((err as Error).message);
  }
}

main().catch(console.error);
