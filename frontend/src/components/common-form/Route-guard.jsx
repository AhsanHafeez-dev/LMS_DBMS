// 'use client'

// import { useRouter, usePathname } from 'next/navigation'
// import { useEffect } from 'react'

// export default function RouteGuard({ authenticated, user, children }) {
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {


//     if (!authenticated && !pathname.includes('/auth')) {
//       router.replace('/auth')
//     }

//     if (
//       authenticated &&
//       user?.role !== 'admin' &&
//       (pathname.includes('instructor') || pathname.includes('/auth'))
//     ) {
//       router.replace('/')
//     }

//     if (
//       authenticated &&
//       user?.role === 'admin' &&
//       !pathname.includes('instructor')
//     ) {
//       router.replace('/instructor') 
//     }
//   }, [authenticated, user, pathname, router])

//   return <>{children}</>
// }


'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function RouteGuard({ authenticated, user, children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const handleRouting = () => {
      if (pathname === '/auth') {
        if (authenticated) {
          if (user?.role === 'instructor') {
            router.replace('/instructor')
          } else {
            router.replace('/')
          }
          return false
        }
        return true
      }


      if (!authenticated) {
        router.replace('/auth')
        return false
      }

      if (pathname.includes('/instructor')) {
        if (user?.role !== 'instructor') {
          router.replace('/')
          return false
        }
        return true
      }

  
      if (user?.role === 'instructor' && !pathname.includes('/instructor')) {
        router.replace('/instructor')
        return false
      }

      return true
    }

    const canProceed = handleRouting()
    setIsChecking(false)
    
  }, [authenticated, user, pathname])

  if (isChecking) {
    return <Skeleton className="w-full h-screen" />
  }

  return <>{children}</>
}