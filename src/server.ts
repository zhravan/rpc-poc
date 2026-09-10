import http from "node:http";
import type { RpcRequest, RpcResponse } from "./rpc.ts";

type Product = { id: string; name: string; price: number };
type CartItem = { productId: string; qty: number };

/** In-memory catalog — stands in for a remote inventory service */
const catalog: Record<string, Product> = {
  apple: { id: "apple", name: "Apple", price: 30 },
  bread: { id: "bread", name: "Bread", price: 45 },
  milk: { id: "milk", name: "Milk", price: 60 },
};

const orders: Array<{ id: string; userId: string; items: CartItem[]; total: number }> = [];

/**
 * Remote procedures the client can invoke.
 * Use case: a thin client talks to a shop service without knowing DB/HTTP details.
 */
const methods: Record<string, (...args: any[]) => unknown> = {
  listProducts: () => Object.values(catalog),

  getProduct: (id: string) => {
    const product = catalog[id];
    if (!product) throw new Error(`Product not found: ${id}`);
    return product;
  },

  calculateTotal: (items: CartItem[]) => {
    let total = 0;
    for (const item of items) {
      const product = catalog[item.productId];
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      total += product.price * item.qty;
    }
    return total;
  },

  placeOrder: (userId: string, items: CartItem[]) => {
    const total = methods.calculateTotal(items) as number;
    const order = {
      id: `ord-${orders.length + 1}`,
      userId,
      items,
      total,
    };
    orders.push(order);
    return order;
  },
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
  console.log(`Shop RPC server on http://localhost:${PORT}/rpc`);
  console.log(`Methods: ${Object.keys(methods).join(", ")}`);
});
