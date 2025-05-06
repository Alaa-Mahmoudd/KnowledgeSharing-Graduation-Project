import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFilePdf, FaBookmark, FaStar, FaEdit } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { ThreeDots } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCommentDots } from "react-icons/fa";
export default function SpecPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // interactions states
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [saveCounts, setSaveCounts] = useState({});
  const [ratingCounts, setRatingCounts] = useState({});

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

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

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
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post. Try again.");
      console.error("Delete post error:", error);
    }
  };
  // ✅ Like
  const handleLikePost = async (postId) => {
    setIsLoadingLike(true);
    if (likeCounts[postId]) {
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
      const updatedLikes = { ...likeCounts, [postId]: true };
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
  // ✅ get like counts and rating counts
  const getPostCounts = async (postId) => {
    try {
      const { data: likeData } = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/likes_count`,
        {
          headers: { token: `noteApp__${token}` },
        }
      );
      const { data: ratingData } = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/ratings_count`,
        {
          headers: { token: `noteApp__${token}` },
        }
      );
      setLikeCounts((prev) => ({ ...prev, [postId]: likeData.likesCount }));
      setRatingCounts((prev) => ({
        ...prev,
        [postId]: ratingData.ratingsCount,
      }));
    } catch (error) {
      console.error("Error fetching like or rating counts:", error);
    }
  };
  const speakText = (title, content) => {
    const text = `${title}. ${content}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
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
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-white  p-6 mb-8 duration-300 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1 flex">
            <div className="mr-1">by</div>
            <span className="font-medium">
              {post.author?.name || "Unknown"}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-2">
            {post.title}
          </h2>

          <p className="text-gray-700 text-base mb-4">{post.content}</p>

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
                  handleDeletePost(post._id);
                }}
                className="cursor-pointer text-gray-500 hover:text-red-800"
                title="Delete"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>

          {post.files?.urls?.length > 0 && (
            <div className="mt-4">
              {post.files.urls.map((file) => (
                <a
                  key={file._id}
                  href={file.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:underline"
                >
                  <FaFilePdf className="mr-2" />
                  View Attached File
                </a>
              ))}
            </div>
          )}
        </div>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-48 h-32 object-cover rounded-md"
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
