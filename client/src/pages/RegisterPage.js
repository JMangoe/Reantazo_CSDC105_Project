import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_URL;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,20}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be 8-20 characters, include at least 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    setLoading(true);
    const response = await fetch(`${API}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setLoading(false);

    if (response.ok) {
      alert("Registration successful!");
      navigate("/");
    } else {
      alert("Registration failed.");
    }
  }

  async function handleGoogleSignUp(credentialResponse) {
    try {
      setLoading(true);
      const response = await fetch(`${API}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
        credentials: "include",
      });
      setLoading(false);

      if (response.ok) {
        navigate("/");
      } else {
        alert("Google registration/login failed.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("An error occurred.");
    }
  }

  return (
    <form
      className="register fade-in max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4"
      onSubmit={register}
    >
      <h1 className="text-2xl font-bold text-center">Register</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

    <div className="password-wrapper">
        <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
        />
        <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
    </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md text-white font-semibold text-sm ${
          loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
        } transition`}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="flex justify-center mt-2">
        <GoogleLogin
          onSuccess={handleGoogleSignUp}
          onError={() => alert("Google Login Failed")}
        />
      </div>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
