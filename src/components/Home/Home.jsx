import React from "react";
import { useNavigate } from "react-router-dom";
import HomePic from "../../assets/images/homepic.jpg";
import About from "../About/About";
import Card from "../Card/Card";

export default function Home() {
  const navigate = useNavigate();

  const goToKnowledgeCorner = () => {
    navigate("/knowledgecorner");
  };

  return (
    <div>
      <div className="bg-[#E3ECE7] min-h-screen flex items-center justify-center px-10 mb-[-1px]">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Connect, <br /> Learn & Empower
            </h1>
            <p className="text-gray-600 text-lg mt-4">
              Empowering Individuals with Disabilities Through Technology.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-[#5F85A3] text-white text-lg font-medium rounded-full shadow-md hover:bg-[#7A9EB8] transition-all"
              onClick={goToKnowledgeCorner}
            >
              Start reading
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src={HomePic}
              alt="Home Page Illustration"
              className="max-w-xl md:max-w-2xl lg:max-w-3xl w-full h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </div>
      <About />
      <Card />
    </div>
  );
}
