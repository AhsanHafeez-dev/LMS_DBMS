// "use client"

// import VideoPlayer from "@/components/shared/VideoPlayer";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Skeleton } from '@/components/ui/skeleton';
// import { useAuthContext } from '@/context/auth-context';
// import { useStudentContext } from '@/context/student-context';
// import {
//   checkCoursePurchaseInfoService,
//   createPaymentService,
//   fetchStudentViewCourseDetailsService,
// } from "@/services";
// import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
// import { useParams, usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// function page() {
//   const {id} = useParams();
//   const router = useRouter();
//   const pathname = usePathname();
   
//    const {
//      studentViewCourseDetails,
//     setStudentViewCourseDetails,
//     currentCourseDetailsId,
//     setCurrentCourseDetailsId,
//     loadingState,
//    setLoadingState,
//     } = useStudentContext()

//   const { auth } = useAuthContext();
//   const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
// const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
//  const [approvalUrl, setApprovalUrl] = useState("");
  
// async function fetchStudentViewCourseDetails() {
//   const checkCoursePurchaseInfoResponse =
//     await checkCoursePurchaseInfoService(
//       currentCourseDetailsId,
//       auth?.user.id
//     );

//   if (
//     checkCoursePurchaseInfoResponse?.success &&
//     checkCoursePurchaseInfoResponse?.data
//   ) {
//     router.push(`student/course-progress/${currentCourseDetailsId}`);
//     return;
//   }

//   const response = await fetchStudentViewCourseDetailsService(
//     currentCourseDetailsId
//   );

//   if (response?.success) {
//     setStudentViewCourseDetails(response?.data);
//     setLoadingState(false);
//   } else {
//     setStudentViewCourseDetails(null);
//     setLoadingState(false);
//   }
// }

// function handleSetFreePreview(getCurrentVideoInfo) {
//   console.log(getCurrentVideoInfo);
//   setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
// }

// async function handleCreatePayment() {
//   const paymentPayload = {
//     userId: auth?.user?.id,
//     userName: auth?.user?.userName,
//     userEmail: auth?.user?.userEmail,
//     orderStatus: "pending",
//     paymentMethod: "paypal",
//     paymentStatus: "initiated",
//     orderDate: new Date(),
//     paymentId: "",
//     payerId: "",
//     instructorId: studentViewCourseDetails?.instructorId,
//     instructorName: studentViewCourseDetails?.instructorName,
//     courseImage: studentViewCourseDetails?.image,
//     courseTitle: studentViewCourseDetails?.title,
//     courseId: studentViewCourseDetails?.id,
//     coursePricing: studentViewCourseDetails?.pricing,
//   };

//   const response = await createPaymentService(paymentPayload);

//   if (response.success) {
//     sessionStorage.setItem(
//       "currentOrderId",
//       JSON.stringify(response?.data?.orderId)
//     );
//     setApprovalUrl(response?.data?.approveUrl);
//   }
// }

// useEffect(() => {
//   if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
// }, [displayCurrentVideoFreePreview]);

// useEffect(() => {
//   if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
// }, [currentCourseDetailsId]);

// useEffect(() => {
//   if (id) setCurrentCourseDetailsId(id);
// }, [id]);

// useEffect(() => {
//   if (!pathname.includes('courses/details')) {
//     setStudentViewCourseDetails(null);
//     setCurrentCourseDetailsId(null);
//     setCoursePurchseId(null);
//   }
// }, [pathname]);

// useEffect(() => {
//   if (approvalUrl) {
//     router.push(approvalUrl);
//   }
// }, [approvalUrl, router]);

// const getIndexOfFreePreviewUrl =
//   studentViewCourseDetails !== null
//     ? studentViewCourseDetails?.curriculum?.findIndex(
//         (item) => item.freePreview
//       )
//     : -1;

// if (loadingState) return <Skeleton />;


