import './App.css';
import Header from './Header';
import Post from './Post';
import { Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import Postpage from './pages/PostPage';
import EditPost from './pages/EditPost';
import IntroPage from './pages/IntroPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';



function App() {
  return (
    <GoogleOAuthProvider clientId="643640226376-phju3rdc9eqhgt0gg5tlrrk6ktt1nrbd.apps.googleusercontent.com">
    <Toaster position="top-center" reverseOrder={false}/>
      <UserContextProvider>
        <Routes>

          <Route path="/" element={<IntroPage />} />

          <Route path="/" element={<Layout />}>
            <Route path="blogs" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<Postpage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </GoogleOAuthProvider>

  );
}

export default App;
