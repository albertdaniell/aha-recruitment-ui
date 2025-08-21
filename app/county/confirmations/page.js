import React from 'react'
import Confirmations from "./Confirmations"
import AuthProvider from '@/app/Providers/AuthProvider'
function page() {
  return (
    <div>
         <AuthProvider>
         <Confirmations/>

    </AuthProvider>
    </div>
  )
}

export default page