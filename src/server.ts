import express from "express";
import type { RpcRequest, RpcResponse } from "./rpc.ts";

type Product = { id: string; name: string; price: number };
type CartItem = { productId: string; qty: number };

const catalog: Record<string, Product> = {
  apple: { id: "apple", name: "Apple", price: 30 },
  bread: { id: "bread", name: "Bread", price: 45 },
  milk: { id: "milk", name: "Milk", price: 60 },
};

const orders: Array<{ id: string; userId: string; items: CartItem[]; total: number }> = [];

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
const app = express();

app.use(express.json());

app.post("/rpc", (req, res) => {
  let response: RpcResponse;

  try {
    const body = req.body as RpcRequest;
    const fn = methods[body.method];

    if (!fn) {
      response = { ok: false, error: `Unknown method: ${body.method}` };
    } else {
      response = { ok: true, result: fn(...(body.args ?? [])) };
    }
  } catch (err) {
    response = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}/rpc`);
});
