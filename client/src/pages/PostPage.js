import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

const API = process.env.REACT_APP_API_URL;

export default function Postpage() {
    const navigate = useNavigate();
    const [postInfo, setPostInfo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    const hasCountedView = useRef(false); //view count lock
    useEffect(() => {
        async function fetchPost() {
            if (!hasCountedView.current) {
                hasCountedView.current = true;

                //increment view count ONCE
                await fetch(`${API}/post/${id}/view`, {
                method: "POST",
                });

                await new Promise((res) => setTimeout(res, 300));
            }

            //always fetch post info
            const response = await fetch(`${API}/post/${id}`);
            const postInfo = await response.json();
            setPostInfo(postInfo);
            setLikeCount(postInfo.likes || 0);

            //check if the user has liked the post
            if (userInfo){
                const likeCheck = await fetch(`${API}/post/${id}/like/check`, {
                    credentials: 'include',
                });
                const likeData = await likeCheck.json();
                setIsLiked(likeData.isLiked);
            }

            //fetch comments
            const commentsResponse = await fetch(`${API}/post/${id}/comments`);
            const commentsData = await commentsResponse.json();
            setComments(commentsData);
        }

        fetchPost();
    }, [id, userInfo]); 

    if(!postInfo) return '';

    //added delete function
    async function deletePost(postId){
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        const response = await fetch(`${API}/post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            alert("Post deleted!");
            navigate('/blogs');
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    }

    // Like/unlike post function
    async function handleLike() {
        if (!userInfo) {
            alert('You need to login to like posts');
            return;
        }

        try {
            const endpoint = isLiked ? 'unlike' : 'like';
            const response = await fetch(`${API}/post/${id}/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(!isLiked);
                setLikeCount(data.likes);
            }
        } catch (err) {
            console.error("Like error:", err);
        }
    }

    // Add comment function
    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!userInfo) {
            alert('You need to login to comment');
            return;
        }

        if (!commentContent.trim()) {
            alert('Comment cannot be empty');
            return;
        }

        const response = await fetch(`${API}/post/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: commentContent }),
            credentials: 'include',
        });

        if (response.ok) {
            const newComment = await response.json();
            setComments([...comments, newComment]);
            setCommentContent("");
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    }

    // Delete comment function
    async function deleteComment(commentId) {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;

        const response = await fetch(`${API}/comment/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setComments(comments.filter(comment => comment._id !== commentId));
        } else {
            const data = await response.json();
            alert(`Error: ${data.error}`);
        }
    }

    return (
        <div className="post-page fade-in">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            <div className="like-section">
                <button 
                    onClick={handleLike} 
                    className={`like-btn ${isLiked ? 'liked' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {likeCount}
                </button>
            </div>
            {userInfo?.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                    </Link>
                    <button className="delete-btn" onClick={() => deletePost(postInfo._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                    </button>
                </div>
            )}
            <div className="image">
                <img src={`${API}/${postInfo.cover}`} alt=""/>
            </div>

            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
            
            <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                
                {userInfo && (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea 
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Write your comment..."
                            rows="3"
                        />
                        <button type="submit" className="submit-comment-btn">Post Comment</button>
                    </form>
                )}
                
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment._id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">@{comment.author.username}</span>
                                <span className="comment-date">
                                    {formatISO9075(new Date(comment.createdAt))}
                                </span>
                                {(userInfo?.id === comment.author._id || userInfo?.id === postInfo.author._id) && (
                                    <button 
                                        onClick={() => deleteComment(comment._id)}
                                        className="delete-comment-btn"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="comment-content">{comment.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

//finished/stopped at 3:02:32 / 3:32:09