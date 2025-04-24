import React, { useState } from "react";
import {
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaStar,
  FaImage,
  FaVideo,
  FaTimes,
} from "react-icons/fa";

const Profile = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "The Future of AI",
      content:
        "Exploring how artificial intelligence is shaping the world and what the future holds.",
      likes: 0,
      comments: 0,
      saved: 0,
      rate: 0,
    },
    {
      id: 2,
      title: "React vs Vue: Which One to Choose?",
      content:
        "A comparison between two of the most popular JavaScript frameworks for front-end development.",
      likes: 0,
      comments: 0,
      saved: 0,
      rate: 0,
    },
    {
      id: 3,
      title: "Mastering Tailwind CSS",
      content:
        "Tips and tricks to efficiently use Tailwind CSS for building modern, responsive UIs.",
      likes: 0,
      comments: 0,
      saved: 0,
      rate: 0,
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [showPostBox, setShowPostBox] = useState(false); // Control visibility of the post box

  const handleCreatePost = () => {
    if (newPost.trim() === "") return; // Don't create an empty post
    const newPostData = {
      id: posts.length + 1,
      title: newPost,
      content: "This is a new post.",
      likes: 0,
      comments: 0,
      saved: 0,
      rate: 0,
    };
    setPosts([newPostData, ...posts]);
    setNewPost(""); // Clear the input after creating the post
    setShowPostBox(false); // Close the post box after submission
  };

  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, comments: post.comments + 1 } : post
      )
    );
  };

  const handleSave = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, saved: post.saved + 1 } : post
      )
    );
  };

  const handleRate = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, rate: post.rate + 1 } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#E3ECE7] p-6 relative">
      <div className="mt-6 flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Alaa Mahmoud</h2>
          <nav className="mt-2 flex gap-4">
            <a
              href="#"
              className="font-bold text-black border-b-2 border-black"
            >
              Posts
            </a>
            <a href="#" className="text-[#7A9EB8]">
              Edit Profile
            </a>
          </nav>
        </div>
      </div>

      {/* Button to show input box */}
      <div className="mt-6">
        <button
          onClick={() => setShowPostBox(true)}
          className="w-full p-4 bg-[#7A9EB8] text-white  shadow-md cursor-pointer focus:outline-none"
        >
          What is on your mind?
        </button>
      </div>

      {/* Post Box */}
      {showPostBox && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-blur-lg">
          <div className="p-15 bg-white shadow-md rounded-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowPostBox(false)}
              className="absolute top-2 right-2 text-lg text-gray-500"
            >
              <FaTimes />
            </button>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your post..."
              className="w-full p-4  border border-gray-300 shadow-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7A9EB8]"
            />
            <div className="mt-4 flex gap-4">
              <button className="text-gray-600">
                <FaImage />
              </button>
              <button className="text-gray-600">
                <FaVideo />
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreatePost}
                className="p-2 bg-[#7A9EB8] text-white shadow-md  focus:outline-none"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="mt-6 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-[#E3ECE7] text-black rounded-lg w-full shadow-md"
          >
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-700 mt-2">{post.content}</p>
            <div className="mt-4 flex items-center gap-6 text-lg text-gray-600">
              {/* Like Button */}
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2"
              >
                <FaRegHeart /> {post.likes}
              </button>
              {/* Comment Button */}
              <button
                onClick={() => handleComment(post.id)}
                className="flex items-center gap-2"
              >
                <FaRegComment /> {post.comments}
              </button>
              {/* Save Button */}
              <button
                onClick={() => handleSave(post.id)}
                className="flex items-center gap-2"
              >
                <FaRegBookmark /> {post.saved}
              </button>
              {/* Rate Button */}
              <button
                onClick={() => handleRate(post.id)}
                className="flex items-center gap-2"
              >
                <FaStar /> {post.rate}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
