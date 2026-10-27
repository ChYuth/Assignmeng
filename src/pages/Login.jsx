import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { fakeLogin } = useContext(ShopContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    fakeLogin(email, password, name || "Customer");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center border-t bg-gray-50">
      <form
        onSubmit={onSubmitHandler}
        className="w-[90%] sm:max-w-md bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4"
      >
        <div className="text-center mb-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {currentState}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Welcome to Shop Eco</p>
        </div>

        {currentState !== "Login" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="border rounded-lg px-4 py-3 outline-none focus:border-black"
            required
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email Address"
          className="border rounded-lg px-4 py-3 outline-none focus:border-black"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="border rounded-lg px-4 py-3 outline-none focus:border-black"
          required
        />

        <div className="flex justify-between text-sm text-gray-600">
          <p className="cursor-pointer hover:text-black">Forgot password?</p>

          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer hover:text-black"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:text-black"
            >
              Login here
            </p>
          )}
        </div>

        <button className="bg-black text-white rounded-lg py-3 mt-3 hover:bg-gray-800 transition">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
        <Link
          to="/admin/login"
          className="text-center text-sm text-gray-500 hover:text-black"
        >
          Admin? ចូលទីនេះ
        </Link>
      </form>
    </div>
  );
};

export default Login;