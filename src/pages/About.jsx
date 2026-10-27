import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div className="border-t">
      <div className="text-3xl text-center pt-12">
        <Title text1="ABOUT" text2="US" />
      </div>

      <div className="my-16 flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[500px] rounded-3xl shadow-lg"
          src={assets.about_img}
          alt="About"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p className="leading-7">
            Shop Eco is a modern fashion store focused on comfort, style, and quality.
          </p>
          <p className="leading-7">
            We select trendy collections to help customers express their style with confidence.
          </p>

          <b className="text-gray-900 text-lg">Our Mission</b>
          <p className="leading-7">
            Our mission is to provide premium fashion with affordable prices and a smooth shopping experience.
          </p>
        </div>
      </div>

      <div className="text-3xl py-6">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="border rounded-2xl p-10 shadow-sm hover:shadow-md transition">
          <b className="text-lg">Quality Assurance</b>
          <p className="text-gray-600 mt-4 leading-7">
            Every product is checked carefully to ensure premium quality.
          </p>
        </div>

        <div className="border rounded-2xl p-10 shadow-sm hover:shadow-md transition">
          <b className="text-lg">Convenience</b>
          <p className="text-gray-600 mt-4 leading-7">
            Easy shopping, fast checkout, and simple order tracking.
          </p>
        </div>

        <div className="border rounded-2xl p-10 shadow-sm hover:shadow-md transition">
          <b className="text-lg">Customer Service</b>
          <p className="text-gray-600 mt-4 leading-7">
            Friendly support team available to help you anytime.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;