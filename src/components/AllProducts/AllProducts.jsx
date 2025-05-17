import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    link: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("https://knowledge-sharing-pied.vercel.app/product")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://knowledge-sharing-pied.vercel.app/admin/${id}`,
        {
          headers: { token },
          data: { id },
        }
      );
      toast.success("Product deleted successfully");
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productImage", productImage);
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("link", newProduct.link);

    try {
      await axios.post(
        "https://knowledge-sharing-pied.vercel.app/admin/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      toast.success("Product added successfully ");
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add product ");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      link: product.link,
    });
    setShowForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (productImage) formData.append("productImage", productImage);
    if (newProduct.name) formData.append("name", newProduct.name);
    if (newProduct.description)
      formData.append("description", newProduct.description);
    if (newProduct.price) formData.append("price", newProduct.price);
    if (newProduct.link) formData.append("link", newProduct.link);

    try {
      const res = await axios.put(
        `https://knowledge-sharing-pied.vercel.app/admin/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      toast.success("Product updated successfully");

      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id
            ? {
                ...p,
                ...newProduct,
                productImage: productImage
                  ? { url: URL.createObjectURL(productImage) }
                  : p.productImage,
              }
            : p
        )
      );

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update product ");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setNewProduct({ name: "", description: "", price: "", link: "" });
    setProductImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots height="80" width="80" color="#000" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <button
        onClick={() => (editingProduct ? resetForm() : setShowForm(!showForm))}
        className="mb-4 bg-green-500 w-full text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {showForm ? "Close Form" : "Add Product"}
      </button>

      {showForm && (
        <form
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          className="mb-6 p-4 border rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
              required={!editingProduct}
            />
            {editingProduct && productImage === null && (
              <img
                src={`${
                  editingProduct.productImage?.url
                }?t=${new Date().getTime()}`}
                alt="Current product"
                className="w-20 h-20 object-cover mt-2"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              minLength={2}
              maxLength={20}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              minLength={10}
              maxLength={200}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              min={1}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Link</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newProduct.link}
              onChange={(e) =>
                setNewProduct({ ...newProduct, link: e.target.value })
              }
              minLength={2}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingProduct ? "Update Product" : "Submit Product"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-300"
          >
            <img
              src={`${product.productImage?.url}?t=${new Date().getTime()}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">${product.price}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
              >
                Buy Now
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
