import express from "express";
import isAuthenticated from "../middlewares/isAtuhenticated.js";
import { getAdminJobs, getALLJobs, getJobById, postjob } from "../controllers/jobController.js";
const router = express.Router();

router.route("/post").post(isAuthenticated,postjob);
router.route("/get").get(isAuthenticated,getALLJobs);
router.route("/getaminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);

export default router