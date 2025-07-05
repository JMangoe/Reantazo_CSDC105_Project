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
                const postsWithCounts = posts.map(post => ({
                    ...post,
                    likeCount: post.likes?.length || 0,
                    commentCount: post.comments?.length || 0
                }));
                setPosts(postsWithCounts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ textAlign: "center", marginTop: "2rem", color: "#000000" }}>Loading posts...</div>;

    return (
        <>
            {posts.length > 0 ? (
                posts.map((post) => <Post 
                    key={post._id} 
                    {...post} 
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}/>)
            ) : (
                <div>No posts found.</div>
            )}
        </>
    );
}
