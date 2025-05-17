import React, { useEffect, useRef, useState } from "react";
import CategoriesSidebar from "../CategoriesSidebar/CategoriesSidebar.jsx";
import axios from "axios";
import {
  FaFilePdf,
  FaRegCommentDots,
  FaBookmark,
  FaStar,
  FaEdit,
  FaSearch,
  FaMicrophoneSlash,
  FaMicrophone,
  FaTimes,
  FaVolumeUp,
  FaPlus,
  FaFileAlt,
  FaDownload,
  FaHeart,
} from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Post() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [saveCounts, setSaveCounts] = useState({});
  const [ratingCounts, setRatingCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Color scheme
  const colors = {
    primary: "#4F46E5",
    secondary: "#10B981",
    accent: "#F59E0B",
    background: "#F9FAFB",
    card: "#FFFFFF",
    text: "#1F2937",
    muted: "#6B7280",
  };

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
      setFilteredPosts(data.posts || []);
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

  // Speech synthesis
  const speakText = (title, content) => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const text = `${title}. ${content}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Voice Search using Web Speech API
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      toast.success(`Searching for: ${transcript}`);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      toast.error("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.warn("Voice search not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast.info("Listening... Speak now");
    }
  };

  // Real-time filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (post.title && post.title.toLowerCase().includes(searchLower)) ||
          (post.content && post.content.toLowerCase().includes(searchLower)) ||
          (post.author?.name && post.author.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

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





  // ✅ Loading
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color={colors.primary}
          ariaLabel="loading"
        />
      </motion.div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </motion.div>
    );
  }


  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      {/* Main Layout Container */}
      <div className="flex flex-col md:flex-row gap-19">
        {/* Categories Sidebar (Fixed Left) */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <CategoriesSidebar />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">
          {/* Premium Search Header */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            {/* Search Bar + Voice Button */}
            <div className="flex items-center flex-1 w-full gap-2">
              <motion.div
                whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                className="flex items-center w-full bg-white rounded-lg shadow-xs border border-gray-200 hover:border-indigo-300 px-4 py-2 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200/50"
              >
                <FaSearch className="text-gray-400 mr-3" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full border-none focus:ring-0 focus:outline-none text-sm placeholder-gray-400 bg-transparent"
                  autoFocus
                />
                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={12} />
                  </motion.button>
                )}
              </motion.div>

              <motion.button
                onClick={handleVoiceSearch}
                className={`p-2.5 rounded-lg ${isListening
                    ? "bg-red-100 text-red-500 shadow-sm"
                    : "text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaMicrophoneSlash size={16} />
                  </motion.div>
                ) : (
                  <FaMicrophone size={16} />
                )}
              </motion.button>
            </div>

            {/* Create Post Button */}
            <motion.button
              onClick={() => navigate("/addPost")}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-xs hover:shadow-sm whitespace-nowrap"
            >
              <FaPlus size={14} />
              <span>Create Post</span>
            </motion.button>
          </motion.div>

          {/* Posts List */}
          <div className="space-y-5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-xs border border-gray-100 cursor-pointer transition-all duration-300 hover:border-indigo-100"
                >
                  <div className="flex flex-col md:flex-row">
                    {post.thumbnail && (
                      <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                        <motion.img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.4 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
                      </div>
                    )}

                    <div className={`${post.thumbnail ? "md:w-3/5" : "w-full"} p-5`}>
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      {post.files?.urls?.length > 0 && (
                        <div className="mb-4">
                          {post.files.urls.slice(0, 2).map((file) => (
                            <a
                              key={file._id}
                              href={file.secure_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-indigo-600 hover:underline text-xs mr-3 mb-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaFilePdf className="mr-1" size={12} />
                              {file.original_filename?.slice(0, 15) || "File"}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePost(post._id);
                            }}
                            className="flex items-center text-gray-500 hover:text-indigo-600 text-md relative"
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.span
                              key={`like-${post._id}-${likeCounts[post._id] || 0}`}
                              initial={{ scale: 1 }}
                              animate={{ scale: likeCounts[post._id] ? [1, 1.3, 1] : 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center"
                            >
                              <BiSolidLike
                                className={`mr-1 ${likeCounts[post._id] ? "text-indigo-600" : ""}`}
                                size={16}
                              />
                              <span className="ml-1">{likeCounts[post._id] || 0}</span>
                            </motion.span>
                            <motion.span
                              className="absolute -top-2 -right-2"
                              animate={{
                                scale: likeCounts[post._id] ? [0, 1.5, 1] : 0,
                                opacity: likeCounts[post._id] ? [0, 1, 1] : 0
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaHeart className="text-red-500 text-xs" />
                            </motion.span>
                          </motion.button>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/post/${post._id}#comments`);
                            }}
                            className="text-gray-500 hover:text-indigo-600 relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaRegCommentDots size={16} />
                          </motion.button>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(post.title, post.content);
                            }}
                            className="text-gray-500 hover:text-indigo-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaVolumeUp size={16} />
                          </motion.button>
                        </div>

                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRatePost(post._id, i + 1);
                              }}
                              className={`text-md ${ratingCounts[post._id] > i ? "text-yellow-400" : "text-gray-300"}`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.span
                                animate={{
                                  scale: ratingCounts[post._id] === i + 1 ? [1, 1.3, 1] : 1,
                                  rotate: ratingCounts[post._id] === i + 1 ? [0, 20, -20, 0] : 0
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                <FaStar size={16} />
                              </motion.span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100"
              >
                <div className="max-w-md mx-auto">
                  <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
                    <FaSearch className="text-indigo-600" size={20} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? "No posts found" : "No posts yet"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try different keywords.`
                      : "Be the first to share your knowledge!"}
                  </p>
                  <button
                    onClick={() => navigate("/addPost")}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700"
                  >
                    Create Post
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-sm border border-gray-100 text-sm"
      />
    </div>
  );
};

