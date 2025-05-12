import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaThumbsUp,
  FaRegThumbsUp,
  FaComment,
  FaBookmark,
  FaStar,
  FaSearch,
  FaTimes,
  FaMicrophone,
  FaMicrophoneSlash
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgeCorner() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // New Post States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://knowledge-sharing-pied.vercel.app/post/list"
      );
      setPosts(data.posts || []);
      setFilteredPosts(data.posts || []);
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
      await axios.post(
        "https://knowledge-sharing-pied.vercel.app/post/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
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
      setSearchQuery(transcript); // auto-triggers filtering
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Real-time filtering on searchQuery change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.author?.name &&
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

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
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <div className="bg-[#E3ECE7] p-4 flex-1 mr-4">
          <input
            type="text"
            placeholder="Write Your Post ...."
            className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-700 focus:outline-none cursor-pointer"
            readOnly
            onClick={() => setShowForm(true)}
          />
        </div>

        <div className="relative flex items-center gap-2">
          <AnimatePresence>
            {showSearch && (
              <motion.div
                className="flex items-center bg-white rounded-full shadow-sm border border-gray-300 px-4 py-2"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="border-none focus:ring-0 focus:outline-none w-64 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showSearch && (
            <motion.button
              onClick={() => setShowSearch(true)}
              className="p-3 bg-[#E3ECE7] rounded-full text-gray-600 hover:text-blue-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch size={18} />
            </motion.button>
          )}

          {/* Voice Search Button */}
          <motion.button
            onClick={handleVoiceSearch}
            className={`p-3 rounded-full ${isListening ? "bg-red-100 text-red-600" : "bg-[#E3ECE7] text-gray-600"
              } hover:scale-110 transition`}
            whileTap={{ scale: 0.9 }}
          >
            {isListening ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <motion.div
            className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
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
          </motion.div>
        </div>
      )}

      {/* Posts List */}
      <div className={`max-w-4xl mx-auto ${showForm ? "blur-sm" : ""}`}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-[#E3ECE7] p-4 rounded-lg shadow-md mb-4"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-lg font-semibold capitalize">{post.title}</h2>
              <p className="text-gray-600">By {post.author?.name || "Unknown"}</p>
              <p className="mt-1 text-gray-500 text-sm">{post.description || ""}</p>
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
            </motion.div>
          ))
        ) : (
          <div className="bg-[#E3ECE7] p-8 rounded-lg text-center">
            <p className="text-gray-600">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : "No posts available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
