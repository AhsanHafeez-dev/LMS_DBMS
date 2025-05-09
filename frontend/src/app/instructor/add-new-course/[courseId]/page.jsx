// "use client";

// import CourseCurriculum from "@/components/instructor-view/addNewCourses/CourseCurriculum";
// import CourseLanding from "@/components/instructor-view/addNewCourses/CourseLanding";
// import CourseSettings from "@/components/instructor-view/addNewCourses/CourseSettings";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuthContext } from "@/context/auth-context";
// import { useInstructorContext } from "@/context/instructor-context";
// import { fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
// import { useParams } from "next/navigation";
// import React, { useEffect } from "react";

// export default function AddEditCoursePage() {
//   const params = useParams();
//   const courseId = params?.courseId;

//   useEffect(() => {
//     if (courseId) {
//       setCurrentEditedCourseId(courseId);
//     } else {
//       setCurrentEditedCourseId(null);
//     }
//   }, [courseId]);

//   const {
//     courseLandingFormData,
//     courseCurriculumFormData,
//     setCourseLandingFormData,
//     setCourseCurriculumFormData,
//     currentEditedCourseId,
//     setCurrentEditedCourseId,
//   } = useInstructorContext();

//   const {auth} = useAuthContext()

//   function isEmpty(value) {
//     if (Array.isArray(value)) {
//       return value.length === 0;
//     }

//     return value === "" || value === null || value === undefined;
//   }

//   function validateFormData() {
//     for (const key in courseLandingFormData) {
//       if (isEmpty(courseLandingFormData[key])) {
//         return false;
//       }
//     }
//     let hasFreePreview = false;
//     for (const item of courseCurriculumFormData) {
//       if (
//         isEmpty(item.title) ||
//         isEmpty(item.videoUrl) ||
//         isEmpty(item.public_id)
//       ) {
//         return false;
//       }

//       if (item.freePreview) {
//         hasFreePreview = true;
//       }
//     }
//     return hasFreePreview;
//   }

//   async function handleCreateCourse() {
//     const courseFinalFormData = {
//       instructorId: String(auth.id),
//       instructorName: auth.userName,
//       date: new Date(),
//       ...restOfData,
//       pricing:priceValue,
//       students: {
//         create: []
//       },
//       curriculum: {
//          create: courseCurriculumFormData.map(item => ({
//           title: item.title,
//           videoUrl: item.videoUrl,
//           freePreview: item.freePreview,
//           publicId:item.public_id,
//         })),
//     },
//     isPublished: true,
//   }

//     const response =
//       currentEditedCourseId !== null
//         ? await updateCourseByIdService(
//             currentEditedCourseId,
//             courseFinalFormData
//           ):null

//     if (response?.success) {
//       setCourseLandingFormData(courseLandingInitialFormData);
//       setCourseCurriculumFormData(courseCurriculumInitialFormData);
//       router.back()
//       setCurrentEditedCourseId(null);
//     }
//   }

//   async function fetchCurrentCourseDetails() {
//     if (!currentEditedCourseId) return;

//     const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

//     if (response?.success) {
//       const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
//         acc[key] = response?.data[key] || courseLandingInitialFormData[key];
//         return acc;
//       }, {});

//       setCourseLandingFormData(setCourseFormData);
//       setCourseCurriculumFormData(response?.data?.curriculum);
//     }
//   }

//   useEffect(() => {
//     if (currentEditedCourseId) {
//       fetchCurrentCourseDetails();
//     }
//   }, [currentEditedCourseId]);

// return (
//   <>
//   <Wrapper className="py-5 px-8">
//         <div className="flex justify-between mb-5">
//           <h1 className="text-mainheading text-3xl font-bold">
//             Create new course
//           </h1>
//           <Button
//             size={"default"}
//             variant={"secondary"}
//             className="text-lg font-bold tracking-wide"
//             disabled={!validateFormData()}
//             onClick={handleCreateCourse}
//           >
//             SUBMIT
//           </Button>
//         </div>
//         <Card className="rounded-md bg-[#384B70] border-none">
//           <CardContent>
//             <div className="container mx-auto p-4">
//               <Tabs defaultValue="curriculum" className="space-y-4">
//                 <TabsList className="flex items-center justify-center">
//                   <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
//                   <TabsTrigger value="course-landing-page">
//                     Course Landing Page
//                   </TabsTrigger>
//                   <TabsTrigger value="settings">Settings</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="curriculum">
//                   <CourseCurriculum />
//                 </TabsContent>
//                 <TabsContent value="course-landing-page">
//                   <CourseLanding />
//                 </TabsContent>
//                 <TabsContent value="settings">
//                   <CourseSettings />
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </CardContent>
//         </Card>
//       </Wrapper>
//   </>
// )
// }

