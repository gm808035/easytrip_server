import {CarController} from "../controller/CarController";
import {Router} from "express";

const router = Router();

router.get("/", CarController.all);
router.get("/:id", CarController.one)
router.get("/myCars/userCar", CarController.myCars)
router.post("/", CarController.save);
router.delete("/:id", CarController.remove);
router.put("/:id",CarController.edit);
export default router;
