import React from 'react'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
    <div className='mainLayoutDiv'>
      <div className='inner-pages'>
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default MainLayout