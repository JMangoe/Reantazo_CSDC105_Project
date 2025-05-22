import { Link } from 'react-router-dom';
import logo from '../assets/bro-quote-logo.png';

export default function IntroPage(){
    return (
        <div className="intro-page fade-in">
            <img src={logo} alt="BroQuote Logo" className="intro-logo" />
            <h1>Welcome to BroQuote Blog</h1>
            <p>Write. Reflect. Rebuild</p>
            <Link to="/blogs" className='btn'>Enter</Link>
        </div>
    );
}