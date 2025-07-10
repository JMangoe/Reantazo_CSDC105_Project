import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { LoadingContext } from "../LoadingContext"; // 👈 Import global loader
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API_URL;

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const { loading, setLoading } = useContext(LoadingContext); // 👈 Use the global context

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // ⏳ Show global loading
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: 5,
        });
        if (searchQuery) {
          // Send the same query for both title and author filtering
          queryParams.append('title', searchQuery);
          queryParams.append('author', searchQuery);
        }
        const res = await fetch(`${API}/post?${queryParams.toString()}`);
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
  }, [currentPage, searchQuery]);

  const handleSearchClick = () => {
    setCurrentPage(1);
    setSearchQuery(inputValue.trim());
  };

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            width: '300px',
            borderRadius: '20px 0 0 20px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            borderRight: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#007bff'}
          onBlur={e => e.target.style.borderColor = '#ccc'}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSearchClick();
            }
          }}
        />
        <button
          type="button"
          aria-label="Search"
          onClick={handleSearchClick}
          onMouseDown={e => e.preventDefault()}
          style={{
            width: '40px',
            height: '36px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '0 20px 20px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            padding: 0,
            borderLeft: 'none',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#666" viewBox="0 0 24 24">
            <path d="M21 20l-5.6-5.6a7 7 0 1 0-1.4 1.4L20 21zM10 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
          </svg>
        </button>
      </div>

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
