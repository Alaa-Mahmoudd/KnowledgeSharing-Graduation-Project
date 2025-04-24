import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaComment,
  FaBookmark,
  FaStar,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

export default function KnowledgeCorner() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // New Post States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://knowledge-sharing-pied.vercel.app/post/list"
      );
      setPosts(data.posts || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching Posts:", error);
      setError("Failed to load Posts. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const { data } = await axios.post(
        "https://knowledge-sharing-pied.vercel.app/post/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Reset form and refresh posts
      setShowForm(false);
      setTitle("");
      setContent("");
      setFiles([]);
      getAllPosts();
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Error adding post. Please try again.");
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots visible={true} height="80" width="80" color="#000" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 mt-6 relative">
      {/* Open Post Modal */}
      <div className="bg-[#E3ECE7] p-4 max-w-4xl mx-auto mb-10 ">
        <input
          type="text"
          placeholder="Write Your Post ...."
          className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-700 focus:outline-none cursor-pointer"
          readOnly
          onClick={() => setShowForm(true)}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Create New Post
            </h2>
            <form>
              <input
                type="text"
                placeholder="Post Title"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Post Content"
                rows="4"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                type="file"
                className="mb-6"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition"
                  onClick={handleAddPost}
                >
                  Post
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className={`max-w-4xl mx-auto ${showForm ? "blur-sm" : ""}`}>
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-[#E3ECE7] p-4 rounded-lg shadow-md mb-4"
          >
            <h2 className="text-lg font-semibold capitalize">{post.title}</h2>
            <p className="text-gray-600">By {post.author?.name || "Unknown"}</p>
            <p className="mt-1 text-gray-500 text-sm">
              {post.description || ""}
            </p>
            <p className="mt-2 text-gray-700">{post.content}</p>

            {post.files?.urls?.length > 0 && (
              <div className="mt-3">
                {post.files.urls.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm block"
                  >
                    📎 View Attachment
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center mt-4 gap-4 text-gray-600">
              <span className="flex items-center gap-1 text-blue-500">
                <FaRegThumbsUp /> {post.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaComment /> {post.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaBookmark /> {post.saves_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-500" /> {post.ratings_count || 0}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
