const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const history = require("connect-history-api-fallback");

const app = express();
const PORT = process.env.PORT || 3000;

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(compression());
app.use(cors({ origin: true }));
app.use(history());

app.use(
  express.static("dist/web", {
    maxAge: process.env.CACHE_MAX_AGE || "1d"
  })
);

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));

process.on("unhandledReject", console.warn);
process.on("uncaughtException", console.error);
