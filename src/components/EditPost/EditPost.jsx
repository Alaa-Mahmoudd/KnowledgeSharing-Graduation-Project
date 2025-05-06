import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://knowledge-sharing-pied.vercel.app/post/list_specific/${postId}`
        );

        const post = response.data.post;

        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        toast.error("Failed to load post.");
      }
    };

    fetchPost();
  }, [postId]);

  // Handle form submit with validation
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title && !content && !files) {
      toast.error("No changes detected.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to update a post.");
      return;
    }

    const formData = new FormData();

    if (title) formData.append("title", title);

    if (content) formData.append("content", content);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    setIsLoading(true);

    try {
      await axios.put(
        `https://knowledge-sharing-pied.vercel.app/post/update/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `noteApp__${token}`,
          },
        }
      );
      toast.success("Post updated successfully!");
      navigate("/post");
    } catch (err) {
      toast.error("Failed to update post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-30">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Edit Your Post</h2>
      </div>
      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post Content"
          className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 h-40 resize-none"
        ></textarea>
        <div className="flex justify-between">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="file-input"
          />
          <div className="">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} loading={isLoading} />
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
