import { httpCodes } from "../../constants.js";
import { prisma } from "../../prisma/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
("");
const addNewCourse = async (req, res) => {
  try {
    console.log(
      "handling request in instructor-controller/course-controller on addNewCourse controller"
    );
    const courseData = req.body;
    console.log("recieved data");

    const saveCourse = await prisma.course.create({ data: courseData });
    if (saveCourse) {
      console.log("course saved successfully sending response");
      res
        .status(httpCodes.created)
        .json(
          new ApiResponse(
            httpCodes.created,
            saveCourse,
            " course created successfully"
          )
        );
    } else {
      console.log("there was error in saving course");
      return res
        .status(httpCodes.badGateway)
        .json(
          new ApiResponse(httpCodes.badGateway, {}, "cannot save new course")
        );
    }
  } catch (error) {
    console.log(error);
    return res.status(httpCodes.serverSideError, {}, error.message);
    // throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

const getAllCourses = async (req, res) => {
  try {

    console.log(
      "handling request in instructor-controller/course-controller on getAllCourses controller"
    );
    const courseList = await prisma.course.findMany({
      include: { curriculum: true, students: true },
    });
    console.log("succesfully fetched courses sending reponse");
    res
      .status(httpCodes.ok)
      .json(
        new ApiResponse(
          httpCodes.ok,
          courseList,
          " course fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

const getCourseDetails = async (req, res) => {
  try {
    console.log(
      "handling request in instructor-controller/course-controller on getCourseDetai controller"
    );
    let { id } = req.params;
    id = parseInt(id);
    console.log("recieved data : ", req.params);
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: { students: true, curriculum: true },
    });

    if (course) {
      console.log("course fetched successfully");
      res
        .status(httpCodes.ok)
        .json(
          new ApiResponse(
            httpCodes.ok,
            course,
            "course details fetched successfully"
          )
        );
    } else {
      console.log("course not found");
      res
        .status(httpCodes.notFound)
        .json(
          new ApiResponse(
            httpCodes.notFound,
            {},
            "course with this id doesnot exist"
          )
        );
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

const updateCourseById = async (req, res) => {
  try {
    console.log(
      "handling request in instructor-controller/course-controller on updateCourseById controller"
    );
    let { id } = req.params;
    id = parseInt(id);
    const courseDetails = req.body;
    console.log("recieved id : ", req.params);
    // console.log(req.body);
    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: courseDetails,
      include: { students: true, curriculum: true },
    });
    console.log(updatedCourse);
    if (!updatedCourse) {
      console.log("course not found");
      return res
        .status(httpCodes.notFound)
        .json(new ApiResponse(httpCodes.notFound, {}, "course didnot exiits"));
    }
    console.log("course updated successfully sending response");

    res
      .status(httpCodes.ok)
      .json(new ApiResponse(httpCodes.ok, updatedCourse, "updated"));
  } catch (error) {
    console.log(error);
    return res
      .status(httpCodes.serverSideError)
      .json(new ApiResponse(httpCodes.serverSideError, {}, error.message));
    throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

export { addNewCourse, getAllCourses, getCourseDetails, updateCourseById };