//   return (
//    <>
//    <Wrapper className="px-4 py-8">
//   <div className="bg-[#122449] text-white p-8 rounded-t-lg">
//     <h1 className="text-3xl font-bold mb-4">
//       {studentViewCourseDetails?.title}
//     </h1>
//     <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
//     <div className="flex items-center space-x-4 mt-2 text-sm">
//       <span>Created By {studentViewCourseDetails?.instructorName}</span>
//       <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
//       <span className="flex items-center">
//         <Globe className="mr-1 h-4 w-4" />
//         {studentViewCourseDetails?.primaryLanguage}
//       </span>
//       <span>
//         {studentViewCourseDetails?.students.length}{" "}
//         {studentViewCourseDetails?.students.length <= 1
//           ? "Student"
//           : "Students"}
//       </span>
//     </div>
//   </div>
//   <div className="flex flex-col md:flex-row gap-8 mt-8">
//     <main className="flex-grow">
//       <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//         <CardHeader>
//           <CardTitle className="font-bold text-xl">What you'll learn</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {studentViewCourseDetails?.objectives
//               .split(",")
//               .map((objective, index) => (
//                 <li key={index} className="flex items-start">
//                   <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
//                   <span>{objective}</span>
//                 </li>
//               ))}
//           </ul>
//         </CardContent>
//       </Card>
//       <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//         <CardHeader>
//           <CardTitle className="font-bold text-xl">Course Description</CardTitle>
//         </CardHeader>
//         <CardContent>{studentViewCourseDetails?.description}</CardContent>
//       </Card>
//       <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//         <CardHeader>
//           <CardTitle className="font-bold text-2xl">Course Curriculum</CardTitle>
//         </CardHeader>
//         <CardContent className="text-[16px]">
//           {studentViewCourseDetails?.curriculum?.map(
//             (curriculumItem, index) => (
//               <li
//                 key={index}
//                 className={`${
//                   curriculumItem?.freePreview
//                     ? "cursor-pointer"
//                     : "cursor-not-allowed"
//                 } flex items-center mb-4`}
//                 onClick={
//                   curriculumItem?.freePreview
//                     ? () => handleSetFreePreview(curriculumItem)
//                     : null
//                 }
//               >
//                 {curriculumItem?.freePreview ? (
//                   <PlayCircle className="mr-2 h-4 w-4" />
//                 ) : (
//                   <Lock className="mr-2 h-4 w-4" />
//                 )}
//                 <span>{curriculumItem?.title}</span>
//               </li>
//             )
//           )}
//         </CardContent>
//       </Card>
//     </main>
//     <aside className="w-full md:w-[500px]">
//       <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
//         <CardContent className="p-6">
//           <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-[#0d1f43]">
//             <VideoPlayer
//               url={
//                 getIndexOfFreePreviewUrl !== -1
//                   ? studentViewCourseDetails?.curriculum[
//                       getIndexOfFreePreviewUrl
//                     ].videoUrl
//                   : ""
//               }
//               width="450px"
//               height="200px"
//             />
//           </div>
//           <div className="mb-4">
//             <span className="text-3xl font-bold">
//               ${studentViewCourseDetails?.pricing}
//             </span>
//           </div>
//           <Button onClick={handleCreatePayment} className="w-full">
//             Buy Now
//           </Button>
//         </CardContent>
//       </Card>
//     </aside>
//   </div>
//   <Dialog
//     open={showFreePreviewDialog}
//     onOpenChange={() => {
//       setShowFreePreviewDialog(false);
//       setDisplayCurrentVideoFreePreview(null);
//     }}
//   >
//     <DialogContent className="w-[800px] bg-[#1a305b] text-white border-gray-500">
//       <DialogHeader>
//         <DialogTitle>Course Preview</DialogTitle>
//       </DialogHeader>
//       <div className="aspect-video rounded-lg flex items-center justify-center bg-[#0d1f43]">
//         <VideoPlayer
//           url={displayCurrentVideoFreePreview}
//           width="450px"
//           height="200px"
//         />
//       </div>
//       <div className="flex flex-col gap-2">
//         {studentViewCourseDetails?.curriculum
//           ?.filter((item) => item.freePreview)
//           .map((filteredItem) => (
//             <p
//               key={filteredItem.id}
//               onClick={() => handleSetFreePreview(filteredItem)}
//               className="cursor-pointer text-[16px] font-medium"
//             >
//               {filteredItem?.title}
//             </p>
//           ))}
//       </div>
//       <DialogFooter className="sm:justify-start">
//         <DialogClose asChild>
//           <Button type="button" variant="secondary">
//             Close
//           </Button>
//         </DialogClose>
//       </DialogFooter>
//     </DialogContent>
//   </Dialog>
// </Wrapper>
//   </>
//   )
// }

