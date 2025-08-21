import React from 'react'

function Main({children}) {
  return (
<main className="flex min-h-screen flex-col lg:justify-between">
     {children}
     </main>

  )
}

export default Main