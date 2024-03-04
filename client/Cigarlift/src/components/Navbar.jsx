import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FeedIcon from '@mui/icons-material/Feed';
import LogoutIcon from '@mui/icons-material/Logout';
import { Paper } from '@mui/material';

const Navbar = () => {
  const location = useLocation();

  const handleNavigation = (path) => {
    // You can perform any additional logic here if needed
    console.log(`Navigating to: ${path}`);
  };

  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0  }} elevation={3}>

      <BottomNavigation 
        value={location.pathname} 
        showLabels
        className='navbar'
      >
        <BottomNavigationAction 
          label="Drive"
          value="/drive"
          icon={<DeliveryDiningIcon />}
          component={Link}
          to="/drive"
          //onClick={() => handleNavigation('/drive')}
        />
        <BottomNavigationAction 
          label="Order"
          value="/order"
          icon={<FeedIcon />} 
          component={Link}
          to="/order"
          //onClick={() => handleNavigation('/order')}
        />
        <BottomNavigationAction 
          label="Logout"
          value="/logout"
          icon={<LogoutIcon />} 
          component={Link}
          to="/logout"
          onClick={logout}
        />
      </BottomNavigation>

    </Paper>
  );
};

export default Navbar;
