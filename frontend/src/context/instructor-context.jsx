// "use client";

// import {
//   courseCurriculumInitialFormData,
//   courseLandingInitialFormData,
// } from "@/config";
// import { fetchInstructorCourseListService } from "@/services";
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// // Create the context
// const InstructorContext = createContext(null);

// // Context Provider component
// export default function InstructorProvider({ children }) {
//   const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
//   const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
//   const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
//   const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
//   const [instructorCoursesList, setInstructorCoursesList] = useState([]);
//   const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

//   // Fetch all courses on mount
//   useEffect(() => {
//     async function fetchAllCourses() {
//       console.log("fetching instrcutor course list")
//       const response = await fetchInstructorCourseListService();
      
//       if (response?.success) {
//         setInstructorCoursesList(response.data);
//       } else {
//         console.warn("Failed to fetch courses or response was unsuccessful.");
//       }
//     }
//     fetchAllCourses()
//   }
//   )



// useEffect(()=>{
//   console.log("instructor courses",instructorCoursesList);
// },[])


//   return (
//     <InstructorContext.Provider
//       value={{
//         courseLandingFormData,
//         setCourseLandingFormData,
//         courseCurriculumFormData,
//         setCourseCurriculumFormData,
//         mediaUploadProgress,
//         setMediaUploadProgress,
//         mediaUploadProgressPercentage,
//         setMediaUploadProgressPercentage,
//         instructorCoursesList,
//         setInstructorCoursesList,
//         currentEditedCourseId,
//         setCurrentEditedCourseId,
//       }}
//     >
//       {children}
//     </InstructorContext.Provider>
//   );
// }

// // Custom hook for using context
// export function useInstructorContext() {
//   const context = useContext(InstructorContext);
//   if (!context) {
//     console.warn("useInstructorContext must be used within an InstructorProvider");
//   }
//   return context;
// }




"use client";

import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { fetchInstructorCourseListService } from "@/services";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
 

  useEffect(() => {
    async function fetchAllCourses() {
      const response = await fetchInstructorCourseListService();
      if (response?.success) {
        setInstructorCoursesList(response.data);
      } else {
        console.warn("Failed to fetch courses or response was unsuccessful.");
      }
    }

    fetchAllCourses();
  }, [instructorCoursesList]);


// useEffect(()=>{
//   console.log("instructor courses",instructorCoursesList);
// },[instructorCoursesList])

  return (
    <InstructorContext.Provider
      value={{
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
        setCurrentEditedCourseId,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

// Custom hook for using context
export function useInstructorContext() {
  const context = useContext(InstructorContext);
  if (!context) {
    console.warn("useInstructorContext must be used within an InstructorProvider");
  }
  return context;
}
