import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#f5f1eb] my-6">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-full sm:w-1/2 px-8 sm:px-16 py-16">
          <p className="text-sm tracking-[4px] text-gray-500 mb-4">
            NEW SEASON COLLECTION
          </p>

          <h1 className="text-4xl lg:text-6xl font-semibold text-gray-900 leading-tight">
            Modern Fashion <br /> For Everyday
          </h1>

          <p className="text-gray-600 mt-5 max-w-md">
            Discover clean, comfortable, and stylish pieces made for your daily
            look.
          </p>

          <Link
            to="/collection"
            className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-full text-sm hover:bg-gray-800 transition"
          >
            SHOP NOW
          </Link>
        </div>

        <div className="w-full sm:w-1/2">
          <img
            src={assets.hero_img}
            className="w-full h-full object-cover"
            alt="Hero"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;