import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

// Serve the literal export under its production prefix. No SPA/RSC rewrites.
const root = path.resolve("out");
const prefix = "/Portfolio";
const mime = {
  ".html": "text/html",
  ".txt": "text/plain",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
};
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://127.0.0.1");
    if (url.pathname === prefix) {
      res.writeHead(308, { location: prefix + "/" }).end();
      return;
    }
    if (!url.pathname.startsWith(prefix + "/")) throw new Error("prefix");
    let target = path.resolve(
      root,
      "." + decodeURIComponent(url.pathname.slice(prefix.length))
    );
    if (target !== root && !target.startsWith(root + path.sep)) throw new Error("path");
    if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
    const data = await readFile(target);
    res
      .writeHead(200, {
        "Content-Type": mime[path.extname(target)] ?? "application/octet-stream",
      })
      .end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}).listen(4173, "127.0.0.1", () =>
  console.log("Export preview: http://127.0.0.1:4173/Portfolio/")
);
