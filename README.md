# RPC PoC

HTTP + JSON remote procedure call in TypeScript (Express).

Client POSTs `{ method, args }` to `/rpc`. Server runs the method and returns `{ ok, result }` or `{ ok, error }`.

Sample methods: `listProducts`, `getProduct`, `calculateTotal`, `placeOrder`.

```bash
npm install
npm run server   # terminal 1
npm run client   # terminal 2
```
