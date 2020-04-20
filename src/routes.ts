import { Router, Request, Response } from "express";
import auth from "./ruotes/auth";
import user from "./ruotes/user";
import car from "./ruotes/car";
import preference from "./ruotes/preference";
import city from "./ruotes/city";
const router = Router();

router.use("/auth", auth);
router.use("/users", user);
router.use("/cars", car);
router.use("/preferences", preference);
router.use("/cities", city);

export default router;