import { prisma } from "../../prisma/index.js";

export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    // Find existing progress
    let progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId: Number(userId), courseId: Number(courseId) },
      },
    });

    const now = new Date();
    const lectureEntry = { lectureId, viewed: true, dateViewed: now };

    if (!progress) {
      // Create new progress record
      progress = await prisma.courseProgress.create({
        data: {
          userId: Number(userId),
          courseId: Number(courseId),
          lecturesProgress: {
            set: [lectureEntry],
          },
        },
      });
    } else {
      // Update existing progress
      const lectures = Array.isArray(progress.lecturesProgress)
        ? [...progress.lecturesProgress]
        : [];

      const idx = lectures.findIndex((item) => item.lectureId === lectureId);
      if (idx > -1) {
        lectures[idx] = lectureEntry;
      } else {
        lectures.push(lectureEntry);
      }

      progress = await prisma.courseProgress.update({
        where: {
          userId_courseId: {
            userId: Number(userId),
            courseId: Number(courseId),
          },
        },
        data: { lecturesProgress: { set: lectures } },
      });
    }

    // Fetch course curriculum
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if all lectures viewed
    const curriculum = Array.isArray(course.curriculum)
      ? course.curriculum
      : [];
    const allLecturesViewed =
      progress.lecturesProgress.length === curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress = await prisma.courseProgress.update({
        where: {
          userId_courseId: {
            userId: Number(userId),
            courseId: Number(courseId),
          },
        },
        data: { completed: true, completionDate: now },
      });
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await prisma.studentCourses.findUnique({
      where: { userId: Number(userId) },
    });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      Array.isArray(studentPurchasedCourses?.courses) &&
      studentPurchasedCourses.courses.findIndex(
        (item) => item.courseId === Number(courseId)
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }

    let currentUserCourseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId: Number(userId), courseId: Number(courseId) },
      },
    });

    if (
      !currentUserCourseProgress ||
      !Array.isArray(currentUserCourseProgress.lecturesProgress) ||
      currentUserCourseProgress.lecturesProgress.length === 0
    ) {
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
      });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId: Number(userId), courseId: Number(courseId) },
      },
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    const updated = await prisma.courseProgress.update({
      where: {
        userId_courseId: { userId: Number(userId), courseId: Number(courseId) },
      },
      data: {
        lecturesProgress: { set: [] },
        completed: false,
        completionDate: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
