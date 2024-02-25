import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FeedIcon from '@mui/icons-material/Feed';
import SettingsIcon from '@mui/icons-material/Settings';
import { CssBaseline, Paper } from '@mui/material';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import Drive from '../pages/Drive';

export default function Navbar() {
  const navigate = useNavigate()
  const [value, setValue] = React.useState(0);
  console.log("value: " + useLocation().pathname)

  return (
    <>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0/*, padding: '10px'*/ }} elevation={3}>
      <BottomNavigation
        showLabels
        value={useLocation().pathname}
        onChange={(event, newValue) => {
          setValue(newValue);
          console.log(newValue);
          navigate(newValue)
        }}
      >
        <BottomNavigationAction 
          label="Drive"
          value="/drive"
          icon={<DeliveryDiningIcon />} 
          //LinkComponent={Link}
          //to="/drive"
        />
        <BottomNavigationAction 
          label="Order"
          value="/order"
          icon={<FeedIcon />} 
          //LinkComponent={Link}
          //to="/order"
        />
        <BottomNavigationAction 
          label="Settings"
          value="/settings"
          icon={<SettingsIcon />} 
          //LinkComponent={Link}
          //to="/settings"
        />
      </BottomNavigation>
    </Paper>
    <Outlet />
    </>
  );
}