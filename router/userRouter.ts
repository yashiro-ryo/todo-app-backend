import { Router, Response, Request } from "express";
import database from "../service/database";

const router = Router();

router.get("/user", (req: Request, res: Response) => {
  console.log('get user');
  const token = Array.isArray(req.headers.token)
    ? req.headers.token[0]
    : req.headers.token;

  if (token == undefined || token.length == 0) {
    console.log("token is null or token.length == 0");
    return;
  }
  database.getUserInfo(token).then((result) => {
    res.status(200).send(result);
  });
});

export default router;
