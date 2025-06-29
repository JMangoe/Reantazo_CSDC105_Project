import { useEffect, useState } from "react";
import Post from "../Post";

const API = process.env.REACT_APP_API_URL;

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch(`${API}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </> 
    );
}