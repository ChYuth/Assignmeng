import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange",
      text: "Simple and hassle-free exchange policy.",
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Return",
      text: "Return your order within 7 days.",
    },
    {
      icon: assets.support_img,
      title: "24/7 Support",
      text: "Friendly support whenever you need help.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-20">
      {policies.map((item, index) => (
        <div
          key={index}
          className="bg-white border rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
        >
          <img src={item.icon} className="w-12 mx-auto mb-5" alt="" />
          <p className="font-semibold text-gray-900">{item.title}</p>
          <p className="text-sm text-gray-500 mt-2">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default OurPolicy;