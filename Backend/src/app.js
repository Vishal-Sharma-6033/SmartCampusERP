import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import morganMiddleware from "./middlewares/logger.middleware.js";
// import tenantMiddleware from "./middlewares/tenant.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Routes
app.use("/api/v1", routes);

// testing route only
app.get("/", (req, res) => {
  res.send(" Smart Campus ERP Running...");
});

app.use(errorHandler);

export default app;