// export default page






"use client"

// import VideoPlayer from "@/components/shared/VideoPlayer";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Skeleton } from '@/components/ui/skeleton';
// import { useAuthContext } from '@/context/auth-context';
// import { useStudentContext } from '@/context/student-context';
// import {
//   checkCoursePurchaseInfoService,
//   createPaymentService,
//   fetchStudentViewCourseDetailsService,
// } from "@/services";
// import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
// import { useParams, usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { idText } from "typescript";

// export default function page() {
//   const {id} = useParams();
//   const router = useRouter();
//   const pathname = usePathname();
   
//    const {
//      studentViewCourseDetails,
//     setStudentViewCourseDetails,
//     currentCourseDetailsId,
//     setCurrentCourseDetailsId,
//     loadingState,
//     setLoadingState,
//     setCoursePurchseId,
//     } = useStudentContext()

//   const { auth } = useAuthContext();
//   const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
//   const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
//   const [approvalUrl, setApprovalUrl] = useState("");
  
//   useEffect(() => {
//     if (id){
//       setCurrentCourseDetailsId(idText);
//     }
//   }, [id]);



// // original fuction
//   // async function fetchStudentViewCourseDetails() {
//   //   if (!auth?.id) {
//   //     console.error("User ID is not available");
//   //     setLoadingState(false);
//   //     return;
//   //   }

//   //   const checkCoursePurchaseInfoResponse =
//   //     await checkCoursePurchaseInfoService(
//   //       currentCourseDetailsId,
//   //       auth.id
//   //     );

//   //   if (
//   //     checkCoursePurchaseInfoResponse?.success &&
//   //     checkCoursePurchaseInfoResponse?.data
//   //   ) {
//   //     router.push(`student/course-progress/${currentCourseDetailsId}`);
//   //     return;
//   //   }

//   //   const response = await fetchStudentViewCourseDetailsService(
//   //     currentCourseDetailsId
//   //   );

//   //   if (response?.success) {
//   //     setStudentViewCourseDetails(response?.data);
//   //     setLoadingState(false);
//   //   } else {
//   //     setStudentViewCourseDetails(null);
//   //     setLoadingState(false);
//   //   }
//   // }

//   // from claude
//   // async function fetchStudentViewCourseDetails() {
//   //   try {
     
//   //     const studentId = auth?.id;
      
//   //     if (!studentId) {
//   //       console.error("User ID is not available");
//   //       setLoadingState(false);
//   //       return;
//   //     }

//   //     const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(
//   //       currentCourseDetailsId,
//   //       studentId
//   //     );

//   //     console.log("Purchase check response:", checkCoursePurchaseInfoResponse);

//   //     if (
//   //       checkCoursePurchaseInfoResponse?.success &&
//   //       checkCoursePurchaseInfoResponse?.data
//   //     ) {
//   //       router.push(`/student/course-progress/${currentCourseDetailsId}`);
//   //       return;
//   //     }

//   //     const response = await fetchStudentViewCourseDetailsService(
//   //       currentCourseDetailsId
//   //     );

//   //     if (response?.success) {
//   //       setStudentViewCourseDetails(response?.data);
//   //     } else {
//   //       console.error("Failed to fetch course details:", response?.message);
//   //       setStudentViewCourseDetails(null);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error in fetchStudentViewCourseDetails:", error);
//   //     setStudentViewCourseDetails(null);
//   //   } finally {
//   //     setLoadingState(false);
//   //   }
//   // }

