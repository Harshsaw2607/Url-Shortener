import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Route,RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Components/Home.jsx'
import Shortener from './Components/Shortener.jsx'
import UserContextProvider from './Context/UserContextProvider.jsx'
import LogIn from './Components/Auth/LogIn.jsx'
import Register from './Components/Auth/Register.jsx'
import RequireAuthentication from './Components/RequireAuthentication.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element = {<LogIn/>}/>
      <Route path='/register' element = {<Register/>}/>
      <Route path='/' element={<Home/>} />
      <Route path='/' element={<RequireAuthentication/>}>
        <Route path='shorten' element={<Shortener/>} />
      </Route>
      
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>,
)
