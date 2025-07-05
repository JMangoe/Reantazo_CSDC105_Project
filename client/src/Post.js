import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;


export default function Post({_id, title, summary, cover, content, createdAt, author, views, likes=[], comments=[]}) {
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
                <time>{formatISO9075(new Date(createdAt))}</time>
                <span className="views">👁 {views || 0} views</span>
            </p>
            <p className="summary">{summary}</p>

            <div className="engagement-metrics">
                <span className="likes">♥️ {likes?.length || 0}</span>
                <span className="comments">💬 {comments?.length || 0}</span>
            </div>
        </div>
    </div>
    );
}