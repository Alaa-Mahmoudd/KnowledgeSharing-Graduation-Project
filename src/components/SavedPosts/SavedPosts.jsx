import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      try {
        const { data } = await axios.get(
          "https://knowledge-sharing-pied.vercel.app/interaction/saved_posts",
          {
            headers: {
              token: `noteApp__${token}`,
            },
          }
        );
        console.log(data);
        setSavedPosts(data?.posts || []);
      } catch (error) {
        toast.error("Failed to load saved posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Saved Posts</h1>

      {savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
            <div
              key={post._id}
              className="border rounded p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No saved posts yet.</p>
      )}
    </div>
  );
}
