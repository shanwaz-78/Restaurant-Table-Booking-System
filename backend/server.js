import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import bookingRoutes from "./routes/bookingRoute.js";

const port = process.env.PORT || 8080;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(compression());
app.use(limiter);
app.use(express.json());
app.use("/api", bookingRoutes);

const server = createServer(app);
server.listen(port);

server.on("listening", () => {
  console.log(`server is listening on http://localhost:${port}`);
});
server.on("error", () =>
  console.log(`server is not listening on port: ${port}`)
);
