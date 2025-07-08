import { getSmartDate } from "./utils/formatDate";
import { Link } from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, author, views}) {
    return (
    <div className="post fade-in">
        <div className="image">
            <Link to={`/post/${_id}`}>
                <img src={cover} alt="" loading="lazy"/>
            </Link>
            
        </div>
        <div className="texts">
            <Link to={`/post/${_id}`}>
                <h2>{title}</h2>
            </Link>
            <p className="info">
                <a className="author">{author?.username || "Unknown Author"}</a>
                <time>{getSmartDate(createdAt)}</time>
                <span className="views">👁 {views || 0} views</span>
            </p>
            <p className="summary">{summary}</p>
        </div>
    </div>
    );
}