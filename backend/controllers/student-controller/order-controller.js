import paypal from "../../helpers/paypal";
import { prisma } from "../../prisma/index.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment!",
        });
      }

      // Persist order in database
      const newlyCreatedCourseOrder = await prisma.order.create({
        data: {
          userId: Number(userId),
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate: new Date(orderDate),
          paymentId,
          payerId,
          instructorId: Number(instructorId),
          instructorName,
          courseImage,
          courseTitle,
          courseId: Number(courseId),
          coursePricing: Number(coursePricing),
        },
      });

      const approveUrl = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(201).json({
        success: true,
        data: {
          approveUrl,
          orderId: newlyCreatedCourseOrder.id,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // Retrieve existing order
    let order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Update order status
    order = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paymentId,
        payerId,
      },
    });

    // Update or create student courses entry
    const studentCourses = await prisma.studentCourses.findUnique({
      where: { userId: order.userId },
    });

    const newCourseEntry = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };

    if (studentCourses) {
      const updatedCourses = Array.isArray(studentCourses.courses)
        ? [...studentCourses.courses, newCourseEntry]
        : [newCourseEntry];

      await prisma.studentCourses.update({
        where: { userId: order.userId },
        data: { courses: { set: updatedCourses } },
      });
    } else {
      await prisma.studentCourses.create({
        data: {
          userId: order.userId,
          courses: { set: [newCourseEntry] },
        },
      });
    }

    // Update course's students list
    const courseRecord = await prisma.course.findUnique({
      where: { id: order.courseId },
    });

    const newStudentEntry = {
      studentId: order.userId,
      studentName: order.userName,
      studentEmail: order.userEmail,
      paidAmount: order.coursePricing,
    };

    const updatedStudents = Array.isArray(courseRecord?.students)
      ? [...courseRecord.students, newStudentEntry]
      : [newStudentEntry];

    await prisma.course.update({
      where: { id: order.courseId },
      data: { students: { set: updatedStudents } },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { createOrder, capturePaymentAndFinalizeOrder };
