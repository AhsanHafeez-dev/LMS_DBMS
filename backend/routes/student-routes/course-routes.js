import express from  "express";
import {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchaseInfo,
} from "../../controllers/student-controller/course-controller";
const router = express.Router();

router.get("/get", getAllStudentViewCourses);
router.get("/get/details/:id", getStudentViewCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

export { router };
