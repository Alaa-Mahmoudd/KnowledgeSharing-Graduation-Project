import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://knowledge-sharing-pied.vercel.app/product")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-white py-8 mt-10">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          NO PRODUCTS AVAILABLE
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={
                  product.productImage?.url || "https://via.placeholder.com/300"
                }
                alt={product.name || "Product image"}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 flex flex-col h-64">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {truncateText(product.name, 50) || "No product name"}
                </h2>
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {truncateText(product.description, 150) ||
                    "No description available"}
                </p>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-gray-800 mb-4">
                    ${product.price || "N/A"}
                  </p>
                  <a
                    href={product.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
