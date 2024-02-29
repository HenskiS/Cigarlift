import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FeedIcon from '@mui/icons-material/Feed';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const location = useLocation();

  const handleNavigation = (path) => {
    // You can perform any additional logic here if needed
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className='navdiv'>
      <BottomNavigation value={location.pathname} showLabels>
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
          //onClick={() => handleNavigation('/logout')}
        />
      </BottomNavigation>
    </div>
  );
};

export default Navbar;
