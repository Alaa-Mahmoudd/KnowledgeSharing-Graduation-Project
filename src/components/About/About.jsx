import React from "react";
import AboutPic from "../../assets/images/smiling-volunteers-helping-disabled-people-isolated-flat-illustration-cartoon-illustration_74855-14516.jpg";

export default function AboutUs() {
  return (
    <div className="bg-[#E3ECE7] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl w-full bg-[#E3ECE7] rounded-lg shadow-lg p-8 flex flex-col-reverse md:flex-row items-center gap-10 border border-gray-300">
        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={AboutPic}
            alt="About Us Illustration"
            className="max-w-md md:max-w-lg w-full h-auto mix-blend-multiply rounded-lg shadow-md transform hover:scale-105 transition duration-300"
          />
        </div>

        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900  tracking-wide border-b-4 border-[#5F85A3] inline-block pb-2">
            About Us
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            We are a team dedicated to transforming healthcare accessibility by
            providing knowledge, caregiving resources, and assistive tools,
            ensuring inclusivity for all. Our mission is to empower individuals,
            caregivers, and healthcare professionals through an accessible and
            user-friendly platform for learning, sharing, and connection.
          </p>
          <div className="flex justify-center md:justify-start">
            {/* <button className="mt-4 px-6 py-3 bg-[#5F85A3] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#7A9EB8] transform hover:scale-105 transition duration-300">
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
