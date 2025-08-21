import React from 'react'
import PageWrapper from './pagecomponents/PageWrapper'
import AuthProvider from '@/app/Providers/AuthProvider'

function page() {
  return (
    <AuthProvider>
        <PageWrapper/>
    </AuthProvider>
  )
}

export default page