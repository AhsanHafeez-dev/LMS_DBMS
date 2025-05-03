"use client"

import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config';
import React, { useContext, useState, useTransition } from "react";
import { createContext } from "react";

const instructorContext = createContext(null);


export default function InstructorContext({children}) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData)
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false)
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0)
  const [instructorCoursesList, setInstructorCoursesList] = useState([])
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null)

   return(
    <instructorContext.Provider value={{
      courseLandingFormData, 
      setCourseLandingFormData,
      courseCurriculumFormData, 
      setCourseCurriculumFormData,
      mediaUploadProgress, 
      setMediaUploadProgress,
      mediaUploadProgressPercentage, 
      setMediaUploadProgressPercentage,
      instructorCoursesList, 
      setInstructorCoursesList,
      currentEditedCourseId, 
      setCurrentEditedCourseId
    }}
    >
      {children}
    </instructorContext.Provider>
  )
}

export function useInstructorContext(){
  const context = useContext(instructorContext)
  try{
    return context
  }catch{
   console.log("error giving context");
   
  }
}
 