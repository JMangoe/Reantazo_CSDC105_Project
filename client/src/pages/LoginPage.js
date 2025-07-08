import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { GoogleLogin } from '@react-oauth/google';

const API = process.env.REACT_APP_API_URL;

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            const userInfo = await response.json();
            setUserInfo(userInfo);
            setRedirect(true);
        } else {
            alert('Wrong credentials.');
        }
    }

    async function handleGoogleLogin(credentialResponse) {
        try {
            const response = await fetch(`${API}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
                credentials: 'include',
            });

            if (response.ok) {
                const userInfo = await response.json();
                setUserInfo(userInfo);
                setRedirect(true);
            } else {
                alert('Google login failed.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred during Google login.');
        }
    }

    if (redirect) {
        return <Navigate to={'/blogs'} />
    }

    return (
        <form className="login fade-in" onSubmit={login}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
            <div style={{ marginTop: '1rem' }}>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                        console.log('Google Login Failed');
                        alert('Google Login Failed');
                    }}
                />
            </div>
        </form>
    );
}
