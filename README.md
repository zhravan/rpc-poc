# RPC PoC (TypeScript)

Minimal proof of concept for Remote Procedure Call over HTTP + JSON.

## How it works

1. **Server** exposes methods (`add`, `greet`, `multiply`) at `POST /rpc`
2. **Client** sends `{ method, args }` and gets `{ ok, result }` or `{ ok, error }`

## Run

```bash
npm install

# Terminal 1
npm run server

# Terminal 2
npm run client
```

Expected client output:

```
add(2, 3)       => 5
greet('World')  => Hello, World!
multiply(4, 5)  => 20
missing()       => Unknown method: missing
```
