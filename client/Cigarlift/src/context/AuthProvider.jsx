import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ // }) /*
        user: 'Henry', 
        pwd: 'password', 
        roles: [5150, 2001], 
        accessToken: 'asdfghjkl' 
    });//*/

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;