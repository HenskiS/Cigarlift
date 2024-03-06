import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import store from './store'
import { Provider } from 'react-redux'
import { AuthProvider } from './context/AuthProvider';
import Auth from './pages/Auth.jsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    </AuthProvider>
  </React.StrictMode>,
)
