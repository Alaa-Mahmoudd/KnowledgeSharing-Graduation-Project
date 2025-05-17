import React, { useEffect, useState } from "react";
import axios from "axios";

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [parentId, setParentId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://knowledge-sharing-pied.vercel.app/comment/${postId}/get`
      );
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await axios.post(
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
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://knowledge-sharing-pied.vercel.app/comment/${id}/delete`,
        {
          headers: {
            token: `noteApp__${token}`,
          },
        }
      );
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderComments = (comments, parent = null) => {
    return comments
      .filter((c) => c.parent_comment === parent)
      .map((c) => (
        <div key={c._id} style={{ marginLeft: parent ? "20px" : "0" }}>
          <p>{c.text}</p>
          <button onClick={() => setParentId(c._id)}>Reply</button>
          <button onClick={() => handleDelete(c._id)}>Delete</button>
          {renderComments(comments, c._id)}
        </div>
      ));
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <br />
        <button type="submit">{parentId ? "Reply" : "Add Comment"}</button>
        {parentId && (
          <button onClick={() => setParentId(null)}>Cancel Reply</button>
        )}
      </form>

      <div>{renderComments(comments)}</div>
    </div>
  );
};

export default Comment;
