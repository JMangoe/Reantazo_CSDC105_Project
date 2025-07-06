import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";
import logo from './assets/bro-quote-logo.png';

const API = process.env.REACT_APP_API_URL;

export default function Header() {
    const {setUserInfo,userInfo} = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        fetch(`${API}/profile`, {
            credentials: 'include', 
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, [setUserInfo]);

function logout() {
    fetch (`${API}/logout`, {
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
            <Link to="/blogs" className={`logo ${location.pathname === "/blogs" ? "active" : ""}`}>All Blogs</Link>
        </div>

        <nav className="nav-links fade-in">
            {username ? (
                    <>
                        <span className="welcome">Welcome, {username}</span>
                        <Link to="/create" className={location.pathname === "/create" ? "active" : ""}>Create new post</Link>
                        <button className="logout-btn" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
                        <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
                    </>
                )}
        </nav>
    </header>
    );
}

