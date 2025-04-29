import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrashAlt,
  FaThumbsUp,
  FaCommentAlt,
  FaSave,
  FaStar,
} from "react-icons/fa";

export default function SpecPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/post/list_specific/${id}`
      );
      setPost(data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load the post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleUpdate = () => {
    // Add your update logic here (e.g., redirect to an edit page)
    toast.info("Update feature is not implemented yet.");
  };

  const handleDelete = () => {
    // Add your delete logic here
    toast.warning("Delete feature is not implemented yet.");
  };

  const handleLike = () => {
    // Add your like logic here
    toast.success("Liked the post!");
  };

  const handleComment = () => {
    // Add your comment logic here (e.g., open comment section)
    toast.info("Comment feature is not implemented yet.");
  };

  const handleSave = () => {
    // Add your save logic here
    toast.success("Post saved!");
  };

  const handleRate = () => {
    // Add your rating logic here
    toast.info("Rating feature is not implemented yet.");
  };

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
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-[#E3ECE7] rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">By {post.author?.name || "Unknown"}</p>
      <p className="text-gray-700 mb-4">{post.content}</p>

      {/* Action Icons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleUpdate}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt size={20} />
        </button>
        <button
          onClick={handleLike}
          className="text-green-500 hover:text-green-700"
        >
          <FaThumbsUp size={20} />
        </button>
        <button
          onClick={handleComment}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaCommentAlt size={20} />
        </button>
        <button
          onClick={handleSave}
          className="text-yellow-500 hover:text-yellow-700"
        >
          <FaSave size={20} />
        </button>
        <button
          onClick={handleRate}
          className="text-purple-500 hover:text-purple-700"
        >
          <FaStar size={20} />
        </button>
      </div>

      {post.files && post.files.length > 0 && (
        <div>
          <h4 className="font-semibold">Attached Files:</h4>
          <ul className="list-disc pl-5">
            {post.files.map((file, index) => (
              <li key={index}>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
