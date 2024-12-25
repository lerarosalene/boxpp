import type { Readable } from "node:stream";

export function consume(stream: Readable) {
  return new Promise<string>((resolve, reject) => {
    const chunks: string[] = [];

    stream.setEncoding("utf-8");
    stream.on("data", chunk => {
      chunks.push(chunk);
    });
    stream.on("end", () => resolve(chunks.join("")));
    stream.on("error", (error) => reject(error));
  });
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
