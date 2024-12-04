import React, {useState} from "react"
import api from "../api"
import {Link, useNavigate} from "react-router-dom"
import {ACCESS_TOKEN, REFRESH_TOKEN, USERNAME} from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({route, method}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");


        if (!username || !password) {
            setErrorMessage("Please fill out the username and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(route, {username, password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            if (error.response.status === 401) {
                setErrorMessage("Invalid credentials. Please check your username and password.");
            } else if (error.response.status === 400) {
                setErrorMessage("An account with this username already exists. Please choose another username.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="login-form-container">
                <h1>{name}</h1>
                <input
                    className="form-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    className="form-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {loading &&
                    <div className="loading-indicator">
                        <LoadingIndicator/>
                    </div>
                }
                <button className="form-button" type="submit">
                    {name}
                </button>
                {method === "login" && (
                    <div className="login-register-button-container">
                        <Link to="/register" className="login-register-button">
                            Register
                        </Link>
                    </div>
                )}
                {method !== "login" && (
                    <div className="login-register-button-container">
                        <Link to="/login" className="login-register-button">
                            Login
                        </Link>
                    </div>
                )}

            </form>
        </div>
    )
}

export default Form