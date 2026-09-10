export type RpcRequest = {
  method: string;
  args: unknown[];
};

export type RpcResponse =
  | { ok: true; result: unknown }
  | { ok: false; error: string };
