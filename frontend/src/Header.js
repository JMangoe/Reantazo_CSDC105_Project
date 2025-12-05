import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logo from './assets/bro-quote-logo.png';
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API_URL; 

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch(`${API}/profile`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch(`${API}/logout`, {
            method: "POST",
            credentials: "include",
        }).then(() => {
            setUserInfo(null);
            toast.success("Logged out successfully 👋");
            navigate("/"); 
        });
    }

    const username = userInfo?.username;

    return (
        <header>
            <div className="logo-container fade-in">
                <Link to="/">
                    <img src={logo} alt="BroQuote Logo" className="logo-img" />
                </Link>
                <Link to="/blogs" className="logo">All Essays</Link>
            </div>

            <nav className="fade-in">
                {username && (
                    <>
                        <span className="welcome-button">Welcome, {username} </span>
                        <Link to="/create" className="nav-button">Post</Link>
                        <a className="nav-button" onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login" className="nav-button">Login</Link>
                        <Link to="/register" className="nav-button">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
