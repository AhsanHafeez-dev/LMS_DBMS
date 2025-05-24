import { prisma } from "../../prisma/index.js";

//
// 1. Mark one lecture as viewed (and—if it’s the last one—mark the course complete)
//
export const markCurrentLectureAsViewed = async (req, res) => {
      
  console.log("handling request in student-controller/course-progress-controller markCurrentLectureAsViewed controller")
  console.log("data recieved : ", req.body);
  
  const { userId: rawUserId, courseId: rawCourseId, lectureId } = req.body;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();
  const now = new Date();

  try {
    // 1a) Get or create the CourseProgress row
    let progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId } ,
    });
    if (!progress) {
      console.log("lecture is viewed for first time marking as done");
      progress = await prisma.courseProgress.create({
        data: { userId, courseId, completed: false },
      });
    }

    
    const existingLP = await prisma.lectureProgress.findFirst({
      where: {
        courseProgressId: progress.id,
        lectureId: Number(lectureId),
      },
    });
    if (existingLP) {
      
      console.log("updating last viewed time");
      
      await prisma.lectureProgress.update({
        where: { id: existingLP.id },
        data: { viewed: true, dateViewed: now },
      });

    } else {

      console.log("cretaing lecture progress for first time");

      await prisma.lectureProgress.create({
        data: {
          courseProgressId: progress.id,
          lectureId: Number(lectureId),
          viewed: true,
          dateViewed: now,
        },
      });
    }

    
    progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId },
      include: { lectureProgress: true },
      
    });

    console.log("now checking wether course is completed or not");
    // 1d) Check if we’ve now viewed every lecture in the course
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: { curriculum: true },
    });

    if (!course) {
      console.log("course not found");
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const totalLectures = course.curriculum.length;
    const viewedCount = progress.lectureProgress.filter(
      (lp) => lp.viewed
    ).length;

    if (viewedCount === totalLectures) {
      console.log("course progresss is completed");
      progress = await prisma.courseProgress.update({
        where: {  userId, courseId  },
        data: { completed: true, completionDate: now },
      });
    }
    console.log("returning response");
    return res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred" });
  }
};

//
// 2. Fetch current progress (only if the user has purchased the course)
//
export const getCurrentCourseProgress = async (req, res) => {
  
  console.log("handling request in student-controller/course-progress-controller getCurrentCourseProgress controller");
  console.log("recieved data : ", req.params);

  const { userId: rawUserId, courseId: rawCourseId } = req.params;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {
    // 2a) Check purchase via the StudentCourse join table
    const purchase = await prisma.studentCourse.findFirst({
      where: { userId, courseId },
    });
    if (!purchase) {
    
      console.log("course is not being purchased by user");
    
      return res.status(200).json({
        success: true,
        message: "You need to purchase this course to access it.",
        data: { isPurchased: false },
      });
    }
    
    console.log("getting progress in current course");

    // 2b) Load or initialize progress
    let progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId } ,
      include: { lectureProgress: true },
    });

    // 2c) If no progress yet, return empty
    if (!progress || progress.lectureProgress.length === 0) {

      console.log("user doesnot has course progress record for this course");

      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include:{curriculum:true}
      });
      if (!course) {
        console.log("course didnot exist");
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
      return res.status(200).json({
        statusCode: 200,
        stattus:200,
        success: true,
        message: "No progress found; you can start watching.",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    console.log("user has progress record in current course returning it");
    // 2d) Otherwise, return existing progress
    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: { curriculum: true },
    });
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: progress.lectureProgress,
        completed: progress.completed,
        completionDate: progress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred" });
  }
};

//
// 3. Reset all progress for a given (user, course) pair
//
export const resetCurrentCourseProgress = async (req, res) => {

  console.log("handling request in student-controller/course-progress-controller resetCurrentCourseProgress controller");
  console.log("recieved data : ", req.body);

  const { userId: rawUserId, courseId: rawCourseId } = req.body;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {

    console.log("fetching students's progress");

    // 1) Locate the single CourseProgress record
    const progress = await prisma.courseProgress.findFirst({
      where: { userId, courseId },
    });

    if (!progress) {
      console.log("user doesnot have any progress record to reset");
      return res
        .status(404)
        .json({ success: false, message: "Progress not found!" });
    }

    // 2) Use update by its unique `id`, and nest-delete its LectureProgress children
    console.log("deleting all progress");
    const updated = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        lectureProgress: { deleteMany: {} }, // wipe out all lectureProgress rows
        completed: false,
        completionDate: null,
      },
      include: { lectureProgress: true },
    });

    console.log("successfully removed all data");

    return res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred!" });
  }
};
