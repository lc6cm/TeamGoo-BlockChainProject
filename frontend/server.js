const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const filePath = path.resolve(PUBLIC_DIR, "." + decodeURIComponent(pathname === "/" ? "/index.html" : pathname));

  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      return res.end("File unavailable");
    }

    const ext = path.extname(filePath);
    const types = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".png": "image/png"
    };

    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
