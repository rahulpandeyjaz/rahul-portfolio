import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml"
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(root, cleanPath === "\\" || cleanPath === "/" ? "index.html" : cleanPath);
    const publicPath = join(root, "public", cleanPath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (!existsSync(filePath) && existsSync(publicPath)) {
      filePath = publicPath;
    }

    if (!existsSync(filePath)) {
      filePath = join(root, "index.html");
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(error?.stack || error));
  }
}).listen(port, () => {
  console.log(`Growth Command Deck running at http://localhost:${port}`);
});
