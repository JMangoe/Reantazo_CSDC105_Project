import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Postpage() {
    const navigate = useNavigate();
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    const hasCountedView = useRef(false); //view count lock
    useEffect(() => {
        async function fetchPost() {
        if (!hasCountedView.current) {
            hasCountedView.current = true;

            //increment view count ONCE
            await fetch(`http://localhost:4000/post/${id}/view`, {
            method: "POST",
            });

            await new Promise((res) => setTimeout(res, 300));
        }

        //always fetch post info
        const response = await fetch(`http://localhost:4000/post/${id}`);
        const postInfo = await response.json();
        setPostInfo(postInfo);
        }

        fetchPost();
    }, [id]); 

    if(!postInfo) return '';

    //added delete function
    async function deletePost(postId){
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        const response = await fetch(`http://localhost:4000/post/${postId}`, {
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

    return (
        <div className="post-page fade-in">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
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
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
            </div>

            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
}

//finished/stopped at 3:02:32 / 3:32:09