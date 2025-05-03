"use client";

import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCurriculum from "@/components/instructor-view/addNewCourses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/addNewCourses/CourseLanding";
import CourseSettings from "@/components/instructor-view/addNewCourses/CourseSettings";
import { useInstructorContext } from "@/context/instructor-context";
import { addNewCourseService, updateCourseByIdService } from "@/services";
import { useAuthContext } from "@/context/auth-context";


function page() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useInstructorContext();

  const {auth} = useAuthContext()
  

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
    const courseFinalFormData = {
      instructorId: auth?.user?._id || "",
      instructorName: auth?.user?.userName || "",
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const response =  await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      router.back()
    }
  }

  return (
    <>
      <Wrapper className="py-5 px-8">
        <div className="flex justify-between mb-5">
          <h1 className="text-mainheading text-3xl font-bold">
            Create new course
          </h1>
          <Button
            size={"default"}
            variant={"secondary"}
            className="text-lg font-bold tracking-wide"
            disabled={!validateFormData()}
            onClick={handleCreateCourse}
          >
            SUBMIT
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

export default page;
