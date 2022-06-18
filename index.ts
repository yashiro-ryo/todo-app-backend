import express, { Application, Request, Response, Router } from "express";
import database from "./service/database";
import fs from "fs";
import https from "https";
import cors from "cors";
import authRouter from "./router/authRouter";
import restRouter from "./router/restRouter";
import userRouter from "./router/userRouter";

const app: Application = express();
const PORT = process.env.port || 5000;

app.set("port", process.env.port || 5000);

const server = https.createServer(
  {
    key: fs.readFileSync("./key/privatekey.pem"),
    cert: fs.readFileSync("./key/cert.pem"),
  },
  app
);

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", authRouter);
app.use("/", restRouter);
app.use("/", userRouter);

app.get("/signin", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/html/signin.html");
});

app.get("/signup", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/html/signup.html");
});

// rewrite
app.get("/dashboard", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

app.get("/profile", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

app.get("/help", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

app.get("/setting", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

app.get("/signout", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/public/build/index.html");
});

// 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).sendFile(__dirname + "/public/html/signin.html");
});

try {
  server.listen(PORT, () => {
    console.log(`dev server running at: https://0.0.0.0:${PORT}/`);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
