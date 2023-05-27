import express from "express";
const router = express.Router();
import {
  createWheel,
  getWheels,
  updateWheel,
  wheelToDB,
} from "../controllers/wheels.js";

router.post("/create-wheel", createWheel);
router.post("/get-wheels", getWheels);
router.post("/update-wheel", updateWheel);
router.post("/addwheels", wheelToDB);
export default router;
