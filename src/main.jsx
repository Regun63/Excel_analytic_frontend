import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import {Provider} from "react-redux"
import store,{persistor} from "./redux/storeRedux.js"

import { PersistGate } from 'redux-persist/integration/react'
import Protectedroutes from './components/Protectedroutes.jsx'
import SignUp from './components/SignUp.jsx'
import Login from './components/Login.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import AdminHome from './components/AdminHome.jsx'
import UserHome from './components/UserHome.jsx'
import Verify from './components/Verify.jsx'
import UserDashboard from './components/UserDashboard.jsx'
import EditUser from './components/EditUser.jsx'
import AppLandingPage from './components/AppLandingPage.jsx'
import SuperAdminHome from './components/SuperAdminHome.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Protectedroutes><App /></Protectedroutes>}>
        <Route index element={<UserHome />} />
        <Route path='userhome' element={<UserHome />} />
        <Route path='user_dashboard' element={<UserDashboard/>}/>
        <Route path='editprofile' element={<EditUser/>}/>
        <Route path='admin_Home' element={<Protectedroutes adminOnly={true}><AdminHome/></Protectedroutes>} />
        <Route path='admin_dashboard' element={<Protectedroutes adminOnly={true}><AdminDashboard/></Protectedroutes>} />
        <Route path='superadmin_home' element={<Protectedroutes superAdminOnly={true}><SuperAdminHome/></Protectedroutes>} />
      </Route>
      <Route path='verify' element={<Verify />} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/login' element={<Protectedroutes><Login /></Protectedroutes>} />
      <Route path='/Apppage' element={<AppLandingPage />} />
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router} />
    </PersistGate>
    </Provider>
  </StrictMode>,
)
