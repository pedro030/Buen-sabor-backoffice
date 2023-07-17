import React from 'react'

const PageLoader = () => {
  return (
    <div className='flex flex-col justify-center items-center h-[100vh]'>
      <span className="loading loading-spinner loading-lg text-primary"></span>
      {/* <div className='flex'><p className='mr-4 text-primary'>Loading</p><span className="loading loading-dots loading-xs text-primary"></span></div> */}
    </div>
  )
}

export default PageLoader