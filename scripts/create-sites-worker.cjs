const fs = require("fs");
const path = require("path");

const serverDir = path.join(__dirname, "..", "dist", "server");
fs.mkdirSync(serverDir, { recursive: true });

const worker = `
export default {
  async fetch(request, env) {
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    const accept = request.headers.get("accept") || "";
    if (request.method === "GET" && accept.includes("text/html")) {
      const indexUrl = new URL("/index.html", request.url);
      return env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return assetResponse;
  },
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), worker, "utf8");
