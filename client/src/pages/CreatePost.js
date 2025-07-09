import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { toast } from "react-hot-toast";


const API = process.env.REACT_APP_API_URL;

export default function CreatePost() {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect] = useState(false);
    const [loading, setLoading] = useState(false);

    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        if (!files || !files[0]) {
            toast.error("Cover photo is required!");
            return;
        }

        setLoading(true);

        const response = await fetch(`${API}/post`, {
            method: 'POST',
            body: data, 
            credentials: 'include',
        });

        setLoading(false);

        if (response.ok) {
            toast.success("Post created successfully!");
            setRedirect(true);
        } else {
            try {
                const err = await response.json();
                toast.error(err?.error || "Failed to create post.");
            } catch {
                toast.error("Unexpected error occurred.");
            }
        }
    }


    if (redirect) {
        return <Navigate to={'/blogs'} />;
    }

    return (
        <form onSubmit={createNewPost} className="fade-in">
            <input type="text" 
                    placeholder={'Title'} 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} />
            <input type="text" 
                    placeholder={'Summary'}
                    value={summary} 
                    onChange={ev => setSummary(ev.target.value)} />
            <input type="file"
                    onChange={ev => setFiles(ev.target.files)} />
            <Editor onChange={setContent} value={content}/>
            <button 
                style={{ marginTop: '5px' }} 
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Create post'}
            </button>
        </form> 
    );
}