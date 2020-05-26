import {NotificationController} from "../controller/NotificationController";
import { checkJwt } from "../middlewares/checkJwt";
import { Router } from "express";

const router = Router();

router.get("/", NotificationController.all);
router.get("/:id", NotificationController.one);
router.post("/", NotificationController.save);
router.delete("/:id", NotificationController.remove);

export default router;
