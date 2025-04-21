import express from "express";
import  {
  getCoursesByStudentId,
} from "../../controllers/student-controller/student-courses-controller";

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);

module.exports = router;
