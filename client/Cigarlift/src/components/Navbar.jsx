import { useContext } from 'react';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FeedIcon from '@mui/icons-material/Feed';
import ListIcon from '@mui/icons-material/List';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { Paper } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const Navbar = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  const logout = async () => {
    //setAuth({});
    //navigate('/auth');
    sendLogout()
    navigate('/login');
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10  }} elevation={3}>

      <BottomNavigation 
        value={location.pathname} 
        showLabels
        className='navbar'
      >

        {isAdmin
        ? <BottomNavigationAction 
          label="Dashboard"
          value="/dash"
          icon={<DashboardIcon />}
          component={Link}
          to="/dash"
        /> : null}
        <BottomNavigationAction 
          label="Appointments"
          value="/appointments"
          icon={<ScheduleIcon />}
          component={Link}
          to="/appointments"
        />
        <BottomNavigationAction 
          label="Drive"
          value="/drive"
          icon={<DeliveryDiningIcon />}
          component={Link}
          to="/drive"
        />
        <BottomNavigationAction 
          label="Order"
          value="/order"
          icon={<FeedIcon />} 
          component={Link}
          to="/order"
        />
        <BottomNavigationAction 
          label="Clients"
          value="/clients"
          icon={<GroupIcon />} 
          component={Link}
          to="/clients"
        />
        <BottomNavigationAction 
          label="Logout"
          value="/logout"
          icon={<LogoutIcon />}
          onClick={logout}
        />
      </BottomNavigation>

    </Paper>
  );
};

export default Navbar;
