import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";

const API = process.env.REACT_APP_API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setLoading(true);

    const response = await fetch(`${API}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    setLoading(false);

    if (response.ok) {
      const userInfo = await response.json();
      setUserInfo(userInfo);
      setRedirect(true);
    } else {
      alert("Wrong credentials.");
    }
  }

  async function handleGoogleLogin(credentialResponse) {
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
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        alert("Google login failed.");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("An error occurred during Google login.");
    }
  }

  if (redirect) return <Navigate to="/blogs" />;

  return (
    <form className="login fade-in max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-4" onSubmit={login}>
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

    <div className="relative w-full">
        <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
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
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="flex justify-center mt-2">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Login Failed")}
        />
      </div>

      <p className="text-sm text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
