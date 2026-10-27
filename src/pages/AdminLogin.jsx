import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "មិនអាចចូលគណនីបានទេ។");
      }

      toast.success("ចូលគណនី Admin បានជោគជ័យ");
      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(error.message || "មិនអាចភ្ជាប់ទៅកាន់ server បានទេ។");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[65vh] flex items-center justify-center border-t bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="w-[90%] sm:max-w-md bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4"
      >
        <div className="text-center mb-3">
          <h1 className="text-3xl font-semibold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-2">ចូលគ្រប់គ្រងទំនិញក្នុងហាង</p>
        </div>

        <label className="text-sm font-medium">
          អ៊ីមែល
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
            required
          />
        </label>

        <label className="text-sm font-medium">
          ពាក្យសម្ងាត់
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border rounded-lg px-4 py-3 outline-none focus:border-black"
            required
          />
        </label>

        <button
          disabled={submitting}
          className="bg-black text-white rounded-lg py-3 mt-2 hover:bg-gray-800 transition disabled:opacity-60"
        >
          {submitting ? "កំពុងចូល..." : "ចូលជា Admin"}
        </button>

        <Link to="/login" className="text-center text-sm text-gray-500 hover:text-black">
          ត្រឡប់ទៅ Login អ្នកទិញ
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
