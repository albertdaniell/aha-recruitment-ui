"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import Logos from '../components/Search/Logos'
import { Spinner } from 'flowbite-react'

function page() {
    let [loaded,set_loaded] = useState(false)
  return (
    <div className='overflow-auto flex flex-col justify-center items-center '>
        <div className='my-5'>
            <Link href={"/"} className='text-blue-700'>Back to main page</Link>
        </div>

        {!loaded && <Spinner/>}
        <iframe  
        // onLoadStart={set_loading(true)}
        onLoad={()=>set_loaded(true)}
        src="https://docs.google.com/forms/d/e/1FAIpQLSeUY5AvBUZNrCX6FaPG25Gw6SqsiaHOiBAoPUdKbCgCR6g3eg/viewform?embedded=true"  style={{
            minHeight:"100vh",
            width:"100%"
        }} frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>

        <Logos/>
    </div>
  )
}

export default page