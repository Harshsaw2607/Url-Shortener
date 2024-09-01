import React, {useEffect} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from '../Hooks/useAuth';
import axios from 'axios';
const URL = process.env.VITE_BACKEND_URL;

function RequireAuthentication() {
    const { user,setUser } = useAuth()
    // var user = null;
  useEffect(() => {
    const func  = async () => {
      await axios
        .get(`${URL}/api/auth/profile`, { withCredentials: true })
        .then((response) => {
          console.log("response in Nav = ",response)
          setUser({
            email: response.data.user.username,
            id: response.data.user.id,
            roles: response.data.user.roles,
          });
          console.log("user in Nav = ",user)
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        });
      }
      func()
 
    }, []);

    if(!user){
      return <div>Loading...</div>
    }
  const location = useLocation()
  console.log("user = ",user)
  
  
  return (
    user?
      <Outlet /> : <Navigate to={'/login'} state={{ from: location }} replace />

  )
}

export default RequireAuthentication
