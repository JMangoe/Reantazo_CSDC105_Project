import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/bro-quote-logo.png';

const API = process.env.REACT_APP_API_URL;

export default function IntroPage() {
    const [highlights, setHighlights] = useState(null);

    useEffect(() => {
        fetch(`${API}/post/highlights`)
            .then(res => res.json())
            .then(data => {
                console.log("Highlights fetched:", data);
                setHighlights(data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div 
                className="intro-page fade-in" 
                style={{
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem'
                }}
            >
                <img src={logo} alt="BroQuote Logo" className="intro-logo" style={{ maxWidth: '180px', marginBottom: '1rem' }} />
                <h1>Welcome to BroQuote Essays</h1>
                <p>Write. Reflect. Rebuild.</p>
                <Link to="/blogs" className='btn main-btn' style={{ marginTop: '1rem' }}>Enter Essays</Link>

                <div className='social-buttons' style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="https://www.instagram.com/bro._.quote/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.facebook.com/share/1C9XycJDUY/" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://www.etsy.com/shop/BroQuote" target="_blank" rel="noopener noreferrer">Etsy</a>
                </div>
            </div>

            {/* Featured Essays Section */}
            {highlights && (
                <div 
                    className="highlights-container" 
                    style={{ padding: '4rem 2rem', backgroundColor: '#f9f9f9', textAlign: 'center' }}
                >
                    <h2 style={{ marginBottom: '2rem' }}>Featured Posts</h2>
                    <div 
                        className="highlight-cards"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                            maxWidth: '1000px',
                            margin: '0 auto'
                        }}
                    >
                        {highlights.latestPost && (
                            <Link 
                                to={`/post/${highlights.latestPost._id}`} 
                                className="highlight-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {highlights.latestPost.cover && (
                                    <img
                                        src={`http://localhost:4000/${highlights.latestPost.cover}`}
                                        alt={highlights.latestPost.title}
                                        className="highlight-cover"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: '1rem', flexGrow: 1 }}>
                                    <h3>Latest: {highlights.latestPost.title}</h3>
                                    <p style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {highlights.latestPost.summary}
                                    </p>
                                    <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>by @{highlights.latestPost.author.username}</p>
                                </div>
                            </Link>
                        )}
                        {highlights.mostViewedPost && (
                            <Link 
                                to={`/post/${highlights.mostViewedPost._id}`} 
                                className="highlight-card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                {highlights.mostViewedPost.cover && (
                                    <img
                                        src={`http://localhost:4000/${highlights.mostViewedPost.cover}`}
                                        alt={highlights.mostViewedPost.title}
                                        className="highlight-cover"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: '1rem', flexGrow: 1 }}>
                                    <h3>Most Viewed: {highlights.mostViewedPost.title}</h3>
                                    <p style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {highlights.mostViewedPost.summary}
                                    </p>
                                    <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>by @{highlights.mostViewedPost.author.username}</p>
                                    <p>{highlights.mostViewedPost.views} views</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
