import { useState,useEffect } from 'react'
import { Outlet } from "react-router-dom";
import './App.css'
import './index.css'
import { ToastContainer } from "react-toastify";
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
 

  return (
    <>
    <Header/>
    <Outlet/>
     <ToastContainer autoClose={3000} position="bottom-right" />
     <Footer/>
    </>
  )
}

export default App
