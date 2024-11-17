import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  createHashRouter,
  Route
} from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import Single from './pages/Single';
import Multi from './pages/Multi';
import Privacy from './pages/Privacy';


const App = () => {


  const router = createHashRouter(
    createRoutesFromElements(
      <>
       <Route path='/' element={<MainLayout />} >
          <Route index element={<Single />} />
          <Route path='/multi' element={<Multi />} />
          <Route path='/privacy' element={<Privacy />} />
        </Route>
      </>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App