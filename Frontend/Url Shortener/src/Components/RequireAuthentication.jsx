import React, {useEffect, useState} from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from '../Hooks/useAuth';
import axios from 'axios';
const URL = process.env.VITE_BACKEND_URL;

function RequireAuthentication() {
    const { user,setUser } = useAuth()
    const [loading, setLoading] = useState(true);
    const [timeoutReached, setTimeoutReached] = useState(false);
    // var user = null;
  useEffect(() => {
    const fetchUser  = async () => {
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
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
          setLoading(false);
        });
      }
      fetchUser()

      const timer = setTimeout(() => {
        setTimeoutReached(true);
    }, 5000);

    // Clean up the timeout if the component unmounts or if the user is fetched
    return () => clearTimeout(timer);
 
    }, [setUser]);

    if(loading && !timeoutReached){
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
