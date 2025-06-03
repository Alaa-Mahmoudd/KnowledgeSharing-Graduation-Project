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
  const [likeCounts, setLikeCounts] = useState({});
  const [saveCounts, setSaveCounts] = useState({});
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem("comments");
    return savedComments ? JSON.parse(savedComments) : {};
  });
  const [text, setText] = useState("");
  const [parentId, setParentId] = useState(null);
  const [showComments, setShowComments] = useState({});
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

  // Load interactions from localStorage
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    const storedSaves = JSON.parse(localStorage.getItem("saves")) || {};
    setLikeCounts(storedLikes);
    setSaveCounts(storedSaves);
  }, []);

  // Get all posts
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
    const loadInitialData = async () => {
      await getAllPosts();

      // Load comments for all posts initially
      const initialComments =
        JSON.parse(localStorage.getItem("comments")) || {};
      setComments(initialComments);

      // Fetch fresh comments for all posts
      posts.forEach((post) => {
        fetchComments(post._id);
      });
    };

    loadInitialData();
  }, []);

  // Voice Search using Web Speech API
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
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
          (post.author?.name &&
            post.author.name.toLowerCase().includes(searchLower))
        );
      });
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  // Handle delete post
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

  // Handle like post
  const handleLikePost = async (postId, e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login to like posts");
      navigate("/login");
      return;
    }

    setIsLoadingLike(true);

    try {
      const response = await axios.post(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/like`,
        {},
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );

      setLikeCounts((prev) => ({
        ...prev,
        [postId]: response.data.likesCount,
      }));

      localStorage.setItem(
        "likes",
        JSON.stringify({
          ...likeCounts,
          [postId]: response.data.likesCount,
        })
      );

      toast.success(response.data.message || "Post liked!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post.");
    } finally {
      setIsLoadingLike(false);
    }
  };

  // Handle save post
  const handleSavePost = async (postId, e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Please login to save posts");
      navigate("/login");
      return;
    }

    setIsLoadingSave(true);
    try {
      const response = await axios.post(
        `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/save`,
        {},
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );

      setSaveCounts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      toast.success(
        saveCounts[postId]
          ? "Post removed from saved!"
          : "Post saved successfully!"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save post.");
    } finally {
      setIsLoadingSave(false);
    }
  };

  // Get like counts for all posts
  useEffect(() => {
    posts.forEach((post) => {
      getLikesCount(post._id);
    });
  }, [posts]);

  // Get like counts
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

  // Get user info from token
  const getUserFromToken = () => {
    if (!token) return null;
    try {
      const userData = JSON.parse(atob(token.split(".")[1]));
      return userData;
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };
  const user = getUserFromToken();

  const speakText = (title, content) => {
    if ("speechSynthesis" in window) {
      const text = `${title}. ${content}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.pitch = 1;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.warning("Text-to-speech not supported in your browser");
    }
  };

  // Comments functions
  const toggleComments = async (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (
      !showComments[postId] &&
      (!comments[postId] || comments[postId].length === 0)
    ) {
      await fetchComments(postId);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/comment/${postId}/get`
      );

      setComments((prev) => {
        const newComments = {
          ...prev,
          [postId]: res.data.comments || [],
        };
        localStorage.setItem("comments", JSON.stringify(newComments));
        return newComments;
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!token) {
      toast.error("Please login to comment");
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(
        `https://knowledge-sharing-pied.vercel.app/comment/${postId}/add`,
        {
          text,
          parent_comment: parentId || null,
        },
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );

      setText("");
      setParentId(null);

      setComments((prev) => {
        const newComments = {
          ...prev,
          [postId]: [data.comment, ...(prev[postId] || [])],
        };
        localStorage.setItem("comments", JSON.stringify(newComments));
        return newComments;
      });

      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId, postId) => {
    if (!token) {
      return;
    }

    try {
      await axios.delete(
        `https://knowledge-sharing-pied.vercel.app/comment/${commentId}/delete`,
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );

      // Update comments state
      setComments((prev) => {
        const updatedComments = {
          ...prev,
          [postId]: prev[postId].filter((comment) => comment._id !== commentId),
        };
        localStorage.setItem("comments", JSON.stringify(updatedComments));
        return updatedComments;
      });

      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const renderComments = (commentsArray, postId, parent = null) => {
    if (!commentsArray) return null;

    return commentsArray
      .filter((c) => c.parent_comment === parent)
      .map((c) => (
        <div key={c._id} className={`ml-${parent ? "6" : "0"} mt-4`}>
          <div className="flex gap-3 items-start">
            <div className="bg-purple-700 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
              {c.userId?.username?.charAt(0) || "U"}
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 w-full relative">
              <p className="text-sm pr-6">{c.text}</p>

              {user?.id === c.userId?._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteComment(c._id, postId);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Delete comment"
                >
                  Delete
                </button>
              )}

              {renderComments(commentsArray, postId, c._id)}
            </div>
          </div>
        </div>
      ));
  };

  // Loading
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

  // Error
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
      <div className="flex flex-col md:flex-row gap-19">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full md:w-64 flex-shrink-0"
        >
          <CategoriesSidebar />
        </motion.div>

        <div className="flex-1 space-y-4">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                    }}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={12} />
                  </motion.button>
                )}
              </motion.div>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVoiceSearch();
                }}
                className={`p-2.5 rounded-lg ${
                  isListening
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

            <motion.button
              onClick={() => navigate("/addPost")}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium shadow-xs hover:shadow-sm whitespace-nowrap"
            >
              <FaPlus size={14} />
              <span>Create Post</span>
            </motion.button>
          </motion.div>

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
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-xs border border-gray-100 transition-all duration-300 hover:border-indigo-100"
                >
                  <div className="flex flex-col md:flex-row">
                    {post.thumbnail && (
                      <div
                        className="md:w-2/5 h-48 md:h-auto relative overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
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

                    <div
                      className={`${
                        post.thumbnail ? "md:w-3/5" : "w-full"
                      } p-5`}
                    >
                      <div
                        className="flex items-center mb-3 cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                          {post.author?.name?.charAt(0) || "U"}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <h2
                        className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
                        {post.title}
                      </h2>

                      <p
                        className="text-gray-600 text-sm mb-4 line-clamp-3 cursor-pointer"
                        onClick={() => navigate(`/post/${post._id}`)}
                      >
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
                              toggleComments(post._id);
                            }}
                            className="flex items-center cursor-pointer gap-1"
                            title="Comment"
                          >
                            <FaRegCommentDots />
                            <span className="text-black">
                              {comments[post._id]?.length || 0}
                            </span>
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
                            {saveCounts[post._id] && (
                              <span className="text-black">Saved</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {user?.id === post.author?._id && (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {showComments[post._id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <div className="border-t border-gray-200 pt-4">
                              <form
                                onSubmit={(e) => {
                                  e.stopPropagation();
                                  handleAddComment(e, post._id);
                                }}
                                className="mb-4"
                              >
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                  >
                                    Comment
                                  </button>
                                </div>
                              </form>

                              <div className="mb-4">
                                {renderComments(comments[post._id], post._id)}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
}
