import { prisma } from "../../prisma/index.js";

//
// 1. Mark one lecture as viewed (and—if it’s the last one—mark the course complete)
//
export const markCurrentLectureAsViewed = async (req, res) => {
  console.log(req.body);
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
      progress = await prisma.courseProgress.create({
        data: { userId, courseId, completed: false },
      });
    }

    // 1b) Upsert the single LectureProgress
    const existingLP = await prisma.lectureProgress.findFirst({
      where: {
        courseProgressId: progress.id,
        lectureId: Number(lectureId),
      },
    });
    if (existingLP) {
      await prisma.lectureProgress.update({
        where: { id: existingLP.id },
        data: { viewed: true, dateViewed: now },
      });
    } else {
      await prisma.lectureProgress.create({
        data: {
          courseProgressId: progress.id,
          lectureId: Number(lectureId),
          viewed: true,
          dateViewed: now,
        },
      });
    }

    // 1c) Re-fetch progress + all its lectureProgress rows
    progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId },
      include: { lectureProgress: true },
      
    });

    // 1d) Check if we’ve now viewed every lecture in the course
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: { curriculum: true },
    });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const totalLectures = course.curriculum.length;
    const viewedCount = progress.lectureProgress.filter(
      (lp) => lp.viewed
    ).length;

    if (viewedCount === totalLectures) {
      progress = await prisma.courseProgress.update({
        where: {  userId, courseId  },
        data: { completed: true, completionDate: now },
      });
    }

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
  const { userId: rawUserId, courseId: rawCourseId } = req.params;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {
    // 2a) Check purchase via the StudentCourse join table
    const purchase = await prisma.studentCourse.findFirst({
      where: { userId, courseId },
    });
    if (!purchase) {
      return res.status(200).json({
        success: true,
        message: "You need to purchase this course to access it.",
        data: { isPurchased: false },
      });
    }

    // 2b) Load or initialize progress
    let progress = await prisma.courseProgress.findFirst({
      where: {  userId, courseId } ,
      include: { lectureProgress: true },
    });

    // 2c) If no progress yet, return empty
    if (!progress || progress.lectureProgress.length === 0) {
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
      });
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }
      return res.status(200).json({
        success: true,
        message: "No progress found; you can start watching.",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    // 2d) Otherwise, return existing progress
    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(courseId) },
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
  const { userId: rawUserId, courseId: rawCourseId } = req.body;
  const userId = rawUserId.toString();
  const courseId = rawCourseId.toString();

  try {
    // 1) Locate the single CourseProgress record
    const progress = await prisma.courseProgress.findFirst({
      where: { userId, courseId },
    });
    if (!progress) {
      return res
        .status(404)
        .json({ success: false, message: "Progress not found!" });
    }

    // 2) Use update by its unique `id`, and nest-delete its LectureProgress children
    const updated = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        lectureProgress: { deleteMany: {} }, // wipe out all lectureProgress rows
        completed: false,
        completionDate: null,
      },
      include: { lectureProgress: true },
    });

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
