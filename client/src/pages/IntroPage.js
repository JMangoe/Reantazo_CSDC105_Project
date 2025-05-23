import { Link } from 'react-router-dom';
import logo from '../assets/bro-quote-logo.png';

export default function IntroPage(){
    return (
        <div className="intro-page fade-in">
            <img src={logo} alt="BroQuote Logo" className="intro-logo" />
            <h1>Welcome to BroQuote Essays</h1>
            <p>Write. Reflect. Rebuild</p>

            <Link to="/blogs" className='btn main-btn'>Enter Essays</Link>

            <div className='social-buttons'>
                <a href="https://www.instagram.com/bro._.quote/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.facebook.com/share/1C9XycJDUY/" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://www.etsy.com/shop/BroQuote" target="_blank" rel="noopener noreferrer">Etsy</a>
            </div>
        </div>
    );
}