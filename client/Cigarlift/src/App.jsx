import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import PrivateRoutes from './components/PrivateRoutes.jsx';
import Auth from './pages/Auth.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          console.log(resObject.user)
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <Routes>
      <Route 
        path="/*" 
        element={user ? <PrivateRoutes user={user}/> : <Auth />}>
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
