import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ for redirect

    async function register(ev) {
        ev.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be 8-20 characters, include at least 1 uppercase letter, 1 number, and 1 special character.");
            return;
        }

        const response = await fetch(`${API}/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // ✅ ensures cookie is set immediately
        });
        if (response.status === 200) {
            alert('Registration successful!');
            navigate('/'); // ✅ redirect after normal register
        } else {
            alert('Registration failed.');
        }
    }

    async function handleGoogleSignUp(credentialResponse) {
        try {
            const response = await fetch(`${API}/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
                credentials: 'include', // ✅ ensures cookie is set immediately
            });

            if (response.status === 200) {
                // ✅ Automatically navigate to home since user is logged in
                navigate('/');
            } else {
                alert('Google registration/login failed.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    }

    return (
        <form className="register fade-in" onSubmit={register}>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
            <button>Register</button>
            <div style={{ marginTop: '1rem' }}>
                <GoogleLogin
                    onSuccess={handleGoogleSignUp}
                    onError={() => {
                        console.log('Google Login Failed');
                    }}
                />
            </div>
        </form>
    );
}
