import assert from "node:assert";
import type { Box, Item } from "./parse";

export class Printer {
  private _widthCache = new WeakMap<Item, number>();

  private _getWidth(item: Item) {
    const cached = this._widthCache.get(item);
    if (cached !== undefined) {
      return cached;
    }
    if (item.type === "line") {
      this._widthCache.set(item, item.contents.length);
      return item.contents.length;
    }
    let max = 0;
    for (let child of item.items) {
      max = Math.max(this._getWidth(child), max);
    }
    const result = max + (item.border ? 4 : 0);
    this._widthCache.set(item, result);
    return result;
  }

  private _print(box: Box) {
    let result: string[] = [];
    const width = this._getWidth(box);

    if (box.border) {
      const first = box.items.shift();
      assert(
        first && first.type === "line",
        "bordered box must have title line as first item"
      );
      result.push(`╔═${first.contents.padEnd(width - 4, "═")}═╗`);
    }

    for (const child of box.items) {
      if (child.type === "box") {
        result = result.concat(
          this._print(child).map(
            (line) => box.border ? `║ ${line.padEnd(width - 4, " ")} ║` : line,
          )
        );
        continue;
      }
      result.push(box.border ? `║ ${child.contents.padEnd(width - 4, " ")} ║` : child.contents);
    }

    if (box.border) {
      result.push(`╚${"═".repeat(width - 2)}╝`);
    }

    return result;
  }

  public print(box: Box) {
    const lines = this._print(box);
    return lines.join("\n");
  }
}
