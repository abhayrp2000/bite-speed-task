import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middleware/request-validator";
import { getOrCreateIdentity } from "../service/contact";
import { handleError } from "../utils/custom-error";
import { Format } from "../utils/formatters";
import { logger } from "..";

const router = Router();

router.post(
  "/",
  body("email").if(body("phoneNumber").isEmpty()).exists().isString().trim(),
  body("phoneNumber").if(body("email").isEmpty()).exists().isString().trim(),
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, phoneNumber } = req.body;
      const contacts = await getOrCreateIdentity(email, phoneNumber);

      res.status(200).json(Format.identity(contacts));
    } catch (err: any) {
      console.log(err);
      logger.error(err);
      const { statusCode, code, message } = handleError(err);

      res.status(statusCode).json({
        code,
        message,
      });
    }
  }
);

export { router as ContactRouter };
