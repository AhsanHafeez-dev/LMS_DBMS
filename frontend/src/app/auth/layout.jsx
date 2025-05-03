import Navbar from '@/components/layout/Navbar'
import React from 'react'

function layout({children}) {
  return (
    <main>
      <Navbar/>
      {children}
    </main>
  )
}

export default layout