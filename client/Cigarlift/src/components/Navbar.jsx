import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import './Navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FeedIcon from '@mui/icons-material/Feed';
import LogoutIcon from '@mui/icons-material/Logout';

import { Paper } from '@mui/material';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAdmin } = useAuth();
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    setAuth({});
    navigate('/auth');
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0  }} elevation={3}>

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
