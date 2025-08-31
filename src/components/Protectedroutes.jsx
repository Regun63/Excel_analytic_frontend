import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate ,useLocation} from "react-router-dom";

const ProtectedRoutes = ({ children, adminOnly = false }) => {
  const { users } = useSelector(store => store.author);
  const navigate = useNavigate();
   const location = useLocation();

  useEffect(() => {
    if (!users ) {
      
      navigate('/login');
      return;
    }
    
    if (!users.verified) {
      navigate('/verify');
      return;
    }
    

    if (adminOnly && users.role=='user') {
      navigate('/userhome');
      return;
    }
    if (users && (location.pathname === '/login' || location.pathname === '/signup')) {
      if (users.role=='admin') {
        navigate('/admin_Home');
      } else if(users.role=='superadmin'){
        navigate('/superadmin_home');
      }else {
        navigate('/userhome');
      }
      return;
    }

   if (!adminOnly && (users.role === 'admin' ) &&
        (location.pathname === '/userhome' || location.pathname === '/user_dashboard')) {
      navigate('/admin_Home');  
      return;
    }
   if (!adminOnly && (users.role === 'superadmin' ) &&
        (location.pathname === '/userhome' || location.pathname === '/user_dashboard' ||location.pathname === '/admin_Home'||location.pathname === '/admin_dashboard') ) {
      navigate('/superadmin_home');  
      return;
    }
    
    
  }, [users, navigate, adminOnly,location.pathname]);

  return <>{children}</>;
};

export default ProtectedRoutes;
