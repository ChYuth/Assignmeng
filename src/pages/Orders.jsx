import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className="border-t pt-16">
      <div className="text-3xl mb-8">
        <Title text1="MY" text2="ORDERS" />
      </div>

      <div className="flex flex-col gap-5">
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="border rounded-2xl p-5 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                className="w-20 rounded-xl"
                src={item.image[0]}
                alt={item.name}
              />

              <div>
                <p className="sm:text-base font-semibold">{item.name}</p>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-700">
                  <p className="text-lg">
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: 1</p>
                  <p>Size: M</p>
                </div>

                <p className="mt-2">
                  Date: <span className="text-gray-400">22 July 2025</span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">Ready to Ship</p>
              </div>

              <button className="border px-5 py-2 text-sm rounded-full hover:bg-black hover:text-white transition">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;