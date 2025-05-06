import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFilePdf,
  FaRegCommentDots,
  FaBookmark,
  FaStar,
  FaEdit,
} from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Post() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [saveCounts, setSaveCounts] = useState({});
  const [ratingCounts, setRatingCounts] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Load interactions from localStorage
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const storedSaves = JSON.parse(localStorage.getItem("saves")) || {};
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    setLikeCounts(storedLikes);
    setSaveCounts(storedSaves);
    setRatingCounts(storedRatings);
  }, []);

  // ✅ get all posts
  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://knowledge-sharing-pied.vercel.app/post/list"
      );
      setPosts(data.posts || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  // ✅ Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://knowledge-sharing-pied.vercel.app/post/delete/${postId}`,
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );
      toast.success("Post deleted successfully!");
      await getAllPosts();
    } catch (error) {
      toast.error("Failed to delete post. Try again.");
      console.error("Delete post error:", error);
    }
  };

  // ✅ Like
  const handleLikePost = async (postId) => {
    setIsLoadingLike(true);

    if (likeCounts[postId] >= 1) {
      toast.info("You already liked this post.");
      setIsLoadingLike(false);
      return;
    }

    try {
      await axios.post(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/like`,
        {},
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );

      const updatedLikes = {
        ...likeCounts,
        [postId]: (likeCounts[postId] || 0) + 1,
      };

      setLikeCounts(updatedLikes);
      localStorage.setItem("likes", JSON.stringify(updatedLikes));

      toast.success("Post liked!");
    } catch (error) {
      toast.error("Failed to like post.");
    } finally {
      setIsLoadingLike(false);
    }
  };

  // ✅ Save
  const handleSavePost = async (postId) => {
    setIsLoadingSave(true);
    if (saveCounts[postId]) {
      toast.info("You already saved this post.");
      setIsLoadingSave(false);
      return;
    }
    try {
      await axios.post(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/save`,
        {},
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );
      const updatedSaves = { ...saveCounts, [postId]: true };
      setSaveCounts(updatedSaves);
      localStorage.setItem("saves", JSON.stringify(updatedSaves));
      toast.success("Post saved!");
    } catch (error) {
      toast.error("Failed to save post.");
    } finally {
      setIsLoadingSave(false);
    }
  };

  // ✅ Rate
  const handleRatePost = async (postId, rating) => {
    setIsLoadingRate(true);
    if (ratingCounts[postId]) {
      toast.info("You already rated this post.");
      setIsLoadingRate(false);
      return;
    }
    try {
      await axios.post(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/rate`,
        { rating },
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );
      const updatedRatings = { ...ratingCounts, [postId]: rating };
      setRatingCounts(updatedRatings);
      localStorage.setItem("ratings", JSON.stringify(updatedRatings));
      toast.success("Post rated!");
    } catch (error) {
      toast.error("Failed to rate post.");
    } finally {
      setIsLoadingRate(false);
    }
  };
  // ✅ get like counts for all posts
  useEffect(() => {
    posts.forEach((post) => {
      getLikesCount(post._id);
    });
  }, [posts]);
  // ✅ get like counts
  const getLikesCount = async (postId) => {
    try {
      const response = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/likes_count`
      );
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: response.data.likesCount,
      }));
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  // Fetch ratings count for a post
  const getRatingsCount = async (postId) => {
    try {
      const response = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/ratings_count`
      );
      setRatingCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: response.data.ratingCounts,
      }));
    } catch (error) {
      console.error("Error fetching ratings count:", error);
    }
  };
  // ✅ Get user info from localStorage (assumed token contains user info)
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode the JWT to get user data
      return userData; // Assuming it contains user info like id
    }
    return null;
  };

  const user = getUserFromToken();
  const speakText = (title, content) => {
    const text = `${title}. ${content}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots visible={true} height="80" width="80" color="#000" />
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <input
        type="text"
        placeholder="Write your post..."
        readOnly
        onClick={() => navigate("/addPost")}
        className="w-full mb-8 px-4 py-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => navigate(`/post/${post._id}`)}
          className="bg-white border-b border-gray-200 p-6 mb-8 duration-300 flex flex-col md:flex-row justify-between items-start gap-6 cursor-pointer"
        >
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1 flex">
              <div className="mr-1">by</div>
              <span className="font-medium">
                {post.author?.name || "Unknown"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-2">
              {post.title}
            </h2>
            <p className="text-gray-700 text-base mb-4">
              {post.content.length > 150
                ? post.content.slice(0, 150) + "..."
                : post.content}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakText(post.title, post.content);
              }}
              className="text-gray-500 hover:text-blue-800"
            >
              <span className="cursor-pointer">🎙️ Read Aloud</span>
            </button>

            <div className="flex justify-between text-gray-500 mt-4">
              <div className="flex items-center text-sm gap-4">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    const userRating = prompt("Rate this post from 1 to 5:");
                    const ratingValue = parseInt(userRating);
                    if (ratingValue >= 1 && ratingValue <= 5) {
                      handleRatePost(post._id, ratingValue);
                    } else {
                      toast.error("Invalid rating. Please enter 1 to 5.");
                    }
                  }}
                  className="flex cursor-pointer items-center gap-1"
                >
                  <FaStar
                    className={`text-gray-500 ${
                      ratingCounts[post._id] ? "text-yellow-400" : ""
                    }`}
                    title="Rate"
                  />
                  <span className="text-black mr-5">
                    {ratingCounts[post._id] || 0}
                  </span>
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikePost(post._id);
                  }}
                  className={`flex cursor-pointer items-center gap-1 ${
                    likeCounts[post._id] ? "text-blue-500" : ""
                  }`}
                  title="Like"
                >
                  <BiSolidLike />
                  <span className="text-black">
                    {likeCounts[post._id] || 0}
                  </span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Comments coming soon!");
                  }}
                  className="flex items-center cursor-pointer gap-1"
                  title="Comment"
                >
                  <FaRegCommentDots />
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSavePost(post._id);
                  }}
                  className={`cursor-pointer flex items-center gap-1 ${
                    saveCounts[post._id] ? "text-green-500" : ""
                  }`}
                  title="Save"
                >
                  <FaBookmark />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user?.id !== post.author?._id) {
                      toast.error("You can't update a post that is not yours.");
                      return;
                    }
                    navigate(`/editPost/${post._id}`);
                  }}
                  className="cursor-pointer text-gray-500 hover:text-blue-800"
                  title="Edit"
                >
                  <FaEdit size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user?.id !== post.author?._id) {
                      toast.error("You can't delete a post that is not yours.");
                      return;
                    }
                    handleDeletePost(post._id);
                  }}
                  className="cursor-pointer text-gray-500 hover:text-red-800"
                  title="Delete"
                >
                  <MdDelete size={20} />
                </button>
              </div>
            </div>

            {/* Files */}
            {post.files?.urls?.length > 0 && (
              <div className="mt-4">
                {post.files.urls.map((file) => (
                  <a
                    key={file._id}
                    href={file.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaFilePdf className="mr-2" />
                    View Attached File
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-48 h-32 object-cover rounded-md"
            />
          )}
        </div>
      ))}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
