import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react'; // added useContext
import logo from '../assets/bro-quote-logo-white.png';
import { LoadingContext } from '../LoadingContext'; // import the context
import { toast } from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL;

export default function IntroPage() {
    const [highlights, setHighlights] = useState(null);
    const { setLoading } = useContext(LoadingContext);
    const backgrounds = [
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092752/peakpx_2_yr38ux.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092753/peakpx_6_fnmwnm.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092753/peakpx_7_czoi97.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092753/peakpx_3_t9etqx.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092753/peakpx_5_wmsiof.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092754/peakpx_4_twkq9k.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092754/peakpx_8_ntwabd.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092752/peakpx_1_fe1wwu.jpg',
    'https://res.cloudinary.com/dsfisnizf/image/upload/v1752092754/peakpx_ysiuop.jpg'
    ]; 

    const [bgIndex, setBgIndex] = useState(0);

    const quoteList = [
        "Keep going. The dark is temporary.",
        "You heal when you stop chasing what cracked you in the first place.",
        "Feel it, but don’t feed it.",
        "One page a day builds a book.",
        "You don’t rise to the occasion. You fall to your preparation.",
        "You don’t need more time. You need fewer excuses.",
        "You’re not living if you’re too busy pleasing everyone else.",
        "No matter how long the dark night seems to be, the sun always shines again.",
        "Start scared. Show up anyway.",
        "Healing is not weakness. It’s strength.",
        "If you change the way you look at things, things you look at change.",
        "Take a break from worrying about what you can't control.",
        "You don’t have to be great to start, but you have to start to be great.",
        "Don’t let today’s struggles make you forget how far you’ve already come.",
        "Death is a reminder to treasure the present.",
        "Your kindness can be the light that someone needs in their darkest moments."
    ];

    const [randomQuote, setRandomQuote] = useState(quoteList[0]);

    const handleNewQuote = () => {
        const newQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
        setRandomQuote(newQuote);
    };

    
    useEffect(() => {
    const interval = setInterval(() => {
        setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 6000); // change every 6 seconds

    return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        setLoading(true);
        fetch(`${API}/posts/highlights`)
            .then(res => res.json())
            .then(data => {
                console.log("Highlights fetched:", data);
                setHighlights(data);
            })
            .catch(err => {
                console.error(err);
                toast.error("Failed to load highlights.");
            })
            .finally(() => setLoading(false));
    }, []);

return (
    <div>

        {/* Hero Section */}
        <div 
            className="intro-page fade-in" 
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                backgroundImage: `url(${backgrounds[bgIndex]})`,
                transition: 'background-image 1s ease-in-out',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                textShadow: '0 2px 5px rgba(0,0,0,0.4)'
            }}
        >
            <div 
                style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '3rem',
                    padding: '3rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    borderRadius: '12px',
                    maxWidth: '1200px',
                    width: '100%',
                    zIndex: 1,
                    flexWrap: 'wrap'
                }}
            >
                {/* Left Column */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <img 
                    src={logo} 
                    alt="BroQuote Logo" 
                    style={{ 
                        maxWidth: '160px', 
                        marginBottom: '1rem',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08) rotate(-1deg)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                    />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Welcome to BroQuote Essays
                    </h1>
                    <p style={{ fontSize: '1rem', marginTop: '1rem', lineHeight: '1.6', color: '#fff' }}>
                        Discover raw essays that speak to healing, hustle, heartbreak — and everything in between.
                    </p>
                    <Link 
                        to="/blogs" 
                        className='btn main-btn' 
                        style={{ 
                            marginTop: '1.5rem', 
                            display: 'inline-block',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: '#000',
                            padding: '0.7rem 1.2rem',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.75)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)'}
                    >
                        Enter Essays
                    </Link>
                </div>

                {/* Right Column (Quote Generator) */}
                <div 
                    style={{ 
                        flex: 1, 
                        minWidth: '300px', 
                        backgroundColor: 'rgba(255,255,255,0.05)', 
                        padding: '2rem', 
                        borderRadius: '12px',
                        backdropFilter: 'blur(6px)',
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                >
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fff' }}>Daily Quote</h3>
                    <p 
                        key={randomQuote} // triggers re-render + fade
                        className="quote-text-fade"
                        style={{ 
                            fontSize: '1.1rem', 
                            fontStyle: 'italic',
                            color: '#ddd',
                            fontFamily: 'inherit',
                            transition: 'opacity 0.5s ease-in-out'
                        }}
                    >
                        {randomQuote}
                    </p>
                    <button 
                        onClick={handleNewQuote} 
                        style={{ 
                            marginTop: '1rem', 
                            backgroundColor: '#fff', 
                            color: '#000', 
                            border: 'none', 
                            padding: '0.5rem 1.2rem', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                    >
                        New Quote
                    </button>
                </div>
            </div>
        </div>



        {/* Website Context / Vision Section */}

        <div className="fade-in" style={{ backgroundColor: '#fdfdfd', padding: '4rem 2rem', textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>What is BroQuote Essays?</h2>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            <strong>BroQuote</strong> (@bro._.quote) started on Instagram to share amazing quotes for people to love, ponder, and be inspired by.  
            Nine months later, it’s grown into a helpful platform — and now, a digital journal of self-growth through essays.
        </p>
        <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            This website is for reflection, discipline, healing, ambition, and everything in between.
            You’re not just reading — you’re rebuilding through words.
        </p>
        </div>

        {/* What Can You Do Section */}
        <div className="fade-in" style={{
            backgroundColor: '#111',
            color: '#fff',
            padding: '4rem 2rem',
            textAlign: 'left',
            maxWidth: '900px',
            margin: '0 auto',
            borderRadius: '12px'
        }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>
                What Can You Do in This Website?
            </h2>
            <ul style={{ fontSize: '1rem', lineHeight: '1.8', paddingLeft: '1.2rem', listStyleType: 'disc' }}>
                <li><strong>Write and post essays</strong> on your thoughts, struggles, wins, and breakthroughs.</li>
                <li><strong>Upload photos</strong> that add context or visual depth to your essays.</li>
                <li><strong>Like</strong> and show support to essays that resonate with you.</li>
                <li><strong>Comment</strong> and connect with other users — leave thoughts, feedback, or encouragement.</li>
            </ul>
            <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#ccc' }}>
                This isn’t just a blog. It’s a brotherhood of reflection and realness.
            </p>
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
                                        src={highlights.latestPost.cover}
                                        alt={highlights.latestPost.title}
                                        loading="lazy"
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
                                    <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                                        {highlights.latestPost.author ? `by @${highlights.latestPost.author.username}` : 'Author unknown'}
                                    </p>

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
                                        src={highlights.mostViewedPost.cover}
                                        alt={highlights.mostViewedPost.title}
                                        loading="lazy"
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
                                    <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>
                                        {highlights.mostViewedPost.author ? `by @${highlights.mostViewedPost.author.username}` : 'Author unknown'}
                                    </p>

                                    <p>{highlights.mostViewedPost.views} views</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}


        {/* Mini About Me Section */}
        <div 
            className="about-section fade-in"
            style={{
                backgroundColor: '#fff',
                padding: '4rem 2rem',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto'
            }}
        >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Thank you for being here.</h2>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>  
            BroQuote Essays is a space for reflection, healing, and honest expression.  
            You’re always welcome here.
            </p>
        </div>

        {/* Footer (Socials) */}
        <footer 
            className="fade-in" 
            style={{ 
                backgroundColor: '#111', 
                color: '#fff', 
                padding: '2rem', 
                textAlign: 'center',
                marginTop: '4rem'
            }}
        >
            <p style={{ marginBottom: '1rem' }}>Connect with me:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com/bro._.quote/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.facebook.com/share/1C9XycJDUY/" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://www.etsy.com/shop/BroQuote" target="_blank" rel="noopener noreferrer">Etsy</a>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>© {new Date().getFullYear()} BroQuote. All rights reserved.</p>
            <p style={{ fontSize: '1.2rem' }}>Write. Reflect. Rebuild.</p>
        </footer>
    </div>
);
}
