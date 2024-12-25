import assert from "node:assert";
import { last } from "./util";

export interface Line {
  type: "line";
  contents: string;
}

export interface Box {
  type: "box";
  items: Array<Item>;
  border: boolean;
}

export type Item = Box | Line;

export function parse(contents: string): Box {
  const lines = contents.split("\n");
  let stack: Box[] = [{ type: "box", border: false, items: [] }];
  for (const line of lines) {
    if (line.trim().endsWith("{")) {
      const newBox: Box = {
        type: "box",
        items: [],
        border: true,
      };
      newBox.items.push({
        type: "line",
        contents: line.trim().replace(/\{$/, "").trim(),
      });
      const top = last(stack);
      assert(top);
      top.items.push(newBox);
      stack.push(newBox);
      continue;
    }
    if (line.trim().endsWith("}")) {
      stack.pop();
      continue;
    }
    const top = last(stack);
    assert(top);
    top.items.push({
      type: "line",
      contents: line.trim(),
    });
  }

  assert(stack.length === 1);
  return stack[0];
}