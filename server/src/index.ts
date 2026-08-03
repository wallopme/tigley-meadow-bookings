import fs from "fs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import { adminRouter, publicRouter } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? "3001", 10);

const productionUrl =
  process.env.RENDER_EXTERNAL_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : undefined);

const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ?? productionUrl ?? "http://localhost:5174";

initDb();

const app = express();

const corsOrigins = [
  CLIENT_ORIGIN,
  productionUrl,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", publicRouter);
app.use("/api/admin", adminRouter);

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Tigley Meadow API running on http://localhost:${PORT}`);
});
