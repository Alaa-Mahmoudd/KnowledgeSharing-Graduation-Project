import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function AddPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    files.forEach((file) => formData.append("files", file));

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://knowledge-sharing-pied.vercel.app/post/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `noteApp__${token}`,
          },
        }
      );

      navigate("/post");
      toast.success("Post Created!");
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("invalid information , please try again");
      } else {
        toast.error(
          "An error occurred while creating the post. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-white mt-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title ..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold placeholder-gray-400 focus:outline-none p-2"
        />

        <textarea
          placeholder="Tell Your Story ..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full text-lg placeholder-gray-500 focus:outline-none p-2 resize-none leading-relaxed"
        />

        <div className="flex items-center gap-2">
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            Attach Files (PDF, Images, Videos)
          </label>
          <label htmlFor="files" className="cursor-pointer">
            <FaFilePdf className="text-blue-600 text-2xl" />
          </label>
          <input
            id="files"
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="hidden"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : "Post"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
