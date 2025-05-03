
import {prisma} from "../../prisma/index.js"

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await prisma.studentCourse.findMany({
      where:{userId: studentId}
    });

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
