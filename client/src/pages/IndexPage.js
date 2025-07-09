import { useEffect, useState } from "react";
import Post from "../Post";

const API = process.env.REACT_APP_API_URL;

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        fetch(`${API}/post?page=${currentPage}&limit=5`)
            .then((response) => response.json()) 
            .then((data) => {
                const postsWithCounts = data.posts.map(post => ({
                    ...post,
                    likeCount: post.likes?.length || 0,
                    commentCount: post.comments?.length || 0
                }));
                setPosts(postsWithCounts);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, [currentPage]);

    if (loading) return <div style={{ textAlign: "center", marginTop: "2rem", color: "#000000" }}>Loading posts...</div>;

    return (
        <>
            {posts.length > 0 ? (
                <>
                    {posts.map((post) => (
                        <Post 
                            key={post._id} 
                            {...post} 
                            likeCount={post.likeCount}
                            commentCount={post.commentCount}
                        />
                    ))}

                    {/* Pagination Controls */}
                    <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div>No posts found.</div>
            )}
        </>
    );
}
