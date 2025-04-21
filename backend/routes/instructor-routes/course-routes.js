import { Router } from "express";
import {addNewCourse,getAllCourses,getCourseDetails,updateCourseById} from "../../controllers/instructor-controller/course-controller.js"

const instructorCourseRoutes = Router();
router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

export { instructorCourseRoutes };