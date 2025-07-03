import { useEffect, useState } from "react";
import Post from "../Post";

const API = process.env.REACT_APP_API_URL;

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/post`)
            .then((response) => response.json()) 
            .then((posts) => {
                setPosts(posts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading posts...</div>;

    return (
        <>
            {posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} {...post} />)
            ) : (
                <div>No posts found.</div>
            )}
        </>
    );
}
