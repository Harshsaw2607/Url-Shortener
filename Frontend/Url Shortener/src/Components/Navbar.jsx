import React,{useRef, useState, useEffect} from 'react'
import { Link, useNavigate, NavLink , useLocation} from 'react-router-dom';
import './HomePage.css'
import useAuth from '../Hooks/useAuth';
import axios from 'axios';

const URL = process.env.VITE_BACKEND_URL;

function Navbar() {
    const location = useLocation();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [showUser, setShowUser] = useState(false);
    const UserDetailsRef = useRef();
    const UserIconRef = useRef();
    console.log("user in Navbar = ",user)

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
          })
          .catch((error) => {
            console.error('Error fetching profile:', error);
          });
        }
        fetchUser
      }, [setUser]);
    
      const handleLogout = () => {
        axios
          .post(`${URL}/api/auth/logout`, {}, { withCredentials: true })
          .then(() => {
            setUser(null);
            navigate('/');
          })
          .catch((error) => console.error('Error logging out:', error));
      };
    
      const handleUserVisibility = () => {
        setShowUser(!showUser);
      };
    
      const handleClickOutside = (event) => {
        if (
          UserDetailsRef.current &&
          !UserIconRef.current.contains(event.target) &&
          !UserDetailsRef.current.contains(event.target)
        ) {
          setShowUser(false);
        }
      };
    
      useEffect(() => {
        if (showUser) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showUser]);


  return (
    <nav className="navbar">
        <div className="logo relative top-3"><Link to={"/"} className='text-white hover:text-white'>URL Shortener</Link></div>
        <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/shorten">Shorten URL</Link>
            {user ?(
                <>
                  <Link
                    onClick={handleUserVisibility}
                    className="relative cursor-pointer"
                  >
                    <img
                      ref={UserIconRef}
                      src="/user.png"
                      alt="User Icon"
                      className="h-[25px] w-[25px] mr-10"
                    />
                  </Link>
                  {showUser && (
                    <div
                      ref={UserDetailsRef}
                      className="h-[10rem] text-black w-auto border-2 rounded-md bg-blue-200 absolute z-20 p-2"
                      style={{ right: '30px', top: '20%', transform: 'translateY(30%)' }}
                    >
                      <ul className="cursor-pointer">
                        <li className="flex m-0 ">
                          <img
                            src="/user.png"
                            alt="User"
                            className="h-[25px] w-[25px] mr-2 mb-2"
                          />
                          {user.email}
                        </li>
                        <li className="flex mt-3">
                          <img
                            src="/exit.png"
                            alt="Sign Out"
                            className="h-[25px] w-[25px] mr-2"
                          />
                          <div onClick={handleLogout}>Sign Out</div>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) :(<>
                <NavLink to="/login" state={{ from: location }} replace>Login</NavLink>
                <NavLink to="/register">Sign Up</NavLink>
                </>
            )}
            
        </div>
    </nav>
  )
}

export default Navbar