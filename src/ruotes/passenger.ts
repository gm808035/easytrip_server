import {PassengerController} from "../controller/PassengerController"
import { checkJwt } from "../middlewares/checkJwt";
import { Router } from "express";

const router = Router();

router.get("/", PassengerController.all);
router.get("/myPassengers/", PassengerController.myPassenger);
export default router;