//   async function fetchStudentViewCourseDetails() {
//    try{
//     const response = await fetchStudentViewCourseDetailsService(Number(currentCourseDetailsId));
//       if (response?.success) {
//         setStudentViewCourseDetails(response?.data);
//       } else {
//         console.error("Failed to fetch course details:", response?.message);
//         setStudentViewCourseDetails(null);
//       }
//     } catch (error) {
//       console.error("Error in fetchStudentViewCourseDetails:", error);
//       setStudentViewCourseDetails(null);
//     } finally {
//       setLoadingState(false);
//     }
//   }
// useEffect(() => {
//  console.log("course details id: ",currentCourseDetailsId);
//   },[currentCourseDetailsId])

  

//   function handleSetFreePreview(getCurrentVideoInfo) {
//     console.log(getCurrentVideoInfo);
//     setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
//   }

//   async function handleCreatePayment() {
//     const paymentPayload = {
//       userId: auth?.user?.id,
//       userName: auth?.user?.userName,
//       userEmail: auth?.user?.userEmail,
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "initiated",
//       orderDate: new Date(),
//       paymentId: "",
//       payerId: "",
//       instructorId: studentViewCourseDetails?.instructorId,
//       instructorName: studentViewCourseDetails?.instructorName,
//       courseImage: studentViewCourseDetails?.image,
//       courseTitle: studentViewCourseDetails?.title,
//       courseId: studentViewCourseDetails?.id,
//       coursePricing: studentViewCourseDetails?.pricing,
//     };

//     const response = await createPaymentService(paymentPayload);

//     if (response.success) {
//       sessionStorage.setItem(
//         "currentOrderId",
//         JSON.stringify(response?.data?.orderId)
//       );
//       setApprovalUrl(response?.data?.approveUrl);
//     }
//   }

//   useEffect(() => {
//     if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
//   }, [displayCurrentVideoFreePreview]);

//   useEffect(() => {
//     if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
//   }, [currentCourseDetailsId]);


//   // useEffect(() => {
//   //   if (!pathname.includes('courses/details')) {
//   //     setStudentViewCourseDetails(null);
//   //     setCurrentCourseDetailsId(null);
//   //     setCoursePurchseId(null);
//   //   }
//   // }, [pathname]);

//   useEffect(() => {
//     if (approvalUrl) {
//       router.push(approvalUrl);
//     }
//   }, [approvalUrl, router]);

//   const getIndexOfFreePreviewUrl =
//     studentViewCourseDetails !== null
//       ? studentViewCourseDetails?.curriculum?.findIndex(
//           (item) => item.freePreview
//         )
//       : -1;



