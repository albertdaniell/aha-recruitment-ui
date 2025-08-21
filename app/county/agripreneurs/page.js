import React from 'react'
import Table from "./Table"
import AuthProvider from '@/app/Providers/AuthProvider'
function page() {
  return (
    <div>
         <AuthProvider>
         <Table/>

    </AuthProvider>
    </div>
  )
}

export default page