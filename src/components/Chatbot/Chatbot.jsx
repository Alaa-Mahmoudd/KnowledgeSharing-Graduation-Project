import React from "react";

const Chatbot = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Chatbot container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        {/* Chatbot header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-700">Chatbot</h2>
          <button className="text-gray-500 hover:text-gray-700">X</button>
        </div>

        {/* Chat window */}
        <div className="h-80 overflow-y-auto p-3 space-y-4 mt-4 bg-gray-50 rounded-md">
          {/* Example bot message */}
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg max-w-xs">
              Hello! How can I assist you today?
            </div>
          </div>

          {/* Example user message */}
          <div className="flex items-start justify-end space-x-2">
            <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-xs">
              I need help with my order.
            </div>
          </div>
        </div>

        {/* Message input field */}
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