//   return (
//     <>
//       <Wrapper className="px-4 py-8">
//         <div className="bg-[#122449] text-white p-8 rounded-t-lg">
//           <h1 className="text-3xl font-bold mb-4">
//             {studentViewCourseDetails?.title}
//           </h1>
//           <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
//           <div className="flex items-center space-x-4 mt-2 text-sm">
//             <span>Created By {studentViewCourseDetails?.instructorName}</span>
//             <span>Created On {studentViewCourseDetails?.date?.split("T")[0]}</span>
//             <span className="flex items-center">
//               <Globe className="mr-1 h-4 w-4" />
//               {studentViewCourseDetails?.primaryLanguage}
//             </span>
//             <span>
//               {studentViewCourseDetails?.students?.length || 0}{" "}
//               {studentViewCourseDetails?.students?.length <= 1
//                 ? "Student"
//                 : "Students"}
//             </span>
//           </div>
//         </div>
//         <div className="flex flex-col md:flex-row gap-8 mt-8">
//           <main className="flex-grow">
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-xl">What you'll learn</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   {studentViewCourseDetails?.objectives
//                     ?.split(",")
//                     .map((objective, index) => (
//                       <li key={`objective-${index}`} className="flex items-start">
//                         <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
//                         <span>{objective}</span>
//                       </li>
//                     ))}
//                 </ul>
//               </CardContent>
//             </Card>
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-xl">Course Description</CardTitle>
//               </CardHeader>
//               <CardContent>{studentViewCourseDetails?.description}</CardContent>
//             </Card>
//             <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
//               <CardHeader>
//                 <CardTitle className="font-bold text-2xl">Course Curriculum</CardTitle>
//               </CardHeader>
//               <CardContent className="text-[16px]">
//                 <ul>
//                   {studentViewCourseDetails?.curriculum?.map(
//                     (curriculumItem, index) => (
//                       <li
//                         key={`curriculum-${curriculumItem?.id || index}`}
//                         className={`${
//                           curriculumItem?.freePreview
//                             ? "cursor-pointer"
//                             : "cursor-not-allowed"
//                         } flex items-center mb-4`}
//                         onClick={
//                           curriculumItem?.freePreview
//                             ? () => handleSetFreePreview(curriculumItem)
//                             : null
//                         }
//                       >
//                         {curriculumItem?.freePreview ? (
//                           <PlayCircle className="mr-2 h-4 w-4" />
//                         ) : (
//                           <Lock className="mr-2 h-4 w-4" />
//                         )}
//                         <span>{curriculumItem?.title}</span>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>
//           </main>
//           <aside className="w-full md:w-[500px]">
//             <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
//               <CardContent className="p-6">
//                 <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-[#0d1f43]">
//                   <VideoPlayer
//                     url={
//                       getIndexOfFreePreviewUrl !== -1
//                         ? studentViewCourseDetails?.curriculum[
//                             getIndexOfFreePreviewUrl
//                           ].videoUrl
//                         : ""
//                     }
//                     width="450px"
//                     height="200px"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <span className="text-3xl font-bold">
//                     ${studentViewCourseDetails?.pricing}
//                   </span>
//                 </div>
//                 <Button  className="w-full">
//                   Buy Now
//                 </Button>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>
//         <Dialog
//           open={showFreePreviewDialog}
//           onOpenChange={() => {
//             setShowFreePreviewDialog(false);
//             setDisplayCurrentVideoFreePreview(null);
//           }}
//         >
//           <DialogContent className="w-[800px] bg-[#1a305b] text-white border-gray-500">
//             <DialogHeader>
//               <DialogTitle>Course Preview</DialogTitle>
//             </DialogHeader>
//             <div className="aspect-video rounded-lg flex items-center justify-center bg-[#0d1f43]">
//               <VideoPlayer
//                 url={displayCurrentVideoFreePreview}
//                 width="450px"
//                 height="200px"
//               />
//             </div>
//             <div className="flex flex-col gap-2">
//               {studentViewCourseDetails?.curriculum
//                 ?.filter((item) => item.freePreview)
//                 .map((filteredItem) => (
//                   <p
//                     key={`preview-${filteredItem.id || Math.random().toString(36).substr(2, 9)}`}
//                     onClick={() => handleSetFreePreview(filteredItem)}
//                     className="cursor-pointer text-[16px] font-medium"
//                   >
//                     {filteredItem?.title}
//                   </p>
//                 ))}
//             </div>
//             <DialogFooter className="sm:justify-start">
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   Close
//                 </Button>
//               </DialogClose>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </Wrapper>
//     </>
//   )
// }



"use client"

