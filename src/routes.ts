import { Router, Request, Response } from "express";
import auth from "./ruotes/auth";
import user from "./ruotes/user";
import car from "./ruotes/car";
import preference from "./ruotes/preference";
import city from "./ruotes/city";
import trip from "./ruotes/trip"
import point from "./ruotes/point"

const router = Router();

router.use("/auth", auth);
router.use("/users", user);
router.use("/cars", car);
router.use("/preferences", preference);
router.use("/cities", city);
router.use("/trips", trip);
router.use("/points", point);


export default router;
