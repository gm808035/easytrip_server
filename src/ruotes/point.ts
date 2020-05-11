import {PointController} from "../controller/PointController";
import { checkJwt } from "../middlewares/checkJwt";
import { Router } from "express";

const router = Router();

router.get("/", PointController.all);
router.get("/:id", PointController.one);
router.post("/", PointController.save);
router.delete("/:id", PointController.remove);
router.put("/:id", PointController.edit);

export default router;
