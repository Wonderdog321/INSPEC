import express from "express";
const router = express.Router();
import {
  createBlade,
  getBlades,
  updateBlade,
  bladeToDB,
} from "../controllers/blades.js";

router.post("/create-blade", createBlade);
router.post("/get-blades", getBlades);
router.post("/update-blade", updateBlade);
router.post("/addblades", bladeToDB);
export default router;
