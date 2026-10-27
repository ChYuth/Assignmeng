import { createContext, useCallback, useEffect, useState } from "react";
import { products as initialProducts } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState(initialProducts);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("fakeUser")) || null
  );

  const navigate = useNavigate();

  const refreshProducts = useCallback(async () => {
    let response;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      try {
        response = await fetch("/api/products");
      } catch (error) {
        if (attempt === 11) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      if (response.ok) {
        const addedProducts = await response.json();
        setProducts([...initialProducts, ...addedProducts]);
        return;
      }
      if (response.status < 500 || attempt === 11) {
        throw new Error(`Unable to load products from the server (${response.status}).`);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }, []);

  useEffect(() => {
    refreshProducts().catch((error) => {
      console.error(error);
      toast.error("មិនអាចភ្ជាប់ទៅកាន់ server ទំនិញបានទេ។ សូមបើក terminal ក្នុង sbt-main ហើយដំណើរការ npm run dev");
    });
  }, [refreshProducts]);

  const fakeLogin = (email, password, name = "Customer") => {
    const fakeUser = {
      name,
      email,
    };

    localStorage.setItem("fakeUser", JSON.stringify(fakeUser));
    setUser(fakeUser);
    toast.success("Login successful");
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("fakeUser");
    setUser(null);
    toast.success("Logged out");
    navigate("/login");
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0 && itemInfo) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }

    return totalAmount;
  };

  const value = {
    products,
    refreshProducts,
    currency,
    delivery_fee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,

    user,
    fakeLogin,
    logout,

    navigate,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;