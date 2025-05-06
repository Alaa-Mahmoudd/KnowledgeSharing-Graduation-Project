// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   FaThumbsUp,
//   FaRegThumbsUp,
//   FaComment,
//   FaBookmark,
//   FaStar,
//   FaTrash,
//   FaEdit,
//   FaHeart,
// } from "react-icons/fa";
// import { ThreeDots } from "react-loader-spinner";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";

// export default function KnowledgeCorner() {
//   const [posts, setPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [files, setFiles] = useState([]);
//   const [isPosting, setIsPosting] = useState(false);
//   const [editingPostId, setEditingPostId] = useState(null);

//   // States for loading each interaction
//   const [isLoadingLike, setIsLoadingLike] = useState(false);
//   const [isLoadingSave, setIsLoadingSave] = useState(false);
//   const [isLoadingRate, setIsLoadingRate] = useState(false);
//   // States to store like count and ratings count
//   const [likeCounts, setLikeCounts] = useState({});
//   const [ratingCounts, setRatingCounts] = useState({});
//   // Fetch all posts
//   const getAllPosts = async () => {
//     try {
//       const { data } = await axios.get(
//         "https://knowledge-sharing-pied.vercel.app/post/list"
//       );
//       setPosts(data.posts || []);
//       setIsLoading(false);
//       // Fetch like and rating counts after fetching posts
//       data.posts.forEach((post) => {
//         getLikesCount(post._id);
//         getRatingsCount(post._id);
//       });
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       setError("Failed to load posts. Please try again later.");
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllPosts();
//   }, []);

//   // Handle post creation
//   const handleCreatePost = async () => {
//     if (!title || !content) {
//       toast.error("Title and Content are required!");
//       return;
//     }
//     setIsPosting(true);
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     Array.from(files).forEach((file) => formData.append("files", file));

//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.post(
//         "https://knowledge-sharing-pied.vercel.app/post/add",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             token: `noteApp__${token}`,
//           },
//         }
//       );
//       toast.success("Post created successfully!");
//       await getAllPosts();
//       setShowForm(false);
//       setTitle("");
//       setContent("");
//       setFiles([]);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (error) {
//       toast.error("Failed to create post. Try again.");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   // Handle post update
//   const handleUpdatePost = async () => {
//     if (!title || !content) {
//       toast.error("Title and Content are required!");
//       return;
//     }
//     setIsPosting(true);
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", content);
//     Array.from(files).forEach((file) => formData.append("files", file));

//     const token = localStorage.getItem("token");
//     try {
//       const response = await axios.put(
//         `https://knowledge-sharing-pied.vercel.app/post/update/${editingPostId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             token: `noteApp__${token}`,
//           },
//         }
//       );
//       toast.success("Post updated successfully!");
//       await getAllPosts();
//       // Update the post in the list
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === editingPostId ? { ...post, ...response.data.post } : post
//         )
//       );

//       setEditingPostId(null);
//       setShowForm(false);
//       setTitle("");
//       setContent("");
//       setFiles([]);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (error) {
//       toast.error("Failed to update post. Try again.");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   // Handle delete post (DELETE)
//   const handleDeletePost = async (postId) => {
//     const token = localStorage.getItem("token");
//     try {
//       await axios.delete(
//         `https://knowledge-sharing-pied.vercel.app/post/delete/${postId}`,
//         {
//           headers: {
//             token: `noteApp__${token}`,
//           },
//         }
//       );
//       toast.success("Post deleted successfully!");
//       await getAllPosts();
//       setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//     } catch (error) {
//       toast.error("Failed to delete post. Try again.");
//     }
//   };

//   // interactions
//   // Handle Like Post
//   const handleLikePost = async (postId) => {
//     setIsLoadingLike(true);
//     const token = localStorage.getItem("token");

//     if (likeCounts[postId] && likeCounts[postId] > 0) {
//       toast.info("You already liked this post.");
//       setIsLoadingLike(false);
//       return;
//     }

