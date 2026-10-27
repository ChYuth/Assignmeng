import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div className="border-t">
      <div className="text-center text-3xl pt-12">
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="my-16 flex flex-col md:flex-row gap-12 items-center">
        <img
          className="w-full md:max-w-[500px] rounded-3xl shadow-lg"
          src={assets.contact_img}
          alt="Contact"
        />

        <div className="flex flex-col gap-6 text-gray-600">
          <div>
            <p className="font-semibold text-2xl text-gray-800">Our Store</p>
            <p className="mt-4 leading-7">
              Phnom Penh, Cambodia <br />
              Shop Eco Fashion Center
            </p>
          </div>

          <p className="leading-7">
            Phone: +855 987654321 <br />
            Email: shopeco@gmail.com
          </p>

          <div>
            <p className="font-semibold text-xl text-gray-800">
              Careers at Shop Eco
            </p>
            <p className="mt-3">Explore opportunities and join our team.</p>
          </div>

          <button className="w-fit border border-black px-8 py-4 rounded-full text-sm hover:bg-black hover:text-white transition">
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;