"use client";

import { useRouter } from "next/navigation";
import CourseCurriculum from "@/components/instructor-view/addNewCourses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/addNewCourses/CourseLanding";
import CourseSettings from "@/components/instructor-view/addNewCourses/CourseSettings";
import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/auth-context";
import { useInstructorContext } from "@/context/instructor-context";
import {
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AddEditCoursePage() {
  const params = useParams();
  const courseId = params?.courseId;
  const router = useRouter(); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  useEffect(() => {
    if (courseId) {
      setCurrentEditedCourseId(courseId);
    } else {
      setCurrentEditedCourseId(null);
    }
  }, [courseId]);

  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
    courseLandingInitialFormData, 
    courseCurriculumInitialFormData,
  } = useInstructorContext();

  const { auth } = useAuthContext();

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  }

  async function handleCreateCourse() {
    if (isSubmitting) return; 

    try {
      setIsSubmitting(true);

      const { pricing, ...restOfData } = courseLandingFormData;
      const priceValue = parseFloat(pricing) || 0;

      const courseFinalFormData = {
        instructorId: auth?.id,
        instructorName: auth?.userName,
        date: new Date(),
        ...restOfData,
        pricing:priceValue,
        students: {
          create: [] 
        },
        curriculum: {
           create: courseCurriculumFormData.map(item => ({
            title: item?.title,
            videoUrl: item?.videoUrl,
            freePreview: item?.freePreview,
            publicId:item?.public_id,
          })),
      },
      isPublished: true,
    }

      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              courseFinalFormData
            )
          : null;

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        setCurrentEditedCourseId(null);

        router.push("/instructor")
      }
    } catch (error) {
      console.error("Error submitting course:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // async function fetchCurrentCourseDetails() {
  //   if (!currentEditedCourseId) return;

  //   try {
  //     const response = await fetchInstructorCourseDetailsService(
  //       currentEditedCourseId
  //     );

  //     if (response?.success) {
  //       console.log("Instructor course dettail: ",response);
  //       const setCourseFormData = Object.keys(
  //         courseLandingInitialFormData
  //       ).reduce((acc, key) => {
  //         acc[key] = response?.data[key] || courseLandingInitialFormData[key];
  //         return acc;
  //       }, {});

  //       setCourseLandingFormData(setCourseFormData);
  //       setCourseCurriculumFormData(response?.data?.curriculum);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching course details:", error);
  //   }
  // }

  // useEffect(() => {
  //     fetchCurrentCourseDetails();
  // }, [currentEditedCourseId]);

  return (
    <>
      <Wrapper className="py-5 px-8">
        <div className="flex justify-between mb-5">
          <h1 className="text-mainheading text-3xl font-bold">
            {currentEditedCourseId ? "Edit course" : "Create new course"}
          </h1>
          <Button
            size={"default"}
            variant={"secondary"}
            className="text-lg font-bold tracking-wide"
            disabled={!validateFormData() || isSubmitting}
            onClick={handleCreateCourse}
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </Button>
        </div>
        <Card className="rounded-md bg-[#384B70] border-none">
          <CardContent>
            <div className="container mx-auto p-4">
              <Tabs defaultValue="curriculum" className="space-y-4">
                <TabsList className="flex items-center justify-center">
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="course-landing-page">
                    Course Landing Page
                  </TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="curriculum">
                  <CourseCurriculum />
                </TabsContent>
                <TabsContent value="course-landing-page">
                  <CourseLanding />
                </TabsContent>
                <TabsContent value="settings">
                  <CourseSettings />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </Wrapper>
    </>
  );
}
