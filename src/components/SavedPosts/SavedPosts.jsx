import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner"; // ThreeDots spinner

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const fetchSavedPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://knowledge-sharing-pied.vercel.app/interaction/saved_posts",
        {
          headers: {
            token: user?.token,
          },
        }
      );

      setSavedPosts(response.data);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to load saved posts.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchSavedPosts();
    }
  }, [user]);

  return (
    <div className="p-4 bg-white min-h-[200px]">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ThreeDots
            height="60"
            width="60"
            radius="9"
            color="#000"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : savedPosts.length > 0 ? (
        <ul className="space-y-4">
          {savedPosts.map((post) => (
            <li key={post._id} className="border p-3 rounded shadow-sm">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No saved posts found.</p>
      )}
    </div>
  );
};

export default SavedPosts;