//     try {
//       await axios.post(
//         `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/like`,
//         {},
//         {
//           headers: {
//             token: `noteApp__${token}`,
//           },
//         }
//       );
//       toast.success("Post liked!");

//       setLikeCounts((prevCounts) => ({
//         ...prevCounts,
//         [postId]: (prevCounts[postId] || 0) + 1,
//       }));
//     } catch (error) {
//       console.error("Error liking post:", error);
//       toast.error("Failed to like post.");
//     } finally {
//       setIsLoadingLike(false);
//     }
//   };

//   // Handle Save Post
//   const handleSavePost = async (postId) => {
//     setIsLoadingSave(true);
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(
//         `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/save`,
//         {},
//         {
//           headers: {
//             token: `noteApp__${token}`,
//           },
//         }
//       );
//       toast.success("Post saved!");
//       await getAllPosts();
//     } catch (error) {
//       console.error("Error saving post:", error);
//       toast.error("Failed to save post.");
//     } finally {
//       setIsLoadingSave(false);
//     }
//   };

//   // Handle Rate Post
//   const handleRatePost = async (postId, rating) => {
//     setIsLoadingRate(true);
//     const token = localStorage.getItem("token");

//     if (ratingCounts[postId] && ratingCounts[postId] > 0) {
//       toast.info("You already rated this post.");
//       setIsLoadingRate(false);
//       return;
//     }

//     try {
//       await axios.post(
//         `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/rate`,
//         { rating },
//         {
//           headers: {
//             token: `noteApp__${token}`,
//           },
//         }
//       );

//       // await getRatingsCount(postId);
//       toast.success("Post rated!");
//       setRatingCounts((prevRatings) => ({
//         ...prevRatings,
//         [postId]: (prevRatings[postId] || 0) + 1,
//       }));
//     } catch (error) {
//       toast.error("Failed to rate post.");
//     } finally {
//       setIsLoadingRate(false);
//     }
//   };

//   // Fetch like count for a post
//   const getLikesCount = async (postId) => {
//     try {
//       const response = await axios.get(
//         `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/likes_count`
//       );
//       setLikeCounts((prevCounts) => ({
//         ...prevCounts,
//         [postId]: response.data.likesCount,
//       }));
//     } catch (error) {
//       console.error("Error fetching like count:", error);
//     }
//   };

//   // Fetch ratings count for a post
//   const getRatingsCount = async (postId) => {
//     try {
//       const response = await axios.get(
//         `https://knowledge-sharing-pied.vercel.app/interaction/${postId}/ratings_count`
//       );
//       setRatingCounts((prevCounts) => ({
//         ...prevCounts,
//         [postId]: response.data.ratingCounts,
//       }));
//     } catch (error) {
//       console.error("Error fetching ratings count:", error);
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <ThreeDots visible={true} height="80" width="80" color="#000" />
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-600 text-lg font-semibold">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full px-4 mt-6 relative">
//       <ToastContainer />
//       {/* Open Post Modal */}
//       <div className="bg-[#E3ECE7] p-4 max-w-4xl mx-auto mb-10">
//         <input
//           type="text"
//           placeholder="Write Your Post ...."
//           className="w-full bg-gray-100 rounded-full px-4 py-3 text-gray-700 focus:outline-none cursor-pointer"
//           readOnly
//           onClick={() => setShowForm(true)}
//         />
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
//           <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative">
//             <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
//               {editingPostId ? "Update Post" : "Create New Post"}
//             </h2>
//             <form>
//               <input
//                 type="text"
//                 placeholder="Post Title"
//                 className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//               <textarea
//                 placeholder="Post Content"
//                 rows="4"
//                 className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//               />
//               <input
//                 type="file"
//                 className="mb-6"
//                 multiple
//                 onChange={(e) => setFiles(e.target.files)}
//               />
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={editingPostId ? handleUpdatePost : handleCreatePost}
//                   disabled={isPosting}
//                   className={`bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition ${
//                     isPosting ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {isPosting
//                     ? editingPostId
//                       ? "Updating..."
//                       : "Posting..."
//                     : editingPostId
//                     ? "Update"
//                     : "Post"}
//                 </button>
//               </div>
//             </form>
//             <button
//               onClick={() => {
//                 setEditingPostId(null);
//                 setShowForm(false);
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Posts List */}
//       <div className={`max-w-4xl mx-auto ${showForm ? "blur-sm" : ""}`}>
//         {posts.length > 0 ? (
//           posts.map((post) =>
//             post && post.title ? (
//               <div
//                 key={post._id}
//                 className="bg-[#E3ECE7] p-4 rounded-lg shadow-md mb-4"
//               >
//                 <Link to={`/knowledgeCorner/${post._id}`}>
//                   <h2 className="text-lg font-semibold capitalize">
//                     {post.title}
//                   </h2>

