import { createContext, useState, useEffect } from "react";
import api from "../api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (token) {
            setAuthLoading(true);

            api.get("/api/user-profile/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { t: new Date().getTime() }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setAuthLoading(false);
            });
        } else {
            setAuthLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
