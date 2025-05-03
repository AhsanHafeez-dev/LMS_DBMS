"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstructorContext } from "@/context/instructor-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { mediaUploadService, mediaDeleteService } from "@/services";
import MediaProgressBar from "@/components/shared/MediaProgessBar";
import VideoPLayer from "@/components/shared/VideoPlayer";
import { IoMdCloudUpload } from "react-icons/io";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructorContext();

  const handleAddLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumFormData[0],
      },
    ]);
  };

  const handleChangeCourseTitle = (e, index) => {
    const updatedFormData = courseCurriculumFormData.map((lecture, i) => {
      if (i === index) {
        return {
          ...lecture,
          title: e.target.value,
        };
      }
      return lecture;
    });

    setCourseCurriculumFormData(updatedFormData);
  };

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  
  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }


  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService( getCurrentVideoPublicId);
    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <>
      <Card className="bg-[#101d38] border border-slate-400">
        <CardHeader>
          <CardTitle className="font-bold text-lg text-text">
            Course Curriculum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAddLecture}
            className="mb-6 button bg-gray-800 "
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          >
            Add Lecture
          </Button>
          {mediaUploadProgress ? (
            <MediaProgressBar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
          <div className="space-y-6 w-full">
            {courseCurriculumFormData.map((lecture, index) => (
              <div
                key={`lecture-${index}`}
                className="flex flex-col border p-5 rounded-md border-slate-400 w-full "
              >
                <div className="flex gap-x-4 mb-1">
                  <h3 className="font-bold text-text">Lecture {index + 1}</h3>
                  <input
                    type="text"
                    name="title"
                    value={courseCurriculumFormData[0]?.title}
                    placeholder="Enter a lecture title"
                    className="bg-text rounded-md w-96 py-1 "
                    onChange={(e) => handleChangeCourseTitle(e, index)}
                  />
                  <div className="flex items-center space-x-3 ml-3">
                    <Switch
                      onCheckedChange={(value) =>
                        handleFreePreviewChange(value, index)
                      }
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${lecture.public_id || index}`}
                    />
                    <label
                      className="text-text"
                      htmlFor={`freePreview-${lecture.public_id || index}`}
                    >
                      Free Preview
                    </label>
                  </div>
                </div>
                <div className="mt-5">
                  {courseCurriculumFormData[index]?.videoURL ? (
                    <div className="flex gap-3">
                      <VideoPLayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-800"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  ) : (
                    <div class="rounded-md border border-indigo-500 bg-gray-50 p-0.75 shadow-md w-44">
                    <label for="upload" class="flex flex-row items-center gap-2 cursor-pointer">
                     <IoMdCloudUpload size={32} className="text-blue-500"/>
                      <span class="text-gray-600 font-medium">Upload file</span>
                    </label>
                     <input
                      className="hidden"
                      id="upload"
                      type="file"
                      accept="video/*"
                      onChange={(event) => {
                        handleSingleLectureUpload(event, index);
                      }}
                    ></input>
                </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default CourseCurriculum;
