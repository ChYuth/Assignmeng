import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-3xl mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="flex flex-col gap-5">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-5 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <img
                  className="w-24 rounded-xl"
                  src={productData.image[0]}
                  alt={productData.name}
                />

                <div>
                  <p className="font-semibold text-lg">{productData.name}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>

                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {item.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(e) => {
                    if (e.target.value !== "" && e.target.value !== "0") {
                      updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      );
                    }
                  }}
                  className="border rounded-lg w-16 px-2 py-1"
                />

                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />

          <div className="text-end mt-8">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;