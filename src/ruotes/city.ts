import {CityController} from "../controller/CityController";
import {Router} from "express";
import routes from "./index";

const router = Router();
router.get("/", CityController.all);
router.get("/:id", CityController.one)
router.post("/", CityController.save);
router.delete("/:id", CityController.remove);
router.put("/:id",CityController.edit);
export default router;