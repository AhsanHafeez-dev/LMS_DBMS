import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
const getAllStudentViewCourses = async (req, res) => {
  try {
    console.log("request got")
    // Optional: fetch all courses (if you still need this in l)
    const courseList = await prisma.course.findMany();
    if (courseList.length == 0) { return res.status(httpCodes.notFound).json(new ApiResponse(httpCodes.notFound,{},"no course exist")); }
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log(req.query, "req.query");

    let filters = {};
    if (category.length) {
      filters.category = { in: category.split(",") };
    }
    if (level.length) {
      filters.level = { in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam = { pricing: "asc" };
        break;
      case "price-hightolow":
        sortParam = { pricing: "desc" };
        break;
      case "title-atoz":
        sortParam = { title: "asc" };
        break;
      case "title-ztoa":
        sortParam = { title: "desc" };
        break;
      default:
        sortParam = { pricing: "asc" };
    }
    console.log(filters, "filters");
    console.log(sortParam, "param sort");
    const coursesList = await prisma.course.findMany({
      where: filters,
      orderBy: sortParam,
    });
    for (let i = 0; i < coursesList.length; i++) {
      console.log("got lectures");
      let lectures = await prisma.lecture.findMany({ where: { courseId: coursesList[i].id } });
      // console.log(lectures);
      coursesList[i].lectures = lectures;
    }
    console.log(coursesList)
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    
    const studentCourses = await prisma.studentCourse.findFirst({
      where: { userId: studentId,courseId:id },
    });
    console.log(studentId, " student ",id, "course ");
    console.log(studentCourses);
    const ifStudentAlreadyBoughtCurrentCourse = studentCourses ? true : false;

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
