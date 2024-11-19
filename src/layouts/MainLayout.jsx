import React from 'react'
import { Outlet } from 'react-router-dom';
import Ads from '../components/Ads';

const MainLayout = () => {
  return (
    <>
    <div className='mainLayoutDiv'>
      <div className='inner-pages'>
        <Outlet />
      </div>
      <Ads />
    </div>
    </>
  )
}

export default MainLayout