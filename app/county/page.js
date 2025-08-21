import React from 'react'
import AuthProvider from '../Providers/AuthProvider'
import TopStats from './pagecomponents/TopStats'
import PageWrapper from './pagecomponents/PageWrapper'

function page() {
  return (
    <AuthProvider>
        <PageWrapper/>
    </AuthProvider>
  )
}

export default page