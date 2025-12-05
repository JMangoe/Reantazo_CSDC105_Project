import { getSmartDate } from "./utils/formatDate";
import { Link } from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, author, views, likeCount, commentCount}) {
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
            <div className="engagement-metrics">
                <span className="likes">❤️ {likeCount ?? 0}</span>
                <span className="comments">💬 {commentCount ?? 0}</span>
            </div>
            <p className="summary">{summary}</p>
        </div>
    </div>
    );
}