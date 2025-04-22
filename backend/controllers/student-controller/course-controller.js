import { prisma } from "../../prisma/index.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    // Optional: fetch all courses (if you still need this in l)
    const l = await prisma.course.findMany();

    const {
      category = "",
      level = "",
      primaryLanguage = "",
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

    const coursesList = await prisma.course.findMany({
      where: filters,
      orderBy: sortParam,
    });

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

export const getStudentViewCourseDetails = async (req, res) => {
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

export const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const studentCourses = await prisma.studentCourses.findUnique({
      where: { userId: Number(studentId) },
    });

    const ifStudentAlreadyBoughtCurrentCourse = Array.isArray(
      studentCourses?.courses
    )
      ? studentCourses.courses.findIndex(
          (item) => item.courseId === Number(id)
        ) > -1
      : false;

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