import VideoPlayer from "@/components/shared/VideoPlayer";
import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/auth-context';
import { useStudentContext } from '@/context/student-context';
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
   
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    setCoursePurchseId,
  } = useStudentContext();

  const { auth } = useAuthContext();
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  
  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(Number(id));
    }
  }, [id, setCurrentCourseDetailsId]);

  useEffect(() => {
    if (id) {
      console.log(typeof(currentCourseDetailsId),"ID");;
    }
  }, [id]);

  async function fetchStudentViewCourseDetails() {
    try {
      const courseId = Number(currentCourseDetailsId);
      

      if (isNaN(courseId) || courseId <= 0) {
        console.error("Invalid course ID:", currentCourseDetailsId);
        setStudentViewCourseDetails(null);
        setLoadingState(false);
        return;
      }
      
      const response = await fetchStudentViewCourseDetailsService(courseId);
      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        console.error("Failed to fetch course details:", response?.message);
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.error("Error in fetchStudentViewCourseDetails:", error);
      setStudentViewCourseDetails(null);
    } finally {
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?.id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?.id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (!pathname.includes('courses/details')) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
      setCoursePurchseId(null);
    }
  }, [pathname, setStudentViewCourseDetails, setCurrentCourseDetailsId, setCoursePurchseId]);

  useEffect(() => {
    if (approvalUrl) {
      router.push(approvalUrl);
    }
  }, [approvalUrl, router]);

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  if (loadingState) return <Skeleton className="w-full h-screen" />;

  return (
    <>
      <Wrapper className="px-4 py-8">
        <div className="bg-[#122449] text-white p-8 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-4">
            {studentViewCourseDetails?.title}
          </h1>
          <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span>Created By {studentViewCourseDetails?.instructorName}</span>
            <span>Created On {studentViewCourseDetails?.date?.split("T")[0]}</span>
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              {studentViewCourseDetails?.primaryLanguage}
            </span>
            <span>
              {studentViewCourseDetails?.students?.length || 0}{" "}
              {(studentViewCourseDetails?.students?.length || 0) <= 1
                ? "Student"
                : "Students"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <main className="flex-grow">
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-xl">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {studentViewCourseDetails?.objectives
                    ?.split(",")
                    .map((objective, index) => (
                      <li key={`objective-${index}`} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{objective.trim()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-xl">Course Description</CardTitle>
              </CardHeader>
              <CardContent>{studentViewCourseDetails?.description}</CardContent>
            </Card>
            <Card className="mb-8 bg-[#1a305b] text-white border-gray-500">
              <CardHeader>
                <CardTitle className="font-bold text-2xl">Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="text-[16px]">
                <ul>
                  {studentViewCourseDetails?.curriculum?.map(
                    (curriculumItem, index) => (
                      <li
                        key={`curriculum-${curriculumItem?.id || index}`}
                        className={`${
                          curriculumItem?.freePreview
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        } flex items-center mb-4`}
                        onClick={
                          curriculumItem?.freePreview
                            ? () => handleSetFreePreview(curriculumItem)
                            : null
                        }
                      >
                        {curriculumItem?.freePreview ? (
                          <PlayCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <Lock className="mr-2 h-4 w-4" />
                        )}
                        <span>{curriculumItem?.title}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </main>
          <aside className="w-full md:w-[500px]">
            <Card className="sticky top-4 bg-[#3a4e76] text-white border-gray-500">
              <CardContent className="p-6">
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-[#0d1f43]">
                  <VideoPlayer
                    url={
                      getIndexOfFreePreviewUrl !== -1
                        ? studentViewCourseDetails?.curriculum[
                            getIndexOfFreePreviewUrl
                          ]?.videoUrl
                        : ""
                    }
                    width="450px"
                    height="200px"
                  />
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    ${studentViewCourseDetails?.pricing}
                  </span>
                </div>
                <Button onClick={handleCreatePayment} className="w-full">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
        <Dialog
          open={showFreePreviewDialog}
          onOpenChange={() => {
            setShowFreePreviewDialog(false);
            setDisplayCurrentVideoFreePreview(null);
          }}
        >
          <DialogContent className="w-[800px] bg-[#1a305b] text-white border-gray-500">
            <DialogHeader>
              <DialogTitle>Course Preview</DialogTitle>
            </DialogHeader>
            <div className="aspect-video rounded-lg flex items-center justify-center bg-[#0d1f43]">
              <VideoPlayer
                url={displayCurrentVideoFreePreview}
                width="450px"
                height="200px"
              />
            </div>
            <div className="flex flex-col gap-2">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, index) => (
                  <p
                    key={`preview-${filteredItem?.id || index}`}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer text-[16px] font-medium"
                  >
                    {filteredItem?.title}
                  </p>
                ))}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Wrapper>
    </>
  );
}
