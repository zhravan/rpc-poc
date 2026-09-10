# RPC PoC (TypeScript)

Minimal proof of concept for Remote Procedure Call over HTTP + JSON.

## Use case

A thin **checkout client** talks to a remote **shop service**.

The client never opens a database or hits REST resource URLs — it just calls procedures:

| Method | What it does |
| --- | --- |
| `listProducts()` | Browse the catalog |
| `getProduct(id)` | Look up one item |
| `calculateTotal(cart)` | Price a cart on the server |
| `placeOrder(userId, cart)` | Create an order remotely |

That is the gist of RPC: **invoke server logic as if it were a local function**.

## How it works

1. Client POSTs `{ method, args }` to `/rpc`
2. Server runs the matching function
3. Client gets `{ ok, result }` or `{ ok, error }`

## Run

```bash
npm install

# Terminal 1
npm run server

# Terminal 2
npm run client
```

Expected client shape:

```
--- Browse catalog ---
[ { id: 'apple', ... }, ... ]

--- Look up one product ---
{ id: 'milk', name: 'Milk', price: 60 }

--- Calculate cart total ---
total: 255

--- Place order ---
{ id: 'ord-1', userId: 'user-42', items: [...], total: 255 }

--- Error case (unknown product) ---
Product not found: banana
```
