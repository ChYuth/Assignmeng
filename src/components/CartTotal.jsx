import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = Number(getCartAmount()) || 0;
  const shipping = Number(delivery_fee) || 0;
  const total = subtotal === 0 ? 0 : subtotal + shipping;

  return (
    <div className="w-full bg-white border rounded-2xl p-6 shadow-sm">
      <div className="text-2xl mb-4">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {subtotal.toFixed(2)}
          </p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency}
            {shipping.toFixed(2)}
          </p>
        </div>

        <hr />

        <div className="flex justify-between text-base">
          <b>Total</b>
          <b>
            {currency}
            {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;