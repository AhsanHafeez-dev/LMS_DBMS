"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/auth-context";
import { useStudentContext } from "@/context/student-context";
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import ReactPlayer from 'react-player';

function page() {
  const { auth } = useAuthContext();
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useStudentContext();
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();
  const  router = useRouter();



  async function fetchCurrentCourseProgress() {
    console.log("fetching curret course progress");
    console.log("Data sending : ", auth.id, id)
    let response;
    if (auth.id && id) {
      response = await getCurrentCourseProgressService(auth.id, id);
    }
    console.log("response of course progress  : ")
    console.log(response);
  if (response?.success) {
        if (!response?.data?.isPurchased) {
          setLockCourse(true);
        } else {
          setStudentCurrentCourseProgress({
            courseDetails: response?.data?.courseDetails,
            progress: response?.data?.progress,
          });
  
          if (response?.data?.completed) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);
  
            return;
          }
  
          if (response?.data?.progress?.length === 0) {
            console.log("response in video ");
            console.log(response);
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          } else {
            console.log("logging here");
            const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
              (acc, obj, index) => {
                return acc === -1 && obj.viewed ? index : acc;
              },
              -1
            );
            console.log("response in video (2)");
            console.log(response);
            
            setCurrentLecture(
                response?.data?.courseDetails?.curriculum[
                lastIndexOfViewedAsTrue + 1
              ]
            );
            console.log(currentLecture);
          }
        }
      }
    }
  
  
  async function updateCourseProgress() {
    console.log("updating ");
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.id,
        studentCurrentCourseProgress?.courseDetails?.id,
        currentLecture.id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    console.log("hadling rewatch");
    const response = await resetCourseProgressService(
      auth?.id,
      studentCurrentCourseProgress?.courseDetails?.id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }



  useEffect(() => {
    if (!auth?.id || !id) return;
    console.log("calling student for:", auth.id, id);
    console.log("calling student ")
    fetchCurrentCourseProgress();
  },[id])

  useEffect(()=>{
    console.log("course progress : ",studentCurrentCourseProgress);
  },[id])



  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);


  console.log("returning")

  return (
    <>
     <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti/>}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => router.push("/student/my-courses")}
            className="text-black"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <div className="w-full h-[500px] bg-black flex items-center justify-center">
          <ReactPlayer
  url={currentLecture?.videoUrl}
  controls
  playing
  width="100%"
  height="500px"
/>

          </div>
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className="text-black rounded-none h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-black rounded-none h-full"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
   (item) => {
     const isActive = currentLecture?.id === item.id;
     return (
       <div
         key={item.id}
         onClick={() => setCurrentLecture(item)}
         className={
           `flex items-center space-x-2 text-sm font-bold cursor-pointer ` +
           (isActive
             ? "text-blue-400"
             : "text-white hover:text-gray-300")
         }
       >
         {studentCurrentCourseProgress.progress.find(
           (p) => p.lectureId === item.id
         )?.viewed
           ? <Check className="h-4 w-4 text-green-500" />
           : <Play className="h-4 w-4" />
         }
         <span>{item.title}</span>
       </div>
     );
   }
 )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => router.back()}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    </> 
  )
}

export default page;
