import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

   useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
        api.get("/api/user-profile/", {
            headers: { Authorization: `Bearer ${token}` },
            params: { t: new Date().getTime() }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            //console.error("API Error:", error.response ? error.response.data : error.message);
            setUser(null);
        });
    }
}, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};