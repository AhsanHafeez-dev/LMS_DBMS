
'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RouteGuard({ authenticated, user, children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log(authenticated, user, "useruser")

    if (!authenticated && !pathname.includes('/auth')) {
      router.replace('/auth')
    }

    if (
      authenticated &&
      user?.role !== 'admin' &&
      (pathname.includes('instructor') || pathname.includes('/auth'))
    ) {
      router.replace('/')
    }

    if (
      authenticated &&
      user?.role === 'admin' &&
      !pathname.includes('instructor')
    ) {
      router.replace('/instructor')
    }
  }, [authenticated, user, pathname, router])

  return <>{children}</>
}