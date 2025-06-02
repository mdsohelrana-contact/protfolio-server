import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to my own server",
  });
});

app.use("/api/v1", router);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
