import { useState } from "react";

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d[^A-Za-z0-9]]{8,20}$/;
        return regex.test(password);
    }

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
        });
        if (response.status === 200) {
            alert('Registration successful!');
        } else {
            alert('Registration failed.');
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
        </form>
    );
}
