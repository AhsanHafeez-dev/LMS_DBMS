import { httpCodes } from "../../constants.js";
import { prisma } from "../../prisma/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { sendVerificationEmail } from "../../utils/email.js";
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
      
    });
    for (let i = 0; i < courseList.length; i++){
      
      courseList[i].students = await prisma.courseStudent.findMany({ where: { courseId: courseList[i].id } });
      
    }

    
    // console.log(courseList)
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
    
    const updateEmailHtml = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Course Update Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, sans-serif;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 20px;
    }
    .header {
      background-color: #2a9df4;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content h2 {
      color: #2a9df4;
    }
    .footer {
      background-color: #eeeeee;
      color: #666666;
      text-align: center;
      padding: 10px;
      font-size: 12px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 10px !important;
      }
      .header, .content, .footer {
        padding: 10px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Course Update</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>We would like to inform you about an important update to your course: <strong>${courseName}</strong>.</p>
      <p>Your instructor, <strong>${instructorName}</strong>, has made some changes to the course content/schedule. Please log in to your student portal to review the updates and ensure you're prepared for the upcoming sessions.</p>
      <p>If you have any questions or need further assistance, feel free to reach out to your instructor or the support team.</p>
      <p>Best regards,<br>The Academic Team</p>
    </div>
    <div class="footer">
      &copy; 2025 Your Institution Name. All rights reserved.
    </div>
  </div>
</body>
</html>

    `;
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
    // updatedCourse.students.map(async (std) => { sendVerificationEmail(std.studentEmail, std.studentName, "Course Update", updateEmailHtml); });
    // console.log("course updated successfully sending response");

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
