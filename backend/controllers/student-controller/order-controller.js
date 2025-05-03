import {paypal} from "../../utils/paypal.js";
import { prisma } from "../../prisma/index.js";

 const createOrder = async (req, res) => {
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

    // const create_payment_json = {
    //   intent: "sale",
    //   payer: {
    //     payment_method: "paypal",
    //   },
    //   redirect_urls: {
    //     return_url: `${process.env.CLIENT_URL}/payment-return`,
    //     cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    //   },
    //   transactions: [
    //     {
    //       item_list: {
    //         items: [
    //           {
    //             name: courseTitle,
    //             sku: courseId,
    //             price: coursePricing,
    //             currency: "USD",
    //             quantity: 1,
    //           },
    //         ],
    //       },
    //       amount: {
    //         currency: "USD",
    //         total: coursePricing.toFixed(2),
    //       },
    //       description: courseTitle,
    //     },
    //   ],
    // };

    // paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
    //   if (error) {
    //     console.error(error);
    //     return res.status(500).json({
    //       success: false,
    //       message: "Error while creating paypal payment!",
    //     });
    //   }

    //   // Persist order in database
      const newlyCreatedCourseOrder = await prisma.order.create({
        data: {
          userId,
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate: new Date(),
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing:parseFloat(coursePricing),
        },
      });
    

      // const approveUrl = paymentInfo.links.find(
      //   (link) => link.rel === "approval_url"
      // ).href;
const approveUrl=["https://www.google.com"]
      res.status(201).json({
        success: true,
        data: {
          approveUrl,
          orderId: newlyCreatedCourseOrder.id,
        },
      });
    // });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

 const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // Retrieve existing order
    let order = await prisma.order.findFirst({
      where: { id: orderId },
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
    const studentCourses = await prisma.studentCourse.findFirst({
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
      
      console.log(updatedCourses);
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        },
      });

      // await prisma.studentCourse.update({
      //   where: { userId: order.userId },
      //   data: { courses: { set: updatedCourses } },
      // });

    } else {
      await prisma.studentCourse.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          courseImage: order.courseImage,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          title:order.courseTitle
          
          
        },
      });
    }

    // Update course's students list
    const courseRecord = await prisma.course.findUnique({
      where: { id: Number(order.courseId) },
    });

    const newStudentEntry = {
      studentId: order.userId,
      studentName: order.userName,
      studentEmail: order.userEmail,
      paidAmount: order.coursePricing,
      courseId:Number(order.courseId)
    };

    const updatedStudents = Array.isArray(courseRecord?.students)
      ? [...courseRecord.students, newStudentEntry]
      : [newStudentEntry];
    console.log("students");
    
    console.log(updatedStudents);
    
    await prisma.course.update({
      where: { id: Number(order.courseId) }, // ① which Course you’re updating
      data: {
        students: {
          // ② delete all existing CourseStudent records for this course
          deleteMany: {},

          // ③ create a fresh batch of join-rows
          create: updatedStudents.map((student) => ({
            studentId   : student.studentId,
            studentName  :student.studentName,
            studentEmail :student.studentEmail,
            paidAmount   :student.paidAmount,
            

          })),
        },
      },
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
