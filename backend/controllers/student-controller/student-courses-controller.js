
import {prisma} from "../../prisma/index.js"


const getCoursesByStudentId = async (req, res) => {
  try {
    
    console.log("handling request in student-controller/student-course-controller getCoursesByStudentId controller");
    console.log("recieved data : ", req.params);

    const { studentId } = req.params;
    const studentBoughtCourses = await prisma.studentCourse.findMany({
      where:{userId: studentId}
    });

    console.log("Sending list of student brought courses");

    res.status(200).json({
      success: true,
      data: studentBoughtCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { getCoursesByStudentId };