//                   <p className="text-gray-600">
//                     By {post.author?.name || "Unknown"}
//                   </p>
//                   <p className="mt-1 text-gray-500 text-sm">
//                     {post.description || ""}
//                   </p>
//                   <p className="mt-2 text-gray-700">{post.content}</p>

//                   {post.files && post.files.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-medium text-gray-600">
//                         Attached Files
//                       </h4>
//                       <ul className="list-disc pl-5">
//                         {post.files.map((file, idx) => (
//                           <li key={idx}>
//                             <a
//                               href={file}
//                               className="text-blue-500"
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {file}
//                             </a>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </Link>
//                 <div className="flex justify-between">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleLikePost(post._id)}
//                       className="flex items-center space-x-1 text-red-500 hover:text-red-700 cursor-pointer"
//                       title="Like"
//                     >
//                       {isLoadingLike ? (
//                         <ThreeDots width="20" height="20" color="red" />
//                       ) : (
//                         <FaHeart />
//                       )}
//                       <span>{likeCounts[post._id] || 0}</span>
//                     </button>
//                     <button
//                       className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 cursor-pointer"
//                       title="Comment"
//                     >
//                       <FaComment /> <span></span>
//                     </button>
//                     <button
//                       onClick={() => {
//                         const userRating = prompt(
//                           "Rate this post from 1 to 5:"
//                         );
//                         const ratingValue = parseInt(userRating);
//                         if (ratingValue >= 1 && ratingValue <= 5) {
//                           handleRatePost(post._id, ratingValue);
//                         } else {
//                           toast.error(
//                             "Invalid rating. Please enter a number between 1 and 5."
//                           );
//                         }
//                       }}
//                       className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-700 cursor-pointer"
//                       title="Rate"
//                     >
//                       {isLoadingRate ? (
//                         <ThreeDots width="20" height="20" color="yellow" />
//                       ) : (
//                         <FaStar />
//                       )}
//                       <span>{ratingCounts[post._id] || 0}</span>
//                     </button>

//                     <button
//                       onClick={() => handleSavePost(post._id)}
//                       className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 cursor-pointer"
//                       title="Save"
//                     >
//                       {isLoadingSave ? (
//                         <ThreeDots width="20" height="20" color="gray" />
//                       ) : (
//                         <FaBookmark />
//                       )}
//                     </button>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setEditingPostId(post._id);
//                         setTitle(post.title);
//                         setContent(post.content);
//                         setShowForm(true);
//                       }}
//                       className="flex items-center space-x-1 text-green-500 hover:text-green-700 cursor-pointer"
//                       title="Edit"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDeletePost(post._id)}
//                       className="flex items-center space-x-1 text-red-500 hover:text-red-700 cursor-pointer"
//                       title="Delete"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : null
//           )
//         ) : (
//           <p className="text-center">No posts available</p>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function KnowledgeCorner() {
  return <div>KnowledgeCorner</div>;
}
