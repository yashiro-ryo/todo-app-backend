import { Router, Response, Request } from "express";
import database from '../service/database'

const router = Router();

// signin
router.post("/signin", (req: Request, res: Response) => {
  console.log("called post signin");
  database.signin(req.body.userEmail, req.body.userPass).then((result) => {
    console.log(result);
    res.status(200).send(result);
  });
});

// signup
router.post("/signup", (req: Request, res: Response) => {
  console.log("called signup");
  database
    .signup(req.body.userName, req.body.userEmail, req.body.userPassHashed)
    .then((result) => {
      res.send({ status: result });
    })
    .catch(() => {});
});

export default router;
