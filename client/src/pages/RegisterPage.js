import {useState} from "react";

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function register(ev) {
        ev.preventDefault();
        const response = await fetch(`${API}/register`, {
            method: 'POST', 
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'},
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
                <input type="text" 
                        placeholder="username" 
                        value={username} 
                        onChange={ev => setUsername(ev.target.value)}/>
                <input type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={ev => setPassword(ev.target.value)}/>
                <button>Register</button>
            </form>
        );
}