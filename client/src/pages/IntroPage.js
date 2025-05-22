import { Link } from 'react-router-dom';

export default function IntroPage(){
    return (
        <div className="intro-page">
            <h1>Welcome to BroQuote Blog</h1>
            <p>Write. Reflect. Rebuild</p>
            <Link to="/blogs" className='btn'>Enter</Link>
        </div>
    );
}