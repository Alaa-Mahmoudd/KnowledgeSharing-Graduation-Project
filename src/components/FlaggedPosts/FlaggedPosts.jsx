import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const FlaggedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRemove, setLoadingRemove] = useState("");
  const [loadingDeactivate, setLoadingDeactivate] = useState("");
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    axios
      .get("https://knowledge-sharing-pied.vercel.app/admin/flaggedPosts", {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const flaggedPosts = res.data.results.flaggedPosts;
        setPosts(flaggedPosts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch flagged posts");
        toast.error("Failed to fetch flagged posts");
        setLoading(false);
      });
  }, [token]);

  const removePost = async (postId) => {
    setLoadingRemove(postId);
    try {
      await axios.delete(
        `https://knowledge-sharing-pied.vercel.app/admin/remove-post/${postId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success(" Post removed successfully");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error("Failed to remove post");
    } finally {
      setLoadingRemove("");
    }
  };

  const deactivateUser = async (postId) => {
    setLoadingDeactivate(postId);
    try {
      await axios.put(
        `https://knowledge-sharing-pied.vercel.app/admin/deactivate_user/${postId}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success(" User deactivated successfully");
    } catch (err) {
      toast.error(" Failed to deactivate user");
    } finally {
      setLoadingDeactivate("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" color="#000" />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-3xl font-bold text-black">
          No Flagged Posts Available
        </h2>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Flagged Posts</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post._id}
            className="border border-gray-300 rounded p-4 shadow-sm"
          >
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted on: {new Date(post.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">Post ID: {post._id}</p>

            <div className="flex space-x-4">
              <button
                onClick={() => removePost(post._id)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                disabled={loadingRemove === post._id}
              >
                {loadingRemove === post._id ? (
                  <ThreeDots height="20" width="20" color="#fff" />
                ) : (
                  "Remove Post"
                )}
              </button>
              <button
                onClick={() => deactivateUser(post._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loadingDeactivate === post._id}
              >
                {loadingDeactivate === post._id ? (
                  <ThreeDots height="20" width="20" color="#fff" />
                ) : (
                  "Deactivate User"
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FlaggedPosts;
