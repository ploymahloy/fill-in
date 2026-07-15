import http from "node:http";
import type { Socket } from "node:net";
import type { Express } from "express";

export type TestResponse = {
  status: number;
  body: unknown;
};

export function request(
  app: Express,
  method: string,
  path: string,
): Promise<TestResponse> {
  return new Promise((resolve, reject) => {
    const req = new http.IncomingMessage(null as unknown as Socket);
    req.method = method;
    req.url = path;
    req.headers = { host: "localhost" };

    const chunks: Buffer[] = [];
    const res = new http.ServerResponse(req);

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = ((
      chunk: unknown,
      encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
      callback?: (error?: Error | null) => void,
    ) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk)
          ? chunk
          : Buffer.from(String(chunk)));
      }

      if (typeof encodingOrCallback === "function") {
        return originalWrite(chunk as never, encodingOrCallback);
      }

      return originalWrite(chunk as never, encodingOrCallback!, callback);
    }) as typeof res.write;

    res.end = ((
      chunk?: unknown,
      encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
      callback?: (error?: Error | null) => void,
    ) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }

      const raw = Buffer.concat(chunks).toString("utf8");
      let body: unknown = raw;
      const contentType = res.getHeader("content-type");
      if (
        typeof contentType === "string" &&
        contentType.includes("application/json") &&
        raw.length > 0
      ) {
        body = JSON.parse(raw);
      }

      resolve({ status: res.statusCode ?? 200, body });

      if (typeof encodingOrCallback === "function") {
        return originalEnd(chunk as never, encodingOrCallback);
      }
      return originalEnd(chunk as never, encodingOrCallback!, callback);
    }) as typeof res.end;

    res.on("error", reject);
    app(req, res);
  });
}
