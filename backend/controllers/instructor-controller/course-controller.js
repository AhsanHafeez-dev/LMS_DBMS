import { prisma } from "../../prisma/index.js";
import { httpCodes } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";''
const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const saveCourse = await prisma.course.create({ data: courseData });
        if(saveCourse) res.status(httpCodes.created).json(new ApiResponse(httpCodes.created,saveCourse," course created successfully"))
        else{throw new ApiError(httpCodes.badGateway," cannot save new course")}
    } catch (error) {
        console.log(error)
        throw new ApiError(httpCodes.serverSideError, error.message);
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courseList = await prisma.course.findMany({});
        res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, courseList, " course fetched successfully"));
        
  } catch (error) {
        console.log(error);
      throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const course=await prisma.course.findUnique({
      where: {
        id
      },
    });

    if (course) res.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, course, "course details fetched successfully"));
    else { throw new ApiError(httpCodes.notFound, "invalid course id"); }

  } catch (error) {
    console.log(error);
    throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

const updateCourseById = async (req, res) => {
  try {
    const {id} = req.params;
    const courseDetails  = req.body;
    const updatedCourse=await prisma.course.update({
      where: {
        id
      },
      data:courseDetails
    });

    if(!updatedCourse){throw new ApiError(httpCodes,httpCodes.notFound,"course can't be updated")}
    
    req.status(httpCodes.ok).json(new ApiResponse(httpCodes.ok, updatedCourse, "updated"))
    
  } catch (error) {
    console.log(error);
    throw new ApiError(httpCodes.serverSideError, error.message);
  }
};

export {addNewCourse,getAllCourses,getCourseDetails,updateCourseById}