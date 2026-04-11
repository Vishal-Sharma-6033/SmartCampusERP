// import express from "express";
// import cors from "cors";
// import routes from "./routes/index.js";
// import errorHandler from "./middlewares/error.middleware.js";
// import morganMiddleware from "./middlewares/logger.middleware.js";
// // import tenantMiddleware from "./middlewares/tenant.middleware.js";

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morganMiddleware);



// // Routes
// app.use("/api/v1", routes);

// // testing route only
// app.get("/", (req, res) => {
//   res.send(" Smart Campus ERP Running...");
// });

// app.use(errorHandler);


// export default app;





import express from "express";
import cors from "cors";

import { xssSanitizer } from "./security/xssSanitizer.js";
import { helmetConfig } from "./security/helmet.js";
import { globalLimiter } from "./security/rateLimiter.js";
import { sanitizeMiddleware } from "./security/sanitize.js";
import { apiShield } from "./security/apiShield.js";

import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import morganMiddleware from "./middlewares/logger.middleware.js";

const app = express();

//  SECURITY FIRST
app.use(helmetConfig);
app.use(globalLimiter);

//  Core Middlewares
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(morganMiddleware);

//  SAFE SECURITY (IMPORTANT ORDER)
app.use(apiShield);   
app.use(xssSanitizer);  

//  Routes
app.use("/api/v1", routes);

//  Test route
app.get("/", (req, res) => {
  res.send("🚀 Smart Campus ERP Running...");
});

app.use(errorHandler);

export default app;