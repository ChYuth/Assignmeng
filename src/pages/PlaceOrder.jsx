import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);

  const inputClass =
    "border border-gray-300 rounded-lg py-3 px-4 w-full outline-none focus:border-black";

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-10 pt-10 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[520px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          <input className={inputClass} type="text" placeholder="First Name" />
          <input className={inputClass} type="text" placeholder="Last Name" />
        </div>

        <input className={inputClass} type="email" placeholder="Email Address" />
        <input className={inputClass} type="text" placeholder="Street" />

        <div className="flex gap-3">
          <input className={inputClass} type="text" placeholder="City" />
          <input className={inputClass} type="text" placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input className={inputClass} type="number" placeholder="Zipcode" />
          <input className={inputClass} type="text" placeholder="Country" />
        </div>

        <input className={inputClass} type="number" placeholder="Phone" />
      </div>

      <div className="mt-8 min-w-80">
        <CartTotal />

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex flex-col gap-3 lg:flex-row mt-5">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border rounded-xl p-3 px-4 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border rounded-xl p-3 px-4 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>

            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border rounded-xl p-3 px-4 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={() => navigate("/orders")}
              className="bg-black text-white px-16 py-3 rounded-full text-sm hover:bg-gray-800 transition"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;