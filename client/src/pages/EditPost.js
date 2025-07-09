import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API_URL;

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch(`${API}/post/${id}`);
                const postInfo = await response.json();
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            } catch (error) {
                toast.error("Failed to fetch post data.");
            }
        }

        fetchPost();
    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();

        if (!files || !files[0]) {
            toast.error("Cover photo is required!");
            return;
        }

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        data.set('file', files[0]);

        try {
            setLoading(true);
            const response = await fetch(`${API}/post`, {
                method: 'PUT',
                body: data,
                credentials: 'include',
            });
            setLoading(false);

            if (response.ok) {
                toast.success("Post updated!");
                setRedirect(true);
            } else {
                const err = await response.json();
                toast.error(err?.error || "Failed to update post.");
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            toast.error("Something went wrong.");
        }
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />;
    }

    return (
        <form onSubmit={updatePost} className="fade-in">
            <input 
                type="text" 
                placeholder="Title" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Summary"
                value={summary} 
                onChange={ev => setSummary(ev.target.value)} 
            />
            <input 
                type="file"
                onChange={ev => setFiles(ev.target.files)} 
            />
            <Editor onChange={setContent} value={content} />
            <button 
                style={{marginTop: '5px'}} 
                disabled={loading}
            >
                {loading ? 'Updating...' : 'Update post'}
            </button>
        </form>
    );
}
