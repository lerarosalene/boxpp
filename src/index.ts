import fs from "node:fs";
import { consume } from "./util";
import { parse } from "./parse";
import { Printer } from "./print";

const fsp = fs.promises;

async function main() {
  const input = process.argv[2];
  if (!input) {
    throw new Error(`Specify input file or "-" to read from stdin`);
  }

  const contents =
    input === "-"
      ? await consume(process.stdin)
      : await fsp.readFile(input, "utf-8");

  const printer = new Printer();
  const items = parse(contents);
  const shebang = `#!/usr/bin/env -S sed -e 's/[╔║═╚]//g;s/╗/{/g;s/╝/}/g;s/^#!.*$//g;'`;
  const text = printer.print(items);
  console.log(shebang + "\n" + text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
