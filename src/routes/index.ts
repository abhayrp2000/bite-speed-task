import { Router, Request, Response } from "express";
import { ContactRouter } from "./contacts";

const router = Router();

router.get("/hello", async (req: Request, res: Response) => {
  res.status(200).send("hello, ha bhai zinda hoon!");
});

router.use("/identity", ContactRouter);

export default router;
