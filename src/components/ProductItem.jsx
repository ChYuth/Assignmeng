import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[3/4]">
        <img
          src={image[0]}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-700 group-hover:text-black transition">
          {name}
        </p>
        <p className="text-sm font-semibold text-black mt-1">
          {currency}
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;