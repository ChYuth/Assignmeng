import React from "react";

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-black text-white rounded-3xl px-6 py-14 text-center my-20">
      <p className="text-2xl sm:text-3xl font-semibold">
        Subscribe & Get 20% Off
      </p>

      <p className="text-gray-400 mt-3">
        Join our newsletter for exclusive deals and new arrivals.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="max-w-xl mx-auto mt-8 flex bg-white rounded-full overflow-hidden"
      >
        <input
          className="flex-1 px-6 py-4 text-black outline-none text-sm"
          type="email"
          placeholder="Enter your email"
          required
        />

        <button
          type="submit"
          className="bg-gray-900 text-white px-6 sm:px-10 text-sm hover:bg-gray-700 transition"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;