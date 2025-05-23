import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import logo from './assets/bro-quote-logo.png';

export default function Header() {
    const {setUserInfo,userInfo} = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include', 
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

function logout() {
    fetch ('http://localhost:4000/logout', {
        credentials: 'include',
        method: 'POST',
    });
    setUserInfo(null);
}

const username = userInfo?.username;


    return (
    <header>
        <div className="logo-container fade-in">
            <Link to="/">
                <img src={logo} alt="BroQuote Logo" className="logo-img" />
            </Link>
            <Link to="/blogs" className="logo">All Blogs</Link>
        </div>

        <nav className="fade-in">
            {username && (
                <>
                    <span>Welcome, {username} </span>
                    <Link to="/create">Create new post</Link>
                    <a onClick={logout}>Logout</a>
                </>
            )}
            {!username && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}

        </nav>
    </header>
    );
}

