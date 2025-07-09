import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { LoadingContext } from "../LoadingContext"; // 👈 Import global loader
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API_URL;

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { loading, setLoading } = useContext(LoadingContext); // 👈 Use the global context

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // ⏳ Show global loading
        const res = await fetch(`${API}/post?page=${currentPage}&limit=5`);
        const data = await res.json();

        const postsWithCounts = data.posts.map(post => ({
          ...post,
          likeCount: post.likes?.length || 0,
          commentCount: post.comments?.length || 0
        }));

        setPosts(postsWithCounts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [currentPage]);

return (
  <>
    {loading ? (
      // nothing needed here — FullScreenLoader will already be showing globally
      null
    ) : posts.length > 0 ? (
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