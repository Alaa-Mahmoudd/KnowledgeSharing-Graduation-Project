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
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem("comments");
    return savedComments ? JSON.parse(savedComments) : {};
  });
  const [text, setText] = useState("");
  const [parentId, setParentId] = useState(null);
  const [showComments, setShowComments] = useState({});
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
    if (!token) {
      toast.error("Please login to like posts");
      navigate("/login");
      return;
    }

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
    if (!token) {
      toast.error("Please login to save posts");
      navigate("/login");
      return;
    }

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

  // ✅ Get user info from token
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
  // ✅ Handle delete comment
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

              {renderComments(commentsArray, postId, c._id)}
            </div>
          </div>
        </div>
      ));
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

      {posts.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts available yet.</p>
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white border-b border-gray-200 p-6 mb-8 duration-300 flex flex-col md:flex-row justify-between items-start gap-6"
        >
          <div className="flex-1 w-full">
            <div
              onClick={() => navigate(`/post/${post._id}`)}
              className="cursor-pointer"
            >
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
            </div>

            <div className="flex justify-between text-gray-500 mt-4">
              <div className="flex items-center text-sm gap-4">
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

            {/* Comments Section */}
            {showComments[post._id] && (
              <div className="mt-6 border-t pt-4 w-full">
                <div className="mb-4">
                  {renderComments(comments[post._id], post._id)}
                </div>

                <form
                  onSubmit={(e) => handleAddComment(e, post._id)}
                  className="flex gap-2"
                >
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
                    Post
                  </button>
                </form>
              </div>
            )}

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
              className="w-48 h-32 object-cover rounded-md cursor-pointer"
              onClick={() => navigate(`/post/${post._id}`)}
            />
          )}
        </div>
      ))}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
