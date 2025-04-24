import { useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Ahmed" },
    { id: 2, name: "Mona" },
    { id: 3, name: "Omar" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, user: "Ahmed", content: "First post!" },
    { id: 2, user: "Mona", content: "Hello world!" },
  ]);

  const [products, setProducts] = useState([
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
  ]);

  const [newProduct, setNewProduct] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const addProduct = () => {
    if (newProduct.trim()) {
      setProducts([...products, { id: Date.now(), name: newProduct }]);
      setNewProduct("");
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Main Cards Section */}
      <div className="grid grid-cols-3 gap-6">
        <div
          onClick={() => setActiveSection("users")}
          className="p-6 bg-blue-500 text-white text-center rounded-lg shadow-lg cursor-pointer hover:bg-blue-600"
        >
          <h2 className="text-xl font-semibold">User Accounts</h2>
        </div>
        <div
          onClick={() => setActiveSection("posts")}
          className="p-6 bg-green-500 text-white text-center rounded-lg shadow-lg cursor-pointer hover:bg-green-600"
        >
          <h2 className="text-xl font-semibold">Posts</h2>
        </div>
        <div
          onClick={() => setActiveSection("products")}
          className="p-6 bg-purple-500 text-white text-center rounded-lg shadow-lg cursor-pointer hover:bg-purple-600"
        >
          <h2 className="text-xl font-semibold">Products</h2>
        </div>
      </div>

      {/* Details Section */}
      {activeSection === "users" && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">User Accounts</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{user.name}</span>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSection === "posts" && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Posts</h2>
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>
                {post.user}: {post.content}
              </span>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {activeSection === "products" && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="border p-2 flex-grow"
              placeholder="New product..."
            />
            <button
              onClick={addProduct}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{product.name}</span>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
