import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;


export default function Post({_id, title, summary, cover, content, createdAt, author, views}) {
    return (
    <div className="post fade-in">
        <div className="image">
            <Link to={`/post/${_id}`}>
                <img src={`${API}/`+cover} alt=""/>
            </Link>
            
        </div>
        <div className="texts">
            <Link to={`/post/${_id}`}>
                <h2>{title}</h2>
            </Link>
            <p className="info">
                <a className="author">{author?.username || "Unknown Author"}</a>
                <time>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</time>
                <span className="views">👁 {views || 0} views</span>
            </p>
            <p className="summary">{summary}</p>
        </div>
    </div>
    );
}