import {UserController} from "../controller/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { Router } from "express";

const router = Router();

router.get("/", UserController.all);
router.get("/:id", UserController.one);
router.post("/", UserController.save);
router.delete("/:id", UserController.remove);
router.put("/:id", UserController.edit);

export default router;
