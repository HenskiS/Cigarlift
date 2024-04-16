import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import Prefetch from './features/auth/Prefetch';
import Layout from './components/Layout'
import Public from './components/Public';
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import EditUserForm from './features/users/EditUserForm'
import NewUserForm from './features/users/NewUserForm'
import PrivateRoutes from './components/PrivateRoutes.jsx';
import Auth from './pages/Auth.jsx';
import Drive from './features/drive/Drive.jsx'
import Order from './features/order/Order'
import Unauthorized from './pages/Unauthorized.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Missing from './pages/Missing.jsx';
import Login from './features/auth/Login.jsx';
import useTitle from './hooks/useTitle.jsx';
import { ROLES } from './config/roles'
import Navbar from './components/Navbar.jsx';
import DashLayout from './components/DashLayout.jsx';
import ClientsList from './features/clients/ClientsList.jsx';
import EditClient from './features/clients/EditClient.jsx';
import Client from './features/clients/Client.jsx';
import NewOrderForm from './features/order/NewOrderForm.jsx';

function App() {
  useTitle('Cigarlift')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
        <Route path="order/:id" element={<Order />} />
      
      {/* private routes */}
      <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path='/*' element={<DashLayout />}>

                <Route path="drive" element={<Drive />} />

                <Route path="clients">
                  <Route index element={<ClientsList />} />
                  <Route path=":id" element={<Client />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>

                <Route path="order">
                  <Route index element={<NewOrderForm />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="dash" element={<AdminDashboard />} />
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                  
                </Route>

                {/* Not using notes
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>*/}

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}
      </Route>






      {/*<Route element={<PrivateRoutes allowedRoles={[ROLES.Admin]} />} >
        <Route path="/" element={<AdminDashboard />} />
      </Route>
      <Route element={ <PrivateRoutes allowedRoles={[ROLES.Driver, ROLES.Admin]} /> }>
        <Route path="drive" element={<Drive />} />
        <Route path="order" element={<Order />} />
      </Route>
      
              <Route path="*" element={<Missing />} />*/}
      
    </Routes>
  )
}

export default